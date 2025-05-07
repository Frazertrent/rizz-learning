import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

export default function SupabaseTestPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Supabase Connection Test</h1>
      <SupabaseConnectionTest />
    </div>
  )
}
