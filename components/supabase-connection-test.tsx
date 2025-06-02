"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database } from "lucide-react"

export function SupabaseConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      // Test the connection by making a simple query
      const { data, error } = await supabase.from("parent_intake_form").select("id").limit(1)

      if (error) throw error

      setIsConnected(true)

      // Get list of tables
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")

      if (tablesError) throw tablesError

      if (tablesData) {
        setTables(tablesData.map((t) => t.table_name).sort())
      }
    } catch (err) {
      setIsConnected(false)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          Supabase Connection Test
        </CardTitle>
        <CardDescription>Testing connection to your new Supabase project</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {isConnected === true && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle>Connection Successful</AlertTitle>
                <AlertDescription>Successfully connected to your Supabase project.</AlertDescription>
              </Alert>
            )}

            {isConnected === false && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <XCircle className="h-5 w-5 text-red-500" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>{error || "Could not connect to your Supabase project."}</AlertDescription>
              </Alert>
            )}

            {tables.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Available Tables:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {tables.map((table) => (
                    <li key={table} className="bg-gray-100 p-2 rounded">
                      {table}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={loading}>
          {loading ? "Testing..." : "Test Connection Again"}
        </Button>
      </CardFooter>
    </Card>
  )
}
