"use server"

import { createClient } from "@/lib/supabase-server"

export async function checkTableSchema(tableName: string) {
  try {
    const supabase = createClient()

    // Query the table to get its structure
    const { data, error } = await supabase.from(tableName).select("*").limit(1)

    if (error) {
      return { success: false, error: error.message }
    }

    // If data is empty, try to get the structure from the database directly
    if (!data || data.length === 0) {
      // For PostgreSQL, we can query the information_schema
      const { data: schemaData, error: schemaError } = await supabase.rpc("get_table_columns", {
        table_name: tableName,
      })

      if (schemaError) {
        return { success: false, error: schemaError.message }
      }

      return { success: true, schema: schemaData }
    }

    // If we have data, we can infer the schema from it
    const sampleRow = data[0]
    const schema = Object.keys(sampleRow).map((column) => ({
      column_name: column,
      data_type: typeof sampleRow[column],
    }))

    return { success: true, schema }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
