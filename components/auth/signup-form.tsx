"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowRight, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        },
      })

      if (signUpError) throw signUpError

      // Store the user in localStorage for later use
      if (data.user) {
        localStorage.setItem("userId", data.user.id)
      }

      // Redirect to confirmation page
      router.push("/signup/confirmation")
    } catch (err) {
      console.error("Signup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Create a password"
                    type="password"
                    {...field}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Lock className="h-3.5 w-3.5 text-gray-500" />
                  <p className="text-xs text-gray-500">Your information is secure. We'll never share your data.</p>
                </div>
              </FormItem>
            )}
          />

          {error && <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded-md">{error}</div>}

          <div className="space-y-3 pt-2">
            <div className="text-sm text-gray-500 mb-1 text-center">Step 2</div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl h-12 font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Complete your Family Enrollment Profile
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors mx-auto block"
                  >
                    What's in the intake form?
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-gray-800 text-gray-200 border-gray-700 p-3 rounded-lg">
                  <p className="text-sm">
                    Just a few quick questions about your family and goals so we can tailor the platform. Takes 1–2
                    minutes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full bg-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gray-900/50 backdrop-blur-sm px-2 text-gray-400">OR</span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
