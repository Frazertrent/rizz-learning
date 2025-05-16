import { TermPlanBuilder } from "@/components/parent/term-plan-builder"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function TermPlanBuilderPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  let parentId = searchParams.id

  // If no ID is provided, try to get the current user
  if (!parentId) {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      // Don't set a parentId at all if there's no user
      parentId = undefined
    } else {
      parentId = session.user.id
    }
  }

  // Clean the parentId to ensure it's a valid UUID format
  // This removes any $ or other non-UUID characters that might be present
  if (parentId) {
    parentId = parentId.replace(/[^a-fA-F0-9-]/g, "")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Term Plan Builder</h1>
      <TermPlanBuilder parentId={parentId} />
    </div>
  )
}
