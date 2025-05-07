import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"
import PracticeTestsWrapper from "@/components/student/practice-tests-wrapper"

export const metadata: Metadata = {
  title: "Practice Tests | Student Dashboard",
  description: "Generate and complete practice tests to prepare for upcoming exams",
}

export default function PracticeTests() {
  return (
    <Suspense fallback={<PracticeTestsLoadingSkeleton />}>
      <PracticeTestsWrapper />
    </Suspense>
  )
}

function PracticeTestsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
            <Skeleton className="h-10 w-64 ml-2 bg-gray-700" />
            <Skeleton className="h-6 w-24 ml-3 rounded-full bg-gray-700" />
          </div>
          <Skeleton className="h-5 w-96 ml-10 bg-gray-700" />
        </div>

        {/* Selection Panel skeleton */}
        <Skeleton className="w-full h-40 mb-8 rounded-lg bg-gray-700" />

        {/* Quiz Style Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-full h-48 rounded-lg bg-gray-700" />
          ))}
        </div>

        {/* Footer Navigation skeleton */}
        <div className="mt-12 pt-6">
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-32 rounded-full bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
