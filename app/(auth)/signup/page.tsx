import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center">
      {/* Back to home link */}
      <div className="w-full max-w-7xl px-4 pt-4">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Home
        </Link>
      </div>

      {/* Welcome banner */}
      <div className="w-full max-w-3xl px-4 pt-12 pb-8 text-center">
        <div className="mb-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">
            Welcome to Homeschool Dashboard
          </h1>
        </div>
        <p className="text-xl text-white mb-6">Let's get your account set up so we can personalize your plan.</p>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Step 1 of 2 — This quick signup gets you started. Next, we'll personalize your dashboard based on your child's
          needs.
        </p>
      </div>

      {/* Form container */}
      <div className="w-full max-w-md px-6 py-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl">
        <SignupForm />
      </div>
    </div>
  )
}
