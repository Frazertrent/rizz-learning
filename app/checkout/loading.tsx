import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center text-white">
      <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
      <h2 className="text-2xl font-bold">Loading your checkout...</h2>
      <p className="text-gray-400 mt-2">Just a moment while we prepare your plan details</p>
    </div>
  )
}
