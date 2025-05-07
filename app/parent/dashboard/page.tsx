import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/get-session"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function ParentDashboardPage() {
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

  // Fetch student profiles
  const { data: studentProfiles, error: studentError } = await supabase
    .from("student")
    .select("*")
    .eq("parent_id", userId)

  if (studentError) {
    console.error("Error fetching student profiles:", studentError)
  }

  // Check if parent has completed the intake form
  const { data: intakeForm, error: intakeError } = await supabase
    .from("parent_intake_form")
    .select("*")
    .eq("parent_id", userId)
    .single()

  const hasCompletedIntake = intakeForm?.completed || false

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Parent Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {parentProfile.first_name}!</CardTitle>
            <CardDescription>
              {hasCompletedIntake
                ? "Your profile is complete and ready to go."
                : "Your profile setup is almost complete."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{parentProfile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{parentProfile.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">School District:</span>
                <span>{parentProfile.school_district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of Students:</span>
                <span>{parentProfile.number_of_students}</span>
              </div>
            </div>
          </CardContent>
          {!hasCompletedIntake && (
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/parent-intake?id=${userId}`}>Complete Parent Intake Form</Link>
              </Button>
            </CardFooter>
          )}
        </Card>

        {studentProfiles &&
          studentProfiles.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle>{student.full_name}</CardTitle>
                <CardDescription>Student Profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span>{student.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grade Level:</span>
                    <span>{student.grade_level}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/parent/students/${student.id}`}>View Student Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

        {(!studentProfiles || studentProfiles.length === 0) && (
          <Card>
            <CardHeader>
              <CardTitle>No Students</CardTitle>
              <CardDescription>You haven't added any students yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add students to your profile to get started.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/profile-setup">Add Students</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
