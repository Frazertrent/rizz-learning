"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Mail,
  Moon,
  SettingsIcon,
  Sun,
  User,
  Users,
  Bell,
  FileText,
  ClipboardEdit,
  FileSpreadsheet,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

// Add these interfaces at the top of the file after imports
interface ParentIntakeForm {
  id: string
  parent_id: string
  created_at: string
  updated_at: string
  // Add other form fields as needed
}

interface FileEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList
  }
}

interface PasswordChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    id: string
    value: string
  }
}

export function Settings() {
  const [activeTab, setActiveTab] = useState("account")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFields, setPasswordFields] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [intakeFormData, setIntakeFormData] = useState<ParentIntakeForm | null>(null)
  const [isLoadingForm, setIsLoadingForm] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const handleAvatarChange = (e: FileEvent) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      toast({
        title: "Avatar selected",
        description: "Click Save Changes to update your profile picture.",
        variant: "default",
      })
    }
  }

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved successfully.",
      variant: "default",
      className:
        "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700",
    })
  }

  const handlePasswordChange = (e: PasswordChangeEvent) => {
    const { id, value } = e.target
    setPasswordFields({
      ...passwordFields,
      [id.replace("password-", "")]: value,
    })

    // Clear error when typing
    if (passwordError) {
      setPasswordError("")
    }
  }

  const handleSavePassword = () => {
    // Validate password fields
    if (!passwordFields.current) {
      setPasswordError("Please enter your current password")
      return
    }

    if (passwordFields.new !== passwordFields.confirm) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordFields.new.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    // If validation passes
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
      variant: "default",
    })

    // Reset fields
    setPasswordFields({
      current: "",
      new: "",
      confirm: "",
    })
  }

  const handleConnectAccount = (platform: string) => {
    toast({
      title: "Connecting to " + platform,
      description: "You will be redirected to authorize this connection.",
      variant: "default",
    })
  }

  const handleDisconnectAccount = (platform: string) => {
    toast({
      title: platform + " disconnected",
      description: "Your account has been disconnected successfully.",
      variant: "default",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated.",
      variant: "default",
    })
  }

  const handleResetNotifications = () => {
    toast({
      title: "Notification preferences reset",
      description: "Your notification settings have been reset to defaults.",
      variant: "default",
    })
  }

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your display preferences have been updated.",
      variant: "default",
    })
  }

  const handleResetPreferences = () => {
    toast({
      title: "Preferences reset",
      description: "Your display preferences have been reset to defaults.",
      variant: "default",
    })
  }

  useEffect(() => {
    async function fetchIntakeFormData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        console.log('🔍 Making query to:', 'parent_intake_form', 'from:', 'settings.tsx', { user });
        const { data, error } = await supabase
          .from('parent_intake_form')
          .select('*')
          .eq('parent_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching intake form:', error)
          toast({
            title: "Error loading intake form data",
            description: "Please try again later",
            variant: "destructive",
          })
        } else {
          console.log('Fetched intake form data:', data)
          setIntakeFormData(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoadingForm(false)
      }
    }

    if (activeTab === 'preferences') {
      fetchIntakeFormData()
    }
  }, [activeTab])

  const handleEditStep = (step: number) => {
    router.push(`/parent-intake?step=${step}&edit=true`)
  }

  const handleNewForm = () => {
    router.push('/parent-intake?new=true')
  }

  const handleViewResponses = () => {
    router.push('/parent-intake/responses')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      {/* Remove Global Navigation Bar */}

      <Tabs defaultValue="account" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 h-auto p-1 rounded-full bg-muted/80 backdrop-blur-sm">
          <TabsTrigger
            value="account"
            className="py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" /> 🧾 Account
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2"
          >
            <User className="h-4 w-4" /> 👤 Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2"
          >
            <Bell className="h-4 w-4" /> 🔔 Notifications
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2"
          >
            <SettingsIcon className="h-4 w-4" /> ⚙️ Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card className="border-primary/20 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="h-5 w-5 text-primary" /> Account Information
                  </CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 rounded-full" asChild>
                        <a href="/parent">
                          <ExternalLink className="h-4 w-4" />
                          View Dashboard
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Return to your dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                      <AvatarImage src={avatarPreview || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                        Change Avatar
                      </Button>
                    </label>
                    {avatarPreview && <p className="text-xs text-green-600 dark:text-green-400">New avatar selected</p>}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          defaultValue="Parent"
                          className="transition-all focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          defaultValue="User"
                          className="transition-all focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="email"
                          type="email"
                          defaultValue="parent@example.com"
                          className="transition-all focus:ring-2 focus:ring-primary/30"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" asChild>
                                <a href="mailto:parent@example.com">
                                  <Mail className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open in email client</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  {passwordError && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password-current">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="password-current"
                          type={showPassword ? "text" : "password"}
                          value={passwordFields.current}
                          onChange={handlePasswordChange}
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="password-new">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password-new"
                          type={showPassword ? "text" : "password"}
                          value={passwordFields.new}
                          onChange={handlePasswordChange}
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-confirm">Confirm New Password</Label>
                      <Input
                        id="password-confirm"
                        type={showPassword ? "text" : "password"}
                        value={passwordFields.confirm}
                        onChange={handlePasswordChange}
                        className={`transition-all focus:ring-2 focus:ring-primary/30 ${
                          passwordFields.new && passwordFields.confirm && passwordFields.new !== passwordFields.confirm
                            ? "border-red-500 focus:ring-red-500/30"
                            : ""
                        }`}
                      />
                      {passwordFields.new &&
                        passwordFields.confirm &&
                        passwordFields.new !== passwordFields.confirm && (
                          <p className="text-xs text-red-500">Passwords do not match</p>
                        )}
                    </div>
                  </div>
                  <Button onClick={handleSavePassword} className="relative overflow-hidden group">
                    <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveProfile} className="relative overflow-hidden group rounded-full">
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 group-hover:w-full transition-all duration-500 opacity-20 rounded-full"></div>
                <span className="relative z-10 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Changes
                </span>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent rounded-t-lg">
              <CardTitle>Linked Accounts</CardTitle>
              <CardDescription>Manage accounts linked to your profile</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Google</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="relative overflow-hidden group">
                        <div className="absolute inset-0 w-3 bg-gradient-to-r from-red-500 to-red-300 group-hover:w-full transition-all duration-300 opacity-10"></div>
                        Disconnect
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Disconnect Google</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to disconnect your Google account? This will remove single sign-on
                          functionality.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex justify-between sm:justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDisconnectAccount("Google")}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Yes, Disconnect
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnectAccount("Facebook")}
                          className="relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                          Connect
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Used for easier login</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnectAccount("Twitter")}
                          className="relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                          Connect
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Used for easier login</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Parent Profile</CardTitle>
                  <CardDescription>Manage your parent profile information</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                        <a href="/parent/students">
                          <Users className="h-4 w-4" />
                          Student Management
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Manage your students</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Personal Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 555-5555"
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                      <p className="text-xs text-muted-foreground">Format: (XXX) XXX-XXXX</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="america-new_york">
                        <SelectTrigger id="timezone" className="transition-all focus:ring-2 focus:ring-primary/30">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america-new_york">Eastern Time (ET)</SelectItem>
                          <SelectItem value="america-chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="america-denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="america-los_angeles">Pacific Time (PT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select defaultValue="english">
                        <SelectTrigger id="language" className="transition-all focus:ring-2 focus:ring-primary/30">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education-approach">Homeschool Approach</Label>
                      <Select defaultValue="eclectic">
                        <SelectTrigger
                          id="education-approach"
                          className="transition-all focus:ring-2 focus:ring-primary/30"
                        >
                          <SelectValue placeholder="Select approach" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classical">Classical</SelectItem>
                          <SelectItem value="charlotte-mason">Charlotte Mason</SelectItem>
                          <SelectItem value="montessori">Montessori</SelectItem>
                          <SelectItem value="unschooling">Unschooling</SelectItem>
                          <SelectItem value="eclectic">Eclectic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">About Me</h3>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and your homeschooling journey"
                      className="min-h-[100px] transition-all focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground">
                      This information may be visible to mentors and administrators
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Emergency Contact</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Contact Name</Label>
                      <Input
                        id="emergency-name"
                        placeholder="Full name"
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Contact Phone</Label>
                      <Input
                        id="emergency-phone"
                        type="tel"
                        placeholder="(555) 555-5555"
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-relationship">Relationship</Label>
                      <Input
                        id="emergency-relationship"
                        placeholder="e.g., Spouse, Parent, Friend"
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveProfile} className="relative overflow-hidden group">
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent rounded-t-lg">
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-student-activity" className="flex items-center gap-2">
                          Student Activity
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Receive emails about assignments, grades, and other student activities</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive emails about your students' activities</p>
                      </div>
                      <Switch
                        id="email-student-activity"
                        defaultChecked
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:after:content-['✓'] data-[state=checked]:after:text-[10px] data-[state=checked]:after:flex data-[state=checked]:after:items-center data-[state=checked]:after:justify-center data-[state=checked]:after:text-white data-[state=unchecked]:bg-red-400/30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-mentor-messages" className="flex items-center gap-2">
                          Mentor Messages
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Receive emails when mentors send you messages or feedback</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive emails when mentors send messages</p>
                      </div>
                      <Switch
                        id="email-mentor-messages"
                        defaultChecked
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:after:content-['✓'] data-[state=checked]:after:text-[10px] data-[state=checked]:after:flex data-[state=checked]:after:items-center data-[state=checked]:after:justify-center data-[state=checked]:after:text-white data-[state=unchecked]:bg-red-400/30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-system-updates" className="flex items-center gap-2">
                          System Updates
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Receive emails about platform updates, new features, and maintenance</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about system updates and new features
                        </p>
                      </div>
                      <Switch
                        id="email-system-updates"
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:after:content-['✓'] data-[state=checked]:after:text-[10px] data-[state=checked]:after:flex data-[state=checked]:after:items-center data-[state=checked]:after:justify-center data-[state=checked]:after:text-white data-[state=unchecked]:bg-red-400/30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-newsletters" className="flex items-center gap-2">
                          Newsletters
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Receive educational newsletters, resources, and homeschooling tips</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive educational newsletters and resources</p>
                      </div>
                      <Switch
                        id="email-newsletters"
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:after:content-['✓'] data-[state=checked]:after:text-[10px] data-[state=checked]:after:flex data-[state=checked]:after:items-center data-[state=checked]:after:justify-center data-[state=checked]:after:text-white data-[state=unchecked]:bg-red-400/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">In-App Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-student-activity" className="flex items-center gap-2">
                          Student Activity
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Receive in-app notifications about student activities</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your students' activities
                        </p>
                      </div>
                      <Switch
                        id="app-student-activity"
                        defaultChecked
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:after:content-['✓'] data-[state=checked]:after:text-[10px] data-[state=checked]:after:flex data-[state=checked]:after:items-center data-[state=checked]:after:justify-center data-[state=checked]:after:text-white data-[state=unchecked]:bg-red-400/30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-mentor-messages" className="flex items-center gap-2">
                          Mentor Messages
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Receive in-app notifications when mentors send messages</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when mentors send messages
                        </p>
                      </div>
                      <Switch
                        id="app-mentor-messages"
                        defaultChecked
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:after:content-['✓'] data-[state=checked]:after:text-[10px] data-[state=checked]:after:flex data-[state=checked]:after:items-center data-[state=checked]:after:justify-center data-[state=checked]:after:text-white data-[state=unchecked]:bg-red-400/30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-system-updates" className="flex items-center gap-2">
                          System Updates
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Receive in-app notifications about system updates</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system updates and new features
                        </p>
                      </div>
                      <Switch
                        id="app-system-updates"
                        defaultChecked
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:after:content-['✓'] data-[state=checked]:after:text-[10px] data-[state=checked]:after:flex data-[state=checked]:after:items-center data-[state=checked]:after:justify-center data-[state=checked]:after:text-white data-[state=unchecked]:bg-red-400/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Frequency</h3>
                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Email Digest Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger
                        id="notification-frequency"
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      >
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">How often you want to receive email notifications</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetNotifications}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveNotifications} className="relative overflow-hidden group">
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>Customize your dashboard experience</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                        <a href="/parent">
                          <ExternalLink className="h-4 w-4" />
                          Preview Dashboard
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>See how your preferences affect the dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Display Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode" className="flex items-center gap-2">
                          Dark Mode
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Use dark theme for the dashboard</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Use dark theme for the dashboard</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch id="dark-mode" />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-view" className="flex items-center gap-2">
                          Compact View
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Display more information in less space</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Display more information in less space</p>
                      </div>
                      <Switch id="compact-view" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Dashboard Customization</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-progress" className="flex items-center gap-2">
                          Show Progress Metrics
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Display student progress metrics on dashboard</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Display student progress metrics on dashboard</p>
                      </div>
                      <Switch id="show-progress" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-calendar" className="flex items-center gap-2">
                          Show Calendar
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Display calendar events on dashboard</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Display calendar events on dashboard</p>
                      </div>
                      <Switch id="show-calendar" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-rewards" className="flex items-center gap-2">
                          Show Rewards
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Display student rewards and achievements</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Display student rewards and achievements</p>
                      </div>
                      <Switch id="show-rewards" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Parent Intake Form</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium">Manage your educational preferences and requirements</h4>
                        {intakeFormData && (
                          <p className="text-sm text-muted-foreground">
                            Last updated: {new Date(intakeFormData.updated_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleViewResponses}
                          className="flex items-center gap-2"
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          View All Responses
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleNewForm}
                          className="flex items-center gap-2"
                        >
                          <ClipboardEdit className="h-4 w-4" />
                          Complete New Form
                        </Button>
                      </div>
                    </div>

                    {isLoadingForm ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { step: 1, title: "Educational Vision", icon: "🎯" },
                          { step: 2, title: "Home/School Split", icon: "🏠" },
                          { step: 3, title: "Program Tools", icon: "🛠️" },
                          { step: 4, title: "Schedule Preferences", icon: "📅" },
                          { step: 5, title: "Mentor Personality", icon: "👤" },
                          { step: 6, title: "Educational Values", icon: "🌟" },
                          { step: 7, title: "Student Profile", icon: "👨‍🎓" },
                          { step: 8, title: "Extracurriculars", icon: "🎨" },
                          { step: 9, title: "Device Access", icon: "💻" },
                          { step: 10, title: "Parent Oversight", icon: "👀" },
                          { step: 11, title: "Accountability", icon: "✅" },
                          { step: 12, title: "Budget & Grants", icon: "💰" },
                          { step: 13, title: "Applications", icon: "📝" },
                        ].map((item) => (
                          <Button
                            key={item.step}
                            variant="outline"
                            className="h-auto py-4 px-4 flex flex-col items-start gap-1 relative overflow-hidden group"
                            onClick={() => handleEditStep(item.step)}
                          >
                            <div className="absolute inset-0 w-1 bg-gradient-to-b from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10" />
                            <div className="flex items-center gap-2 w-full">
                              <span className="text-lg">{item.icon}</span>
                              <span className="font-medium">{item.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">Edit Step {item.step}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Accessibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="larger-text" className="flex items-center gap-2">
                          Larger Text
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Increase text size throughout the application</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Increase text size throughout the application</p>
                      </div>
                      <Switch id="larger-text" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="high-contrast" className="flex items-center gap-2">
                          High Contrast
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Use high contrast colors for better visibility</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Use high contrast colors for better visibility</p>
                      </div>
                      <Switch id="high-contrast" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduce-motion" className="flex items-center gap-2">
                          Reduce Motion
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Minimize animations and transitions</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                      </div>
                      <Switch id="reduce-motion" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetPreferences}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSavePreferences} className="relative overflow-hidden group">
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
