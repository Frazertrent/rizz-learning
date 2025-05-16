import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupConfirmationPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center">
      {/* Back to home link */}
      <div className="w-full max-w-7xl px-4 pt-4">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Home
        </Link>
      </div>

      {/* Confirmation content */}
      <div className="w-full max-w-md px-6 py-12 mt-12 flex flex-col items-center">
        <div className="bg-green-500/10 p-4 rounded-full mb-6">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 text-center">Account Created!</h1>

        <p className="text-gray-400 text-center mb-8">
          Your account has been successfully created. You can now continue to set up your profile.
        </p>

        <div className="w-full space-y-4">
          <Link href="/parent-intake" className="w-full block">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl h-12 font-medium">
              <span className="flex items-center justify-center gap-2">
                Continue to Profile Setup
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
