"use client"

import { useSearchParams } from "next/navigation"
import GPTAssistantQuiz from "./gpt-assistant-quiz"

export default function GPTAssistantQuizWrapper() {
  const searchParams = useSearchParams()

  const topic = searchParams.get("topic") || "Biology"
  const subject = searchParams.get("subject") || "Science"
  const source = searchParams.get("source") || "Textbook"

  return <GPTAssistantQuiz topic={topic} subject={subject} source={source} />
}
