"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowRight, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/parent"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (signInError) throw signInError

      // Store the user in localStorage for later use
      if (data.user) {
        localStorage.setItem("userId", data.user.id)
      }

      // Redirect to the specified redirect URL or dashboard
      router.push(redirect)
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Invalid email or password")
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
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
                <div className="flex justify-between items-center mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-gray-500" />
                    <p className="text-xs text-gray-500">Secure login</p>
                  </div>
                  <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>
              </FormItem>
            )}
          />

          {error && <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded-md">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl h-12 font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
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
        Don't have an account?{" "}
        <Link href="/signup" className="text-white hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
