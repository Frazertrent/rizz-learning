import { redirect } from "next/navigation"
import { ParentIntakeForm } from "@/components/auth/parent-intake-form"
import { getSession } from "@/lib/get-session"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function ParentIntakePage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id
  const supabase = createServerSupabaseClient()

  // Fetch parent profile
  const { data: parentProfile, error: parentError } = await supabase
    .from("parent_profile")
    .select("*")
    .eq("id", userId)
    .single()

  if (parentError) {
    console.error("Error fetching parent profile:", parentError)
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8">
      <ParentIntakeForm parentId={userId} parentName={`${parentProfile.first_name} ${parentProfile.last_name}`} />
    </div>
  )
}
