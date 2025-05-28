"use client"

import { AddStudentModal } from "@/components/parent/add-student-modal"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Target, Users, Calendar, BookOpen, PlusCircle, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [termPlans, setTermPlans] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const router = useRouter()

  // Function to get user ID from various sources
  const getUserId = async () => {
    // Try to get from localStorage first
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      console.log("Using user ID from localStorage:", storedUserId)
      return storedUserId
    }

    // Try to get from stored user object
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && parsedUser.id) {
          console.log("Using user ID from stored user object:", parsedUser.id)
          return parsedUser.id
        }
      } catch (e) {
        console.error("Error parsing stored user:", e)
      }
    }

    // Try to get from Supabase auth
    try {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        console.log("Using user ID from Supabase auth:", user.id)
        return user.id
      }
    } catch (e) {
      console.error("Error getting user from Supabase:", e)
    }

    // If all else fails, use a demo user ID
    console.log("Using demo user ID")
    return "demo-user-" + Math.random().toString(36).substring(2, 9)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Get user ID
        const currentUserId = await getUserId()
        setUserId(currentUserId)

        // Store it for future use
        localStorage.setItem("userId", currentUserId)

        // Create Supabase client
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

        // Fetch students
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("*")
          .eq("parent_id", currentUserId)

        if (studentError) {
          console.error("Error fetching students:", studentError)
        } else {
          setStudents(studentData || [])
        }

        // Fetch term plans
        console.log("Fetching term plans for user ID:", currentUserId)
        const { data: termPlanData, error: termPlanError } = await supabase
          .from("term_plans")
          .select("*")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false })

        if (termPlanError) {
          console.error("Error fetching term plans:", termPlanError)
          setError(termPlanError.message)
        } else {
          console.log("Term plans fetched:", termPlanData)

          // Fetch student term plans for each term plan
          if (termPlanData && termPlanData.length > 0) {
            const termPlansWithStudents = await Promise.all(
              termPlanData.map(async (termPlan) => {
                const { data: studentTermPlans, error: studentTermPlanError } = await supabase
                  .from("student_term_plans")
                  .select("*")
                  .eq("term_plan_id", termPlan.id)

                if (studentTermPlanError) {
                  console.error("Error fetching student term plans:", studentTermPlanError)
                  return { ...termPlan, studentTermPlans: [] }
                }

                return { ...termPlan, studentTermPlans: studentTermPlans || [] }
              }),
            )

            setTermPlans(termPlansWithStudents)
          } else {
            setTermPlans([])
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error)
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to format the term name
  const formatTermName = (termPlan: any) => {
    if (termPlan.academic_term) {
      return `${termPlan.term_type || ""} ${termPlan.academic_term} ${termPlan.term_year || ""}`.trim()
    }

    // Try to get from data if available
    if (termPlan.data && termPlan.data.academicTerm) {
      return `${termPlan.data.termType || ""} ${termPlan.data.academicTerm} ${termPlan.data.termYear || ""}`.trim()
    }

    return "Unnamed Term"
  }

  // Function to get student count
  const getStudentCount = (termPlan: any) => {
    if (termPlan.studentTermPlans) {
      return termPlan.studentTermPlans.length
    }

    // Try to get from data if available
    if (termPlan.data && termPlan.data.students) {
      return Object.keys(termPlan.data.students).length
    }

    return 0
  }

  // Function to get goals
  const getGoals = (termPlan: any) => {
    if (termPlan.goals && Array.isArray(termPlan.goals)) {
      return termPlan.goals
    }

    // Try to get from data if available
    if (termPlan.data && termPlan.data.goals && Array.isArray(termPlan.data.goals)) {
      return termPlan.data.goals
    }

    return []
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to handle edit button click
  const handleEditClick = (termPlan: any) => {
    // Store the term plan in session storage and navigate to edit page
    sessionStorage.setItem("termPlan", JSON.stringify(termPlan.data || termPlan))
    router.push(`/parent/term-plan-builder?termPlanId=${termPlan.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Loading Dashboard...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-gray-700" />
              </CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full bg-gray-700" />
                <Skeleton className="h-10 w-full bg-gray-700" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/parent/term-plan-builder">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Term Plan
          </Link>
        </Button>
      </div>

      {/* Term Plans Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-400" />
          Term Plans
        </h2>

        {termPlans.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-purple-900/20 border-b border-purple-900/30">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                No Term Plan Found
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-300 mb-6">
                You haven't created a term plan yet. Create one to organize your homeschool curriculum.
              </p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/parent/term-plan-builder">Create Term Plan</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {termPlans.map((termPlan) => (
              <Card key={termPlan.id} className="bg-gray-800 border-gray-700 hover:border-blue-600 transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/30 rounded-t-lg">
                  <CardTitle className="text-xl">{formatTermName(termPlan)}</CardTitle>
                  <CardDescription>
                    Created: {formatDate(termPlan.created_at)}
                    {termPlan.updated_at !== termPlan.created_at && ` • Updated: ${formatDate(termPlan.updated_at)}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <span>{getStudentCount(termPlan)} student(s)</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-400" />
                        Term Goals
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {getGoals(termPlan)
                          .slice(0, 3)
                          .map((goal: string, index: number) => (
                            <Badge key={index} className="bg-blue-900/30 text-blue-100 border border-blue-700">
                              {goal}
                            </Badge>
                          ))}
                        {getGoals(termPlan).length > 3 && (
                          <Badge className="bg-blue-900/30 text-blue-100 border border-blue-700">
                            +{getGoals(termPlan).length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="flex gap-2 p-4">
                  <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Link href={`/parent/term-plan-overview?id=${termPlan.id}`}>View Details</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                    onClick={() => handleEditClick(termPlan)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Students Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-400" />
          Your Students
        </h2>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-gray-700 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
              All
            </TabsTrigger>
            {students.map((student) => (
              <TabsTrigger key={student.id} value={student.id} className="data-[state=active]:bg-blue-600">
                {student.first_name || student.full_name?.split(" ")[0] || "Student"}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <Card key={student.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>{student.full_name || student.first_name}</CardTitle>
                    <CardDescription>
                      {student.grade_level ? `Grade ${student.grade_level}` : "Student"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className="bg-green-600">On Track</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subjects:</span>
                        <span>{student.subjects?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activities:</span>
                        <span>{student.activities?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-blue-600 text-blue-400 hover:bg-blue-900/20"
                    >
                      <Link href={`/parent/students/${student.id}`}>View Student</Link>
                    </Button>
                  </div>
                </Card>
              ))}

              <AddStudentModal />
            </div>
          </TabsContent>

          {students.map((student) => (
            <TabsContent key={student.id} value={student.id} className="mt-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>{student.full_name || student.first_name}</CardTitle>
                  <CardDescription>{student.grade_level ? `Grade ${student.grade_level}` : "Student"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-400" />
                        Student Details
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Age:</div>
                        <div>{student.age || "Not specified"}</div>
                        <div className="text-muted-foreground">Grade:</div>
                        <div>{student.grade_level || "Not specified"}</div>
                        <div className="text-muted-foreground">Learning Style:</div>
                        <div>{student.learning_style || "Not specified"}</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href={`/parent/students/${student.id}`}>View Full Profile</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
