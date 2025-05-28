import { SchemaChecker } from "@/components/schema-checker"

export default function SchemaCheckerPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Database Schema Checker</h1>
      <SchemaChecker />
    </div>
  )
}
