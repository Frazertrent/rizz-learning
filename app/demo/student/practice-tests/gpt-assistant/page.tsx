import { Suspense } from "react"
import GPTAssistantQuizWrapper from "@/components/student/gpt-assistant-quiz-wrapper"

export default function GPTAssistantQuizPage() {
  return (
    <Suspense fallback={<QuizSkeleton />}>
      <GPTAssistantQuizWrapper />
    </Suspense>
  )
}

function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="h-10 w-64 bg-gray-800 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-800 rounded-md animate-pulse mb-4"></div>
            <div className="h-6 w-40 bg-gray-800 rounded-md animate-pulse mb-2"></div>
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="h-6 w-40 bg-gray-800 rounded-md animate-pulse"></div>
          <div className="h-4 w-10 bg-gray-800 rounded-md animate-pulse"></div>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gray-600 w-1/5"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="h-8 w-3/4 bg-gray-700 rounded-md animate-pulse mb-4"></div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-700 rounded-full animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-center gap-4">
        <div className="h-10 w-40 bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-10 w-40 bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-10 w-40 bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
}
