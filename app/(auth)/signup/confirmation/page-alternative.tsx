"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function ConfirmationPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in">
        <div className="text-7xl mb-6 mx-auto animate-bounce-subtle">🏆</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Account Created Successfully!</h1>

        <p className="text-gray-600 mb-8">
          Welcome to Rizz Learning! You're all set. Next, let's create your Parent Profile.
        </p>

        <div className="text-gray-500 text-sm font-medium mb-2">Step 2</div>
        <div>
          <Link
            href="/parent-intake"
            className="inline-block w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            Complete your Family Enrollment Profile
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">Need help? Contact support@rizzlearning.com</div>
      </div>
    </div>
  )
}
