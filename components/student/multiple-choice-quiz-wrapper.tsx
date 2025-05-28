"use client"

import { useSearchParams } from "next/navigation"
import MultipleChoiceQuiz from "./multiple-choice-quiz"

export default function MultipleChoiceQuizWrapper() {
  const searchParams = useSearchParams()

  // Get parameters from URL
  const topicParam = searchParams.get("topic") || "Cell Biology"
  const classParam = searchParams.get("class") || "Science"
  const sourceParam = searchParams.get("source") || "Study Guide"

  return <MultipleChoiceQuiz topicParam={topicParam} classParam={classParam} sourceParam={sourceParam} />
}
