"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { OnboardingData } from "./onboarding-flow"
import { ArrowLeft } from "lucide-react"
import { submitAssessment } from "@/app/actions/submit-assessment"

interface AssessmentStepProps {
  onContinue: () => void
  onBack: () => void
  updateData: (data: Partial<OnboardingData>) => void
  data: OnboardingData
}

const formSchema = z.object({
  childInfo: z.string().min(2, {
    message: "Please provide your child's age and grade level.",
  }),
  learningPace: z.enum(["Accelerated", "Average", "Needs Support"], {
    required_error: "Please select a learning pace.",
  }),
  parentInvolvement: z.enum(["Very involved", "Somewhat involved", "Mostly independent"], {
    required_error: "Please select your preferred involvement level.",
  }),
  socialImportance: z.enum(["Very Important", "Somewhat Important", "Not Important"], {
    required_error: "Please select how important social opportunities are.",
  }),
  biggestConcern: z.string().min(2, {
    message: "Please share your biggest concern.",
  }),
})

export function AssessmentStep({ onContinue, onBack, updateData, data }: AssessmentStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childInfo: data.childInfo || "",
      learningPace: data.learningPace || undefined,
      parentInvolvement: data.parentInvolvement || undefined,
      socialImportance: data.socialImportance || undefined,
      biggestConcern: data.biggestConcern || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      updateData(values)

      // Submit assessment using server action
      const result = await submitAssessment(values)

      if (!result.success) {
        toast({
          title: "Something went wrong",
          description: result.error || "We couldn't save your assessment. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Store session token in localStorage
      if (result.sessionToken) {
        localStorage.setItem("rizzlearning_session_token", result.sessionToken)
      }

      // Show success toast
      toast({
        title: "✨ Assessment submitted!",
        description: "Your custom path is ready.",
        variant: "default",
      })

      // Redirect to thanks page
      router.push("/onboarding/thanks")
    } catch (error) {
      console.error("Error in submission:", error)
      toast({
        title: "Something went wrong",
        description: "We couldn't save your assessment. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white mb-4" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-2xl">Quick Introductory Assessment</CardTitle>
          <CardDescription className="text-slate-400">
            Help us understand your child's needs and your homeschooling goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="childInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your child's current age and grade level?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 10 years old, 5th grade"
                        {...field}
                        className="bg-slate-900 border-slate-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="learningPace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How would you describe their learning pace?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700">
                          <SelectValue placeholder="Select a learning pace" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="Accelerated">Accelerated</SelectItem>
                        <SelectItem value="Average">Average</SelectItem>
                        <SelectItem value="Needs Support">Needs Support</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentInvolvement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How involved do you want to be day-to-day?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700">
                          <SelectValue placeholder="Select your involvement level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="Very involved">Very involved</SelectItem>
                        <SelectItem value="Somewhat involved">Somewhat involved</SelectItem>
                        <SelectItem value="Mostly independent">Mostly independent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialImportance"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>How important are social opportunities?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Very Important" />
                          </FormControl>
                          <FormLabel className="font-normal">Very Important</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Somewhat Important" />
                          </FormControl>
                          <FormLabel className="font-normal">Somewhat Important</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Not Important" />
                          </FormControl>
                          <FormLabel className="font-normal">Not Important</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biggestConcern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's your biggest concern right now?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Keeping my child motivated, meeting state requirements..."
                        {...field}
                        className="bg-slate-900 border-slate-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                >
                  {isSubmitting ? "Submitting..." : "See Results"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
