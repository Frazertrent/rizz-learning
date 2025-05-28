"use client"

import { useSearchParams } from "next/navigation"
import StudentUploads from "./student-uploads"

export default function StudentUploadsWrapper() {
  const searchParams = useSearchParams()
  const subject = searchParams.get("subject") || "all"
  const status = searchParams.get("status") || "all"

  return <StudentUploads subject={subject} status={status} />
}
