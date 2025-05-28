import { Suspense } from "react"
import { QuickQuizWrapper } from "@/components/student/quick-quiz-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Loading skeleton for the quiz
function QuickQuizSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      <div className="text-center mb-8 w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <div className="flex items-center justify-center mt-4 flex-wrap gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24 ml-2" />
          <Skeleton className="h-6 w-24 ml-2" />
        </div>
      </div>

      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      <div className="w-full max-w-3xl">
        <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-800">
          <CardHeader>
            <Skeleton className="h-6 w-full" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-40" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function QuickQuizPage() {
  return (
    <Suspense fallback={<QuickQuizSkeleton />}>
      <QuickQuizWrapper />
    </Suspense>
  )
}
