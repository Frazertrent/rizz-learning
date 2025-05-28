"use client"

import { useSearchParams } from "next/navigation"
import LongAnswerPractice from "./long-answer-practice"

export default function LongAnswerPracticeWrapper() {
  const searchParams = useSearchParams()

  // Get topic from URL params or use default
  const topic = searchParams.get("topic") || "General Knowledge"
  const subject = searchParams.get("subject") || "Science"
  const source = searchParams.get("source") || "Study Guide"

  return <LongAnswerPractice topic={topic} subject={subject} source={source} />
}
