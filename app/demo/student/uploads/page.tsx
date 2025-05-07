import { Suspense } from "react"
import StudentUploadsWrapper from "@/components/student/student-uploads-wrapper"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function StudentUploadsPage() {
  return (
    <Suspense fallback={<UploadsLoadingSkeleton />}>
      <StudentUploadsWrapper />
    </Suspense>
  )
}

function UploadsLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Header Skeleton */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 opacity-10 rounded-3xl"></div>
          <div className="relative p-6 rounded-3xl">
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-6 w-full max-w-3xl mb-2" />
            <Skeleton className="h-4 w-full max-w-3xl" />
          </div>
        </div>
      </div>

      {/* Upload Panel Skeleton */}
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl mb-8">
        <div className="p-4 flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-lg mb-4" />
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto mb-1" />
                <Skeleton className="h-3 w-48 mx-auto" />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Skeleton className="h-6 w-64 mb-1" />
                <Skeleton className="h-4 w-full max-w-lg mb-3" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />

              <div className="flex justify-end mt-6">
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Section Skeleton */}
      <Card className="overflow-hidden border-none shadow-md bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <div className="p-4 flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>

          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-md" />
                ))}
            </div>
          </div>

          <div className="space-y-8">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-32" />
                    <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3)
                      .fill(0)
                      .map((_, j) => (
                        <Card
                          key={j}
                          className="overflow-hidden shadow-md rounded-xl border border-gray-100 dark:border-gray-800"
                        >
                          <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                          <CardContent className="p-4">
                            <div className="flex flex-col space-y-4">
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <Skeleton className="h-5 w-32 rounded-full" />
                                  <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-6 w-full mb-1" />
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Skeleton className="h-5 w-16 rounded-full" />
                                  <Skeleton className="h-5 w-24 rounded-full" />
                                  <Skeleton className="h-5 w-32 rounded-full" />
                                </div>
                              </div>

                              <Skeleton className="h-px w-full" />

                              <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-8 w-28 rounded-full" />
                                <Skeleton className="h-8 w-28 rounded-full" />
                                <Skeleton className="h-8 w-28 rounded-full" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
