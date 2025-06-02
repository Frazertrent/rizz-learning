import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import { supabaseServer } from "@/lib/supabase-server"

export default async function ProfileConfirmationPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const parentId = searchParams.id

  if (!parentId) {
    redirect("/profile-setup")
  }

  // Use supabaseServer instead of createServerSupabaseClient
  // This doesn't rely on cookies and is safe to use outside request contexts
  const supabase = supabaseServer

  // Fetch parent profile
  const { data: parentProfile, error: parentError } = await supabase
    .from("parent_intake_form")
    .select()
    .eq("id", parentId)
    .single()

  if (parentError) {
    console.error("Error fetching parent profile:", parentError)
    redirect("/profile-setup")
  }

  // Fetch student profiles
  const { data: studentProfiles, error: studentError } = await supabase
    .from("student")
    .select("*")
    .eq("parent_id", parentId)

  if (studentError) {
    console.error("Error fetching student profiles:", studentError)
  }

  const students = studentProfiles || []
  const parentName = `${parentProfile.first_name} ${parentProfile.last_name}`

  // Format student names
  const studentNames = students.map((student) => student.first_name)
  const formattedStudentNames = formatStudentNames(studentNames)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-gray-700 bg-gray-800/40 backdrop-blur-sm text-white">
          <CardHeader className="pb-8">
            <div className="mx-auto rounded-full bg-green-500/20 p-3 w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Success!</CardTitle>
            <CardDescription className="text-lg text-gray-300 text-center mt-2">
              Your profiles have been created successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="py-4 px-6 bg-gray-700/30 rounded-md">
              <p className="text-gray-300 text-lg">
                A parent profile has been created for <span className="font-bold text-white">{parentName}</span>
                {students.length > 0 && (
                  <>
                    , and student {students.length > 1 ? "profiles" : "profile"} for{" "}
                    <span className="font-bold text-white">{formattedStudentNames}</span>
                  </>
                )}
                .
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Next Steps</h3>
              <p className="text-gray-300">
                Now you can either visit your parent dashboard, or you can take the most important step and plan your
                first term. This will help you organize your curriculum and create a personalized learning schedule for
                each child.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild variant="outline" className="border-gray-600 hover:bg-gray-700 text-white min-w-[200px]">
              <Link href="/parent/dashboard">
                Go to Parent Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-w-[200px]"
            >
              <Link href={`/parent/term-plan-builder?id=${parentId}`}>
                Let's Plan Your First Term <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function formatStudentNames(names: string[]): string {
  if (names.length === 0) return ""
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`

  const allButLast = names.slice(0, -1).join(", ")
  return `${allButLast}, and ${names[names.length - 1]}`
}
