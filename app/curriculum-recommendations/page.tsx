"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function CurriculumRecommendationsPage() {
  const searchParams = useSearchParams()
  const parentId = searchParams.get("id")
  const [loading, setLoading] = useState(true)
  const [parentData, setParentData] = useState<any>(null)
  const [intakeData, setIntakeData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!parentId) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Fetch parent profile data
        const { data: parentProfile, error: parentError } = await supabase
          .from("parent_profile")
          .select("*")
          .eq("id", parentId)
          .single()

        if (parentError) throw parentError

        // Fetch intake form data
        const { data: intakeForm, error: intakeError } = await supabase
          .from("parent_intake_form")
          .select("*")
          .eq("parent_id", parentId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (intakeError && intakeError.code !== "PGRST116") throw intakeError

        setParentData(parentProfile)
        setIntakeData(intakeForm)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [parentId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Generating Your Personalized Curriculum...</h2>
          <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">This may take a few moments as we analyze your preferences.</p>
        </div>
      </div>
    )
  }

  // Show a message if no parent ID is provided
  if (!parentId) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Card className="border-red-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl">Missing Information</CardTitle>
            <CardDescription>
              We couldn't find your profile information. Please complete the intake form first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              To receive personalized curriculum recommendations, you need to complete the parent intake form.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/parent-intake">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Go to Parent Intake Form <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const parentName = parentData?.first_name || "Parent"

  // Sample curriculum paths - these would eventually be generated based on the intake form data
  const curriculumPaths = [
    {
      id: "balanced",
      name: "Balanced Approach",
      description: "A well-rounded curriculum that balances structure with flexibility",
      subjects: ["Math", "Science", "Language Arts", "History", "Art"],
      features: ["Daily structure", "Weekly flexibility", "Multimedia resources"],
      recommended: true,
    },
    {
      id: "structured",
      name: "Highly Structured",
      description: "A comprehensive curriculum with clear daily schedules and assessments",
      subjects: ["Math", "Science", "Language Arts", "History", "Foreign Language"],
      features: ["Daily lesson plans", "Regular assessments", "Traditional approach"],
      recommended: false,
    },
    {
      id: "flexible",
      name: "Flexible & Interest-Led",
      description: "A flexible curriculum that follows student interests while covering core subjects",
      subjects: ["Math", "Science", "Language Arts", "Project-Based Learning"],
      features: ["Interest-led projects", "Core skill development", "Flexible scheduling"],
      recommended: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Your Personalized Curriculum Recommendations
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Based on your responses, we've created customized curriculum recommendations for your homeschooling journey.
        </p>
      </div>

      <Card className="mb-8 border-purple-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {parentName}!</CardTitle>
          <CardDescription>
            We've analyzed your intake form and created personalized recommendations for your homeschooling journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold">Learning Style</h3>
              </div>
              <p className="text-gray-400">
                {intakeData?.educational_values?.length > 0
                  ? `${intakeData.educational_values.join(", ")}`
                  : "Balanced approach with multimedia resources"}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="mr-2 h-5 w-5 text-blue-400" />
                <h3 className="font-semibold">Schedule Preference</h3>
              </div>
              <p className="text-gray-400">
                {intakeData?.school_days?.length > 0
                  ? `${intakeData.school_days.length} days per week`
                  : "5 days per week with flexible hours"}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BookOpen className="mr-2 h-5 w-5 text-green-400" />
                <h3 className="font-semibold">Subject Focus</h3>
              </div>
              <p className="text-gray-400">
                {intakeData?.courses?.length > 0
                  ? `${intakeData.courses
                      .map((c: any) => c.subject)
                      .filter(Boolean)
                      .join(", ")}`
                  : "Core subjects with emphasis on STEM"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="balanced" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="balanced">Balanced Approach</TabsTrigger>
          <TabsTrigger value="structured">Structured Curriculum</TabsTrigger>
          <TabsTrigger value="flexible">Flexible Learning</TabsTrigger>
        </TabsList>

        {curriculumPaths.map((path) => (
          <TabsContent key={path.id} value={path.id} className="mt-0">
            <Card className="border-purple-800 bg-gray-900">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">{path.name}</CardTitle>
                  {path.recommended && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Recommended for You</Badge>
                  )}
                </div>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Core Subjects</h3>
                    <ul className="space-y-2">
                      {path.subjects.map((subject, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          {subject}
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {path.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Sample Resources</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-400 mr-2" />
                          <span>Complete Curriculum Guide</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                          <span>Sample Weekly Schedule</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-green-400 mr-2" />
                          <span>Resource List</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-8">
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  View Detailed Curriculum <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Your personalized curriculum is ready for implementation. Access your dashboard to begin your homeschooling
          journey.
        </p>
        <Link href="/parent/dashboard">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
