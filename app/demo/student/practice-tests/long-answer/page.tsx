import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import LongAnswerPracticeWrapper from "@/components/student/long-answer-practice-wrapper"

export default function LongAnswerPage() {
  return (
    <Suspense fallback={<LongAnswerSkeleton />}>
      <LongAnswerPracticeWrapper />
    </Suspense>
  )
}

function LongAnswerSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 bg-gray-900 min-h-screen text-white">
      <div className="text-center mb-8 relative">
        <Skeleton className="h-10 w-64 bg-gray-800 mx-auto mb-2" />
        <Skeleton className="h-6 w-96 bg-gray-800 mx-auto mb-4" />
        <div className="flex flex-col items-center mb-4">
          <Skeleton className="h-6 w-48 bg-gray-800 mb-2" />
          <div className="flex gap-2 justify-center">
            <Skeleton className="h-6 w-20 bg-gray-800 rounded-full" />
            <Skeleton className="h-6 w-20 bg-gray-800 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-32 bg-gray-800" />
          <Skeleton className="h-4 w-12 bg-gray-800" />
        </div>
        <Skeleton className="h-2 w-full bg-gray-800" />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
        <Skeleton className="h-8 w-3/4 bg-gray-700 mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 bg-gray-700 rounded-full" />
          <Skeleton className="h-6 w-16 bg-gray-700 rounded-full" />
          <Skeleton className="h-6 w-16 bg-gray-700 rounded-full" />
        </div>
        <Skeleton className="h-6 w-32 bg-gray-700 mb-6" />
        <Skeleton className="h-64 w-full bg-gray-700 mb-6" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-32 bg-gray-700" />
          <Skeleton className="h-10 w-32 bg-gray-700" />
        </div>
        <div className="flex justify-between mt-6">
          <Skeleton className="h-10 w-32 bg-gray-700" />
          <Skeleton className="h-10 w-32 bg-gray-700" />
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Skeleton className="h-10 w-48 bg-gray-800" />
        <Skeleton className="h-10 w-48 bg-gray-800" />
        <Skeleton className="h-10 w-48 bg-gray-800" />
      </div>
    </div>
  )
}
