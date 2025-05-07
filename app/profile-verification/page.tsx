import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

// Create a Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function ProfileVerificationContent({ id }: { id: string }) {
  // Fetch the parent profile
  const { data: parentProfile, error: parentError } = await supabase
    .from("parent_profile")
    .select("*")
    .eq("id", id)
    .single()

  if (parentError) {
    console.error("Error fetching parent profile:", parentError)
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Error</CardTitle>
          <CardDescription className="text-red-600">
            Could not verify your profile. Please try again or contact support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error details: {parentError.message}</p>
        </CardContent>
        <CardFooter>
          <Link href="/profile-setup">
            <Button variant="outline">Return to Profile Setup</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Fetch the student profiles
  const { data: studentProfiles, error: studentError } = await supabase.from("student").select("*").eq("parent_id", id)

  if (studentError) {
    console.error("Error fetching student profiles:", studentError)
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <CardTitle className="text-green-700">Profile Created Successfully!</CardTitle>
        </div>
        <CardDescription className="text-green-600">
          Your parent and student profiles have been created successfully.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Parent Profile</h3>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <p>
              <span className="font-semibold">Name:</span> {parentProfile.first_name} {parentProfile.last_name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {parentProfile.email}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {parentProfile.state}, {parentProfile.school_district}
            </p>
          </div>
        </div>

        {studentProfiles && studentProfiles.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Student Profiles</h3>
            <div className="space-y-3">
              {studentProfiles.map((student) => (
                <div key={student.id} className="bg-white p-4 rounded-md border border-gray-200">
                  <p>
                    <span className="font-semibold">Name:</span> {student.first_name} {student.last_name}
                  </p>
                  <p>
                    <span className="font-semibold">Age:</span> {student.age}
                  </p>
                  <p>
                    <span className="font-semibold">Grade:</span> {student.grade_level}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/supabase-test">
          <Button variant="outline">Test Database Connection</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default async function ProfileVerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const id = searchParams.id as string

  if (!id) {
    redirect("/profile-setup")
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile Verification</h1>
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <ProfileVerificationContent id={id} />
        </Suspense>
      </div>
    </div>
  )
}
