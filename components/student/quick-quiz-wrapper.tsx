"use client"

import { useSearchParams } from "next/navigation"
import { QuickQuiz } from "./quick-quiz"

export function QuickQuizWrapper() {
  const searchParams = useSearchParams()

  const topic = searchParams.get("topic") || "General Knowledge"
  const source = searchParams.get("source") || "Study Guide"
  const subject = searchParams.get("class") || "Science"

  return <QuickQuiz topic={topic} source={source} subject={subject} />
}
