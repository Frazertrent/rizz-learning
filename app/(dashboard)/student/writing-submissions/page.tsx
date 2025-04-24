import type { Metadata } from "next"
import WritingSubmissionsPage from "@/components/student/writing-submissions"

export const metadata: Metadata = {
  title: "AI Writing Coach | Student Dashboard",
  description: "Get instant AI feedback on your writing before submitting to your parent",
}

export default function WritingSubmissions() {
  return <WritingSubmissionsPage />
}
