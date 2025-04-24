"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

const schedule = [
  { time: "8:00", subject: "Scripture Study" },
  { time: "8:35", subject: "Biology" },
  { time: "9:05", subject: "Constitution" },
  { time: "9:30", subject: "Assessments" },
]

export default function HomeschoolDashboard() {
  const [studentName, setStudentName] = useState("John Doe")
  const [checkedIn, setCheckedIn] = useState<{ [key: string]: boolean }>({})
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({})
  const [submissions, setSubmissions] = useState<{ [key: string]: string }>({})
  const [adminFeedback, setAdminFeedback] = useState("")

  const handleCheckIn = (subject: string) => {
    setCheckedIn((prev) => ({ ...prev, [subject]: true }))
  }

  const handleSummaryChange = (subject: string, value: string) => {
    setSummaries((prev) => ({ ...prev, [subject]: value }))
  }

  const handleSubmit = (subject: string) => {
    const timestamp = new Date().toLocaleString()
    setSubmissions((prev) => ({ ...prev, [subject]: timestamp }))
  }

  const handleAdminFeedback = () => {
    const timestamp = new Date().toLocaleString()
    setAdminFeedback(`Admin feedback submitted at ${timestamp}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{studentName}&apos;s Homeschool Dashboard</h1>

      <div className="grid gap-6">
        {schedule.map(({ time, subject }) => (
          <Card key={subject}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {time} - {subject}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleCheckIn(subject)} disabled={checkedIn[subject]}>
                {checkedIn[subject] ? <CheckCircle className="h-4 w-4 text-green-500" /> : "Check In"}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={`Enter your ${subject} summary here...`}
                value={summaries[subject] || ""}
                onChange={(e) => handleSummaryChange(subject, e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-between items-center">
                <Button onClick={() => handleSubmit(subject)}>Submit Summary</Button>
                {submissions[subject] && (
                  <span className="text-sm text-gray-500">
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    Submitted: {submissions[subject]}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Admin Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Enter admin feedback here..." className="mb-2" />
          <Button onClick={handleAdminFeedback}>Submit Feedback</Button>
          {adminFeedback && <p className="mt-2 text-sm text-gray-500">{adminFeedback}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
