"use client"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

interface PaywallStepProps {
  onBack: () => void
}

export function PaywallStep({ onBack }: PaywallStepProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white mb-4" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
      </Button>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Ready to Take Control?
        </h1>
        <p className="text-xl text-slate-300">Your child's path is mapped. Now let's put it into action.</p>
      </div>

      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-2xl">Premium Features</CardTitle>
          <CardDescription className="text-slate-400">
            Everything you need to manage your child's homeschool journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {[
              "Create a custom schedule tailored to your child's needs",
              "Track daily progress and check-ins with real-time updates",
              "Unlock rewards, XP, and coin economy to motivate your child",
              "Define rubrics and expectations for each subject and assignment",
              "Get GPT-powered feedback and guidance for both parents and students",
              "Generate reports and transcripts for record-keeping",
              "Access a library of curriculum resources and activities",
              "Connect with other homeschooling families in your area",
            ].map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </div>
                <span className="text-slate-200">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="border-slate-600 bg-slate-900/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Basic</CardTitle>
                <CardDescription className="text-slate-400">For getting started</CardDescription>
                <div className="mt-1">
                  <span className="text-2xl font-bold">$9</span>
                  <span className="text-slate-400 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-400 pb-3">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Basic scheduling</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Daily check-ins</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Simple progress tracking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-slate-600">
                  Select
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-500/50 bg-gradient-to-b from-slate-800 to-slate-900/90 relative">
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Premium</CardTitle>
                <CardDescription className="text-slate-400">For serious homeschoolers</CardDescription>
                <div className="mt-1">
                  <span className="text-2xl font-bold">$19</span>
                  <span className="text-slate-400 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-400 pb-3">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Advanced scheduling</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Rewards & XP system</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>GPT-powered feedback</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Detailed reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Select</Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-600 bg-slate-900/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Family</CardTitle>
                <CardDescription className="text-slate-400">For multiple children</CardDescription>
                <div className="mt-1">
                  <span className="text-2xl font-bold">$29</span>
                  <span className="text-slate-400 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-400 pb-3">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Up to 5 student profiles</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Family calendar</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Resource sharing</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-slate-600">
                  Select
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between pt-2">
          <Button variant="outline" className="border-slate-600 hover:bg-slate-700 w-full sm:w-auto" asChild>
            <Link href="/tour">Go Back to Tour</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto"
            asChild
          >
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
