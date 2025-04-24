"use client"

import { useSearchParams } from "next/navigation"
import PracticeTestsPage from "./practice-tests"

export default function PracticeTestsWrapper() {
  const searchParams = useSearchParams()

  // Get parameters from URL
  const setId = searchParams.get("setId")
  const setName = searchParams.get("setName")

  return <PracticeTestsPage setId={setId} setName={setName} />
}
