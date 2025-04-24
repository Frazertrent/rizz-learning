"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export function CompletionStep() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Assessment Complete!</CardTitle>
        <CardDescription className="text-gray-400">
          Thank you for providing your educational preferences and goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-green-600/20 p-6 rounded-full mb-4">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Your information has been saved</h3>
          <p className="text-gray-400 text-center max-w-md">
            We'll use your responses to customize your homeschooling experience and provide intelligent recommendations.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">What happens next?</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Your dashboard will be personalized based on your preferences</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>You'll receive recommended learning platforms and resources</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>We'll check for available grants and funding opportunities</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Your AI mentor will be configured to match your preferred style</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </>
  )
}
