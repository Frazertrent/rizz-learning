"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function FinalCTA() {
  const router = useRouter()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="mt-20 text-center">
      <h2 className="text-3xl font-bold mb-8">
        <span className="inline-block">🎉 Ready to take the next step?</span>
      </h2>

      <Button
        onClick={scrollToTop}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-xl font-bold rounded-xl"
      >
        Activate Your Plan
      </Button>

      <p className="text-gray-400 mt-4">30-second setup. Cancel anytime.</p>

      <button
        onClick={() => router.back()}
        className="mt-8 flex items-center gap-2 text-purple-400 hover:text-purple-300 mx-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to my personalized plan
      </button>
    </div>
  )
}
