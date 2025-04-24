"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Users, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { AssessmentData } from "./introductory-assessment"

interface SummaryStepProps {
  data: AssessmentData
}

export function SummaryStep({ data }: SummaryStepProps) {
  // Generate personalized recommendations based on user input
  const getLearningPath = () => {
    if (data.learningStyle === "accelerated") {
      return "Accelerated Learning Path"
    } else if (data.learningStyle === "needs-structure") {
      return "Structured Support Path"
    } else if (data.learningStyle === "experimenting") {
      return "Exploratory Learning Path"
    } else {
      return "Core Mastery Path"
    }
  }

  const getParentInvolvementSummary = () => {
    if (data.parentInvolvement === "very") {
      return "Parent-led learning with daily guidance and direct instruction"
    } else if (data.parentInvolvement === "somewhat") {
      return "Balanced approach with regular check-ins and oversight"
    } else {
      return "Student-led learning with automated progress tracking"
    }
  }

  const getSocialRecommendation = () => {
    if (data.socialGoals === "frequent") {
      return "Co-op classes, group projects, and regular social activities"
    } else if (data.socialGoals === "few") {
      return "Weekly meetups and occasional collaborative projects"
    } else {
      return "Focus on individual learning with optional social components"
    }
  }

  const getRecommendedFeatures = () => {
    const features = []

    if (data.learningStyle === "accelerated") {
      features.push("Advanced curriculum options")
      features.push("Credit acceleration tools")
    }

    if (data.learningStyle === "needs-structure") {
      features.push("Daily structure templates")
      features.push("Step-by-step learning guides")
    }

    if (data.parentInvolvement === "independent") {
      features.push("Automated progress tracking")
      features.push("Self-paced learning modules")
    }

    if (data.parentInvolvement === "very") {
      features.push("Detailed lesson plans")
      features.push("Parent teaching resources")
    }

    if (data.socialGoals === "frequent") {
      features.push("Co-op coordination tools")
      features.push("Group project templates")
    }

    // Add some default features if we don't have enough
    if (features.length < 4) {
      features.push("Customizable schedule builder")
      features.push("Progress tracking dashboard")
      features.push("Resource library access")
    }

    return features.slice(0, 6) // Return up to 6 features
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
          Your Personalized Recommendation
        </Badge>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">The {getLearningPath()}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Based on your responses, we've created a custom recommendation for {data.childInfo || "your child"}.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Learning Approach</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {data.learningStyle === "accelerated" && "Advanced, challenge-focused curriculum"}
                    {data.learningStyle === "solid" && "Grade-level core curriculum with enrichment"}
                    {data.learningStyle === "needs-structure" && "Structured, confidence-building approach"}
                    {data.learningStyle === "experimenting" && "Flexible, exploratory learning path"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Parent Involvement</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{getParentInvolvementSummary()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Social Recommendations</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{getSocialRecommendation()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">Addressing Your Concern</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {data.mainConcern
                      ? `"${data.mainConcern}" - We'll help you address this.`
                      : "We'll help you navigate your homeschooling journey."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Recommended Features</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {getRecommendedFeatures().map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Next Steps</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Ready to start your homeschooling journey with a personalized plan? Create an account to access all the
            features and tools you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tour">
                Take a Tour First
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
