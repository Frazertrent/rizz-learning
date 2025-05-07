import { Suspense } from "react"
import MultipleChoiceQuizWrapper from "@/components/student/multiple-choice-quiz-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function MultipleChoicePage() {
  return (
    <Suspense fallback={<MultipleChoiceQuizSkeleton />}>
      <MultipleChoiceQuizWrapper />
    </Suspense>
  )
}

function MultipleChoiceQuizSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-2" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-2xl ml-10 mb-3" />
          <div className="ml-10 mb-4">
            <Skeleton className="h-6 w-40 mb-1" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>

        {/* Progress Indicator Skeleton */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        {/* Question Card Skeleton */}
        <Card className="bg-gray-800/50 border-gray-700 overflow-hidden mb-8">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-full mb-6" />

            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                  <Skeleton className="h-8 w-8 rounded-full mr-3" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons Skeleton */}
        <div className="flex justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  )
}
