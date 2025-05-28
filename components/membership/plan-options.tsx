"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function PlanOptions() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Update the handleChoosePlan function to use the correct plan names for the checkout page
  const handleChoosePlan = (plan: string) => {
    setSelectedPlan(plan)
    const planParam = plan.toLowerCase()
    router.push(`/checkout?plan=${planParam}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="plans">
      {/* Starter Plan */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">Starter Plan</h2>
        <p className="text-gray-400 mb-4">Get matched. Get organized. Get started.</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">$19</span>
          <span className="text-gray-400">/month</span>
        </div>
        <div className="space-y-4 flex-grow">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>1 Personalized Learning Plan</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>3 program or school matches (public/private/charter)</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Financial aid suggestions</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Weekly email tips & updates</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>One-time download: "Starter Resource Toolkit"</p>
          </div>
        </div>
        <Button onClick={() => handleChoosePlan("Starter")} className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
          Choose Starter
        </Button>
      </div>

      {/* Core Plan */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">Core Plan</h2>
        <p className="text-gray-400 mb-4">Smart tools. Real support. Flexible freedom.</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">$29</span>
          <span className="text-gray-400">/month</span>
        </div>
        <div className="space-y-4 flex-grow">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>All Starter features</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Full dashboard access for up to 3 students</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Custom curriculum planner</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Weekly progress snapshots</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>AI Mentor feedback on submissions</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Reimbursement assistant & transcript builder</p>
          </div>
        </div>
        <Button onClick={() => handleChoosePlan("Core")} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
          Choose Core
        </Button>
      </div>

      {/* Power Plan */}
      <div className="bg-gray-900 border border-purple-700 rounded-lg p-6 flex flex-col relative overflow-hidden shadow-lg shadow-purple-900/20">
        <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-1 text-sm font-medium text-white">
          Most Popular
        </div>
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <span className="text-yellow-400 mr-2">⚡</span> Power Plan
        </h2>
        <p className="text-gray-400 mb-4">Total control. Total support.</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">$39</span>
          <span className="text-gray-400">/month</span>
        </div>
        <div className="space-y-4 flex-grow">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>All Core features</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Unlimited student profiles</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>AI-powered grading assistant + reflections</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Auto-filled document vault</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Real-time alerts for missed work</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p>Dedicated onboarding concierge (human support)</p>
          </div>
        </div>
        <Button
          onClick={() => handleChoosePlan("Power")}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Choose Power Plan
        </Button>
      </div>
    </div>
  )
}
