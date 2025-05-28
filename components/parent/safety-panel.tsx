"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Clock,
  Eye,
  Lock,
  MessageSquare,
  Shield,
  User,
  Download,
  AlertTriangle,
  FileText,
  Info,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SafetyPanel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [safetyReportOpen, setSafetyReportOpen] = useState(false)
  const [alertDetailOpen, setAlertDetailOpen] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: "dismiss" | "block" | "approve"
    alertId: string
  } | null>(null)
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const handleOpenSafetyReport = () => {
    setSafetyReportOpen(true)
  }

  const handleOpenAlertDetail = (alertId: string) => {
    setCurrentAlert(alertId)
    setAlertDetailOpen(true)
  }

  const handleConfirmAction = (type: "dismiss" | "block" | "approve", alertId: string) => {
    setConfirmAction({ type, alertId })
    setConfirmDialogOpen(true)
  }

  const handleConfirmComplete = () => {
    if (confirmAction) {
      if (confirmAction.type === "dismiss") {
        setDismissedAlerts([...dismissedAlerts, confirmAction.alertId])
      }
      // In a real app, we would handle the block and approve actions here
      setConfirmDialogOpen(false)
      setConfirmAction(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Safety Panel</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenSafetyReport}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <Shield className="mr-2 h-4 w-4" />
            Safety Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/80 backdrop-blur-sm p-1 rounded-full">
          <TabsTrigger
            value="overview"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Content Filters
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Privacy
          </TabsTrigger>
          <TabsTrigger
            value="monitoring"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Activity Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                Safety Status
              </CardTitle>
              <CardDescription className="text-slate-300">Current safety and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                      <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Content Filtering</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Age-appropriate content filters are active
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  >
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                      <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Privacy Protection</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Student data is protected and secure</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  >
                    Secure
                  </Badge>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                      <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Activity Monitoring</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Student activity monitoring is enabled</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  >
                    Enabled
                  </Badge>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-2">
                      <MessageSquare className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Mentor Chat Review</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">AI mentor chat review needs attention</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                  >
                    Review Needed
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white dark:bg-slate-900 p-6 pt-0">
              <Button
                variant="outline"
                className="w-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={handleOpenSafetyReport}
              >
                View Detailed Safety Report
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                Recent Safety Alerts
              </CardTitle>
              <CardDescription className="text-slate-300">
                Safety notifications that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900 p-6">
              <div className="space-y-4">
                {!dismissedAlerts.includes("alert1") && (
                  <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Mentor Chat Content</h3>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                        Medium Priority
                      </Badge>
                    </div>
                    <p className="text-sm mb-3 text-gray-700 dark:text-gray-300">
                      AI mentor provided information that may need parent review in a science discussion with Enoch.
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>2 hours ago</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleConfirmAction("dismiss", "alert1")}>
                          Dismiss
                        </Button>
                        <Button size="sm" onClick={() => handleOpenAlertDetail("alert1")}>
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!dismissedAlerts.includes("alert2") && (
                  <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-medium text-gray-900 dark:text-white">External Resource Access</h3>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                        Medium Priority
                      </Badge>
                    </div>
                    <p className="text-sm mb-3 text-gray-700 dark:text-gray-300">
                      Sarah attempted to access an external website that requires parent approval.
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Yesterday</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleConfirmAction("block", "alert2")}>
                          Block
                        </Button>
                        <Button size="sm" onClick={() => handleConfirmAction("approve", "alert2")}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                Content Filtering
              </CardTitle>
              <CardDescription className="text-slate-300">
                Control what content your students can access
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900 p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    Web Content Filters
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="age-appropriate" className="text-gray-900 dark:text-white">
                          Age-Appropriate Content
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Filter content based on student age and grade level
                        </p>
                      </div>
                      <Switch id="age-appropriate" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="explicit-content" className="text-gray-900 dark:text-white">
                          Block Explicit Content
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Block content with explicit language, images, or themes
                        </p>
                      </div>
                      <Switch id="explicit-content" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="educational-only" className="text-gray-900 dark:text-white">
                          Educational Content Only
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Limit access to educational websites and resources only
                        </p>
                      </div>
                      <Switch id="educational-only" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    AI Mentor Chat Filters
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-content-review" className="text-gray-900 dark:text-white">
                          Parent Review of AI Responses
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Review AI mentor responses before they are shown to students
                        </p>
                      </div>
                      <Switch id="ai-content-review" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Blocked Content
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="blocked-content" className="text-gray-900 dark:text-white">
                      Blocked Content
                    </Label>
                    <Textarea
                      id="blocked-content"
                      placeholder="Enter websites, keywords, or phrases to block"
                      className="min-h-[150px] bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Content containing these items will be blocked from student access
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-white dark:bg-slate-900 p-6 pt-0">
              <Button
                variant="outline"
                className="hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white"
              >
                Reset to Defaults
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-400" />
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-slate-300">
                Control your family's privacy and data protection
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900 p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    Student Data Protection
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-collection" className="text-gray-900 dark:text-white">
                          Data Collection
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Allow collection of learning data to improve student experience
                        </p>
                      </div>
                      <Switch id="data-collection" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="third-party-sharing" className="text-gray-900 dark:text-white">
                          Third-Party Data Sharing
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Allow sharing of anonymized data with educational partners
                        </p>
                      </div>
                      <Switch id="third-party-sharing" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    Account Privacy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor" className="text-gray-900 dark:text-white">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Require two-factor authentication for parent account access
                        </p>
                      </div>
                      <Switch id="two-factor" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="session-timeout" className="text-gray-900 dark:text-white">
                          Session Timeout
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Automatically log out after period of inactivity
                        </p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-green-500" />
                    Student Profile Privacy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="use-real-name" className="text-gray-900 dark:text-white">
                          Use Real Names
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Use student's real name instead of a pseudonym
                        </p>
                      </div>
                      <Switch id="use-real-name" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-white dark:bg-slate-900 p-6 pt-0">
              <Button
                variant="outline"
                className="hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white"
              >
                Reset to Defaults
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                Data Management
              </CardTitle>
              <CardDescription className="text-slate-300">Manage your family's data</CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900 p-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Download Your Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Download a copy of all your family's data, including student work, progress reports, and account
                    information.
                  </p>
                  <Button
                    variant="outline"
                    className="hover:bg-white dark:hover:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Request Data Export
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Delete Account Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Permanently delete all data associated with your account. This action cannot be undone.
                  </p>
                  <Button variant="destructive">Request Data Deletion</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-400" />
                Activity Monitoring
              </CardTitle>
              <CardDescription className="text-slate-300">Monitor and manage student online activities</CardDescription>
            </CardHeader>
            <CardContent className="bg-white dark:bg-slate-900 p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    Monitoring Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="activity-logging" className="text-gray-900 dark:text-white">
                          Activity Logging
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Record student activities within the platform
                        </p>
                      </div>
                      <Switch id="activity-logging" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="external-monitoring" className="text-gray-900 dark:text-white">
                          External Website Monitoring
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Track websites visited through platform links
                        </p>
                      </div>
                      <Switch id="external-monitoring" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="time-tracking" className="text-gray-900 dark:text-white">
                          Time Tracking
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Monitor time spent on different subjects and activities
                        </p>
                      </div>
                      <Switch id="time-tracking" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-chat-logs" className="text-gray-900 dark:text-white">
                          AI Mentor Chat Logs
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Save and review conversations with AI mentors
                        </p>
                      </div>
                      <Switch id="ai-chat-logs" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Activity Reports
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-reports" className="text-gray-900 dark:text-white">
                          Weekly Activity Reports
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Receive weekly summaries of student activities
                        </p>
                      </div>
                      <Switch id="weekly-reports" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="space-y-0.5">
                        <Label htmlFor="alert-notifications" className="text-gray-900 dark:text-white">
                          Alert Notifications
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Receive notifications for concerning activities
                        </p>
                      </div>
                      <Switch id="alert-notifications" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Recent Student Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Enoch</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Completed Math assignment</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">2 hours ago</p>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Sarah</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Accessed Khan Academy</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">3 hours ago</p>
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Benjamin</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Chatted with AI mentor</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Yesterday</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full hover:bg-white dark:hover:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      View Full Activity Log
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-white dark:bg-slate-900 p-6 pt-0">
              <Button
                variant="outline"
                className="hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white"
              >
                Reset to Defaults
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Safety Report Modal */}
      <Dialog open={safetyReportOpen} onOpenChange={setSafetyReportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-emerald-500" />
              Detailed Safety Report
            </DialogTitle>
            <DialogDescription>Comprehensive overview of your family's safety and privacy settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  Filter Status by Student
                </h3>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Enoch</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Age-appropriate filters active</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      All Filters Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-pink-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sarah</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Custom filter settings</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                      Custom Settings
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Benjamin</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Standard filters active</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      All Filters Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  High Priority Alerts
                </h3>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900">
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <Info className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No high priority alerts at this time</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-500" />
                  Privacy Setting Audit
                </h3>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Enhanced account security</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Data Collection</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Learning data collection</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      Limited Collection
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Third-Party Sharing</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Data sharing with partners</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Disabled</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Detail Drawer */}
      <Sheet open={alertDetailOpen} onOpenChange={setAlertDetailOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Safety Alert Details
            </SheetTitle>
            <SheetDescription>Review the details of this safety alert</SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {currentAlert === "alert1" && (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">Mentor Chat Content</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Student: Enoch</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    Medium Priority
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Context</h4>
                  <div className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      During a science discussion about evolution, the AI mentor provided information that may need
                      parent review based on your educational values settings.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">AI Mentor Transcript</h4>
                  <div className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800 max-h-[200px] overflow-y-auto">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enoch:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Can you explain how different animals evolved?
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">AI Mentor:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Evolution is the process by which different kinds of living organisms developed from earlier
                          forms. According to the theory of evolution, all species have descended from common ancestors
                          through a process called natural selection.
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enoch:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">How old is the Earth then?</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">AI Mentor:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Scientific evidence suggests that the Earth is approximately 4.5 billion years old. This age
                          has been determined through various dating methods including radiometric dating of rocks and
                          meteorites.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentAlert === "alert2" && (
              <>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">External Resource Access</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-pink-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Student: Sarah</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    Medium Priority
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Context</h4>
                  <div className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Sarah attempted to access an external website (www.sciencegames.com) that requires parent approval
                      based on your content filtering settings.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Website Information</h4>
                  <div className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">www.sciencegames.com</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Educational website with interactive science games and simulations. Contains content for grades
                      K-12.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      >
                        Educational
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        Interactive
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                      >
                        Science
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <SheetFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                if (currentAlert) {
                  handleConfirmAction("dismiss", currentAlert)
                  setAlertDetailOpen(false)
                }
              }}
            >
              Dismiss Alert
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setAlertDetailOpen(false)}>
                Flag for Discussion
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  if (currentAlert) {
                    handleConfirmAction("approve", currentAlert)
                    setAlertDetailOpen(false)
                  }
                }}
              >
                Approve
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "dismiss" && "Dismiss Alert"}
              {confirmAction?.type === "block" && "Block Content"}
              {confirmAction?.type === "approve" && "Approve Content"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "dismiss" &&
                "Are you sure you want to dismiss this alert? It will be removed from your notifications."}
              {confirmAction?.type === "block" &&
                "Are you sure you want to block this content? Your student will not be able to access it."}
              {confirmAction?.type === "approve" &&
                "Are you sure you want to approve this content? Your student will be able to access it."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmComplete}>
              {confirmAction?.type === "dismiss" && "Dismiss"}
              {confirmAction?.type === "block" && "Block"}
              {confirmAction?.type === "approve" && "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
