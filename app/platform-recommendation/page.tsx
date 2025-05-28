"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  Info,
  Lightbulb,
  Lock,
  MessageSquare,
  Pencil,
  RefreshCw,
  Settings,
  Star,
  Award,
  Check,
  ChevronRight,
} from "lucide-react"
import { SavePreferencesButton } from "@/components/preferences/save-preferences-button"

// Dummy platform data - this would be replaced with real data in the future
const platformData = {
  math: [
    {
      id: "khan-academy",
      name: "Khan Academy",
      description: "Free world-class education for anyone, anywhere.",
      matchScore: 92,
      keyFeatures: [
        "Self-paced learning",
        "Comprehensive math curriculum",
        "Interactive exercises",
        "Progress tracking",
      ],
      bestFor: ["Visual learners", "Self-directed students", "Flexible scheduling"],
      structureLevel: "flexible",
      pricingModel: "free",
      costRange: "$0/month",
      supportLevel: "medium",
      logo: "/placeholder.svg?key=cswhp",
      url: "https://www.khanacademy.org/",
      matchReasons: [
        "Aligns with your flexible scheduling needs",
        "Supports visual learning style",
        "Provides comprehensive math curriculum",
        "Offers self-paced progression",
      ],
    },
    {
      id: "brilliant",
      name: "Brilliant",
      description: "Learn to think like a mathematician, scientist, or engineer.",
      matchScore: 87,
      keyFeatures: ["Problem-based learning", "Interactive challenges", "Conceptual understanding", "STEM focus"],
      bestFor: ["Advanced students", "Critical thinkers", "Challenge seekers"],
      structureLevel: "balanced",
      pricingModel: "subscription",
      costRange: "$12.99-$19.99/month",
      supportLevel: "low",
      logo: "/placeholder.svg?key=duvx1",
      url: "https://brilliant.org/",
      matchReasons: [
        "Supports critical thinking development",
        "Offers challenging content for advanced learners",
        "Provides interactive problem-solving experiences",
        "Integrates multiple STEM subjects",
      ],
    },
    {
      id: "teaching-textbooks",
      name: "Teaching Textbooks",
      description: "Complete math curriculum with automated grading and tracking.",
      matchScore: 85,
      keyFeatures: ["Complete curriculum", "Automated grading", "Step-by-step solutions", "Parent dashboard"],
      bestFor: ["Traditional approach", "Independent workers", "Structured learning"],
      structureLevel: "structured",
      pricingModel: "one-time purchase",
      costRange: "$43.08-$67.08/month",
      supportLevel: "high",
      logo: "/placeholder.svg?key=sd6zp",
      url: "https://www.teachingtextbooks.com/",
      matchReasons: [
        "Provides complete curriculum with clear structure",
        "Includes automated grading to reduce parent workload",
        "Offers detailed parent dashboard for monitoring",
        "Supports independent learning with step-by-step solutions",
      ],
    },
  ],
  science: [
    {
      id: "mystery-science",
      name: "Mystery Science",
      description: "Ready-made science lessons with engaging videos and hands-on activities.",
      matchScore: 94,
      keyFeatures: ["Video-based lessons", "Hands-on activities", "No prep required", "Engaging content"],
      bestFor: ["Elementary students", "Hands-on learners", "Curious minds"],
      structureLevel: "balanced",
      pricingModel: "subscription",
      costRange: "$69-$99/year",
      supportLevel: "medium",
      logo: "/placeholder.svg?key=lfczq",
      url: "https://mysteryscience.com/",
      matchReasons: [
        "Designed for elementary-aged curious learners",
        "Balances structure with engaging activities",
        "Requires minimal parent preparation",
        "Includes hands-on components for experiential learning",
      ],
    },
    {
      id: "generation-genius",
      name: "Generation Genius",
      description: "Science videos, lessons, and activities aligned with NGSS standards.",
      matchScore: 89,
      keyFeatures: ["Video lessons", "NGSS aligned", "Teacher guides", "Quizzes and activities"],
      bestFor: ["Visual learners", "Standards-focused", "Structured approach"],
      structureLevel: "structured",
      pricingModel: "subscription",
      costRange: "$95-$120/year",
      supportLevel: "high",
      logo: "/placeholder.svg?key=p2jak",
      url: "https://www.generationgenius.com/",
      matchReasons: [
        "Aligns with educational standards for academic rigor",
        "Provides structured approach with clear progression",
        "Includes comprehensive teacher guides for parent support",
        "Offers visual learning through engaging video content",
      ],
    },
  ],
  "language arts": [
    {
      id: "brave-writer",
      name: "Brave Writer",
      description: "Natural, literature-based approach to writing and language arts.",
      matchScore: 91,
      keyFeatures: ["Literature-based", "Natural writing development", "Flexible implementation", "Parent coaching"],
      bestFor: ["Creative writers", "Literature lovers", "Flexible approach"],
      structureLevel: "flexible",
      pricingModel: "mixed",
      costRange: "$99-$249/course",
      supportLevel: "high",
      logo: "/placeholder.svg?key=pufce",
      url: "https://bravewriter.com/",
      matchReasons: [
        "Supports creative expression and natural writing development",
        "Offers flexibility in implementation to match your schedule",
        "Provides strong parent coaching and support",
        "Uses literature as foundation for language development",
      ],
    },
    {
      id: "institute-for-excellence-in-writing",
      name: "Institute for Excellence in Writing",
      description: "Structured writing program with clear methodology and incremental steps.",
      matchScore: 88,
      keyFeatures: ["Structured approach", "Clear methodology", "Incremental steps", "Parent/teacher support"],
      bestFor: ["Structured approach", "Sequential learning", "Clear expectations"],
      structureLevel: "structured",
      pricingModel: "one-time purchase",
      costRange: "$89-$299/level",
      supportLevel: "high",
      logo: "/placeholder.svg?key=ih7me",
      url: "https://iew.com/",
      matchReasons: [
        "Provides clear structure and methodology",
        "Offers incremental progression for steady skill building",
        "Includes strong parent/teacher support materials",
        "Sets clear expectations for writing development",
      ],
    },
  ],
}

// Default preferences - these would be populated from the parent's intake form
const defaultPreferences = {
  targetGpa: { hasPreference: false, value: 3.5 },
  outcomeLevel: "proficient",
  structurePreference: "balanced",
  daysPerWeek: 5,
  startTime: "08:00",
  endTime: "15:00",
  blockLength: 45,
  termStructure: "school",
  mentorTone: "professional",
  learningStyle: ["Visual", "Self-paced"],
  budget: "medium",
  timeCommitment: "medium",
}

export default function PlatformRecommendationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const parentId = searchParams.get("id")
  const subjectParam = searchParams.get("subject")
  const subject = subjectParam ? subjectParam.toLowerCase() : "math"

  const [loading, setLoading] = useState(true)
  const [parentData, setParentData] = useState<any>(null)
  const [intakeData, setIntakeData] = useState<any>(null)
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [platforms, setPlatforms] = useState<any[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [editingPreference, setEditingPreference] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!parentId) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Fetch parent profile data
        const { data: parentProfile, error: parentError } = await supabase
          .from("parent_profile")
          .select("*")
          .eq("id", parentId)
          .single()

        if (parentError) throw parentError

        // Fetch intake form data
        const { data: intakeForm, error: intakeError } = await supabase
          .from("parent_intake_form")
          .select("*")
          .eq("parent_id", parentId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (intakeError && intakeError.code !== "PGRST116") throw intakeError

        setParentData(parentProfile)
        setIntakeData(intakeForm)

        // Update preferences based on intake form data
        if (intakeForm) {
          setPreferences({
            targetGpa: intakeForm.target_gpa || defaultPreferences.targetGpa,
            outcomeLevel: intakeForm.outcome_level || defaultPreferences.outcomeLevel,
            structurePreference: intakeForm.structure_preference || defaultPreferences.structurePreference,
            daysPerWeek: intakeForm.school_days?.length || defaultPreferences.daysPerWeek,
            startTime: intakeForm.start_time || defaultPreferences.startTime,
            endTime: intakeForm.end_time || defaultPreferences.endTime,
            blockLength: intakeForm.block_length || defaultPreferences.blockLength,
            termStructure: intakeForm.term_structure || defaultPreferences.termStructure,
            mentorTone: intakeForm.mentor_personality?.[0] || defaultPreferences.mentorTone,
            learningStyle: intakeForm.educational_values || defaultPreferences.learningStyle,
            budget: "medium", // Default since we don't have this in the intake form
            timeCommitment: "medium", // Default since we don't have this in the intake form
          })
        }

        // Get platforms for the selected subject
        const subjectKey = subject.toLowerCase()
        const availablePlatforms = platformData[subjectKey as keyof typeof platformData] || platformData.math
        setPlatforms(availablePlatforms)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [parentId, subject])

  // Update recommendations when preferences change
  useEffect(() => {
    if (platforms.length > 0) {
      // In a real implementation, this would recalculate match scores based on preferences
      // For now, we'll just use the dummy data
      const updatedPlatforms = [...platforms]
      setPlatforms(updatedPlatforms)
    }
  }, [preferences])

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const togglePlatformSelection = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        return prev.filter((id) => id !== platformId)
      } else {
        return [...prev, platformId]
      }
    })
  }

  const formatOutcomeLevel = (level: string) => {
    switch (level) {
      case "mastery":
        return "Mastery (90%+)"
      case "proficient":
        return "Proficient (80-89%)"
      case "passing":
        return "Passing (70-79%)"
      default:
        return "Proficient (80-89%)"
    }
  }

  const formatStructurePreference = (preference: string) => {
    switch (preference) {
      case "structured":
        return "Highly structured"
      case "flexible":
        return "Flexible & adaptable"
      case "balance":
      case "balanced":
        return "Balanced approach"
      default:
        return "Balanced approach"
    }
  }

  const formatTermStructure = (structure: string) => {
    switch (structure) {
      case "school":
        return "Traditional school year"
      case "year_round":
        return "Year-round learning"
      case "custom":
        return "Custom schedule"
      default:
        return "Traditional school year"
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Finding the Best Platforms for You...</h2>
          <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">Just a moment while we analyze your preferences!</p>
        </div>
      </div>
    )
  }

  // Show a message if no parent ID is provided
  if (!parentId) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Card className="border-red-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl">Missing Information</CardTitle>
            <CardDescription>
              We couldn't find your profile information. Please complete the intake form first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              To receive personalized platform recommendations, you need to complete the parent intake form.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/parent-intake">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Go to Parent Intake Form <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const parentName = parentData?.first_name || "Parent"
  const formattedSubject = subject.charAt(0).toUpperCase() + subject.slice(1)

  // Get the top recommended platform
  const topPlatform = platforms.length > 0 ? platforms[0] : null

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Back button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>
      </div>

      {/* 1. Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Recommended Learning Platforms for{" "}
          <span className="bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            {formattedSubject}
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Based on your preferences, here are the platforms that could be the best match for your learner.
        </p>
      </div>

      {/* 2. Current Preferences Panel */}
      <Card className="mb-12 border-gray-700 bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Your Current Preferences</CardTitle>
            <Button variant="outline" size="sm" className="text-gray-300 border-gray-600">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
          <CardDescription>
            These settings determine your platform recommendations. Adjust them to see different options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Target GPA */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="font-medium">Target GPA</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Target GPA</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Adjust Target GPA</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has-gpa-target"
                          checked={preferences.targetGpa.hasPreference}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange("targetGpa", {
                              ...preferences.targetGpa,
                              hasPreference: !!checked,
                            })
                          }
                        />
                        <Label htmlFor="has-gpa-target">Set specific GPA target</Label>
                      </div>
                      {preferences.targetGpa.hasPreference && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>GPA Target: {preferences.targetGpa.value}</span>
                          </div>
                          <Slider
                            value={[preferences.targetGpa.value * 10]}
                            min={20}
                            max={40}
                            step={1}
                            onValueChange={(value) =>
                              handlePreferenceChange("targetGpa", {
                                ...preferences.targetGpa,
                                value: value[0] / 10,
                              })
                            }
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>2.0</span>
                            <span>3.0</span>
                            <span>4.0</span>
                          </div>
                        </div>
                      )}
                      <SavePreferencesButton
                        preferences={preferences}
                        onSuccess={() => setEditingPreference(null)}
                        closePopover={() => setEditingPreference(null)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-gray-300">
                {preferences.targetGpa.hasPreference ? `${preferences.targetGpa.value} GPA` : "No specific target"}
              </p>
            </div>

            {/* Expected Outcome */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-purple-400" />
                  <span className="font-medium">Expected Outcome</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Expected Outcome</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Adjust Expected Outcome</h4>
                      <Select
                        value={preferences.outcomeLevel}
                        onValueChange={(value) => handlePreferenceChange("outcomeLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select outcome level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mastery">Mastery (90%+)</SelectItem>
                          <SelectItem value="proficient">Proficient (80-89%)</SelectItem>
                          <SelectItem value="passing">Passing (70-79%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <SavePreferencesButton
                        preferences={preferences}
                        onSuccess={() => setEditingPreference(null)}
                        closePopover={() => setEditingPreference(null)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-gray-300">{formatOutcomeLevel(preferences.outcomeLevel)}</p>
            </div>

            {/* Schedule */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="font-medium">Schedule</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Schedule</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Adjust Schedule</h4>
                      <div className="space-y-2">
                        <Label>Days per week</Label>
                        <Select
                          value={preferences.daysPerWeek.toString()}
                          onValueChange={(value) => handlePreferenceChange("daysPerWeek", Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="2">2 days</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="4">4 days</SelectItem>
                            <SelectItem value="5">5 days</SelectItem>
                            <SelectItem value="6">6 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Start time</Label>
                          <Select
                            value={preferences.startTime}
                            onValueChange={(value) => handlePreferenceChange("startTime", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="07:00">7:00 AM</SelectItem>
                              <SelectItem value="08:00">8:00 AM</SelectItem>
                              <SelectItem value="09:00">9:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>End time</Label>
                          <Select
                            value={preferences.endTime}
                            onValueChange={(value) => handlePreferenceChange("endTime", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="13:00">1:00 PM</SelectItem>
                              <SelectItem value="14:00">2:00 PM</SelectItem>
                              <SelectItem value="15:00">3:00 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                              <SelectItem value="17:00">5:00 PM</SelectItem>
                              <SelectItem value="18:00">6:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <SavePreferencesButton
                        preferences={preferences}
                        onSuccess={() => setEditingPreference(null)}
                        closePopover={() => setEditingPreference(null)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-gray-300">
                {preferences.daysPerWeek} days/week, {preferences.startTime} to {preferences.endTime}
              </p>
            </div>

            {/* Structure */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-green-400" />
                  <span className="font-medium">Structure</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Structure</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Adjust Structure</h4>
                      <div className="space-y-2">
                        <Label>Term Structure</Label>
                        <Select
                          value={preferences.termStructure}
                          onValueChange={(value) => handlePreferenceChange("termStructure", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select term structure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="school">Traditional school year</SelectItem>
                            <SelectItem value="year_round">Year-round learning</SelectItem>
                            <SelectItem value="custom">Custom schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Structure Preference</Label>
                        <Select
                          value={preferences.structurePreference}
                          onValueChange={(value) => handlePreferenceChange("structurePreference", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select structure preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="structured">Highly structured</SelectItem>
                            <SelectItem value="balanced">Balanced approach</SelectItem>
                            <SelectItem value="flexible">Flexible & adaptable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <SavePreferencesButton
                        preferences={preferences}
                        onSuccess={() => setEditingPreference(null)}
                        closePopover={() => setEditingPreference(null)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-gray-300">
                {formatTermStructure(preferences.termStructure)},{" "}
                {formatStructurePreference(preferences.structurePreference)}
              </p>
            </div>

            {/* Learning Block */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-red-400" />
                  <span className="font-medium">Learning Block</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Learning Block</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Adjust Learning Block</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Block Length: {preferences.blockLength} minutes</span>
                        </div>
                        <Slider
                          value={[preferences.blockLength]}
                          min={15}
                          max={90}
                          step={15}
                          onValueChange={(value) => handlePreferenceChange("blockLength", value[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>15 min</span>
                          <span>45 min</span>
                          <span>90 min</span>
                        </div>
                      </div>
                      <SavePreferencesButton
                        preferences={preferences}
                        onSuccess={() => setEditingPreference(null)}
                        closePopover={() => setEditingPreference(null)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-gray-300">{preferences.blockLength} minutes</p>
            </div>

            {/* Tone Preference */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-indigo-400" />
                  <span className="font-medium">Tone Preference</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Tone Preference</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Adjust Tone Preference</h4>
                      <Select
                        value={preferences.mentorTone}
                        onValueChange={(value) => handlePreferenceChange("mentorTone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="encouraging">Encouraging</SelectItem>
                          <SelectItem value="direct">Direct</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                        </SelectContent>
                      </Select>
                      <SavePreferencesButton
                        preferences={preferences}
                        onSuccess={() => setEditingPreference(null)}
                        closePopover={() => setEditingPreference(null)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-gray-300">
                {preferences.mentorTone.charAt(0).toUpperCase() + preferences.mentorTone.slice(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW SECTION: Your Plan, Validated */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Plan, Validated</h2>

        {topPlatform && (
          <Card className="border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <img
                    src={topPlatform.logo || "/placeholder.svg"}
                    alt={`${topPlatform.name} logo`}
                    className="w-12 h-12 mr-4 rounded-md"
                  />
                  <div>
                    <CardTitle className="text-2xl">{topPlatform.name}</CardTitle>
                    <CardDescription className="text-base">{topPlatform.description}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white px-3 py-1 text-sm">{topPlatform.matchScore}% Match</Badge>
              </div>
            </CardHeader>

            {/* Section 1: Current Selected Preferences */}
            <CardContent className="pt-6">
              <div className="bg-gray-800/50 rounded-lg p-5 mb-6">
                <h3 className="text-lg font-medium mb-3">Your Selected Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                      <Star className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Learning Goals</p>
                      <p className="text-sm text-gray-300">
                        {preferences.targetGpa.hasPreference
                          ? `${preferences.targetGpa.value} GPA target with ${formatOutcomeLevel(preferences.outcomeLevel)}`
                          : `${formatOutcomeLevel(preferences.outcomeLevel)} without specific GPA target`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-500/20 p-2 rounded-full mr-3">
                      <Calendar className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Schedule</p>
                      <p className="text-sm text-gray-300">
                        {preferences.daysPerWeek} days/week, {preferences.blockLength} minute blocks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-500/20 p-2 rounded-full mr-3">
                      <Settings className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Structure</p>
                      <p className="text-sm text-gray-300">
                        {formatStructurePreference(preferences.structurePreference)},{" "}
                        {formatTermStructure(preferences.termStructure)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-amber-500/20 p-2 rounded-full mr-3">
                      <MessageSquare className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium">Learning Style</p>
                      <p className="text-sm text-gray-300">
                        {Array.isArray(preferences.learningStyle)
                          ? preferences.learningStyle.join(", ")
                          : "Visual, Self-paced"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Why This Plan is a Good Match */}
              <div className="bg-gray-800/50 rounded-lg p-5 mb-6">
                <h3 className="text-lg font-medium mb-3">This plan is a good match because...</h3>
                <div className="space-y-3">
                  {topPlatform.matchReasons.map((reason: string, index: number) => (
                    <div key={index} className="flex items-start bg-green-900/10 p-3 rounded-md">
                      <div className="bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                      <p className="text-gray-200">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Other Families Also Explored */}
              <div className="bg-gray-800/50 rounded-lg p-5">
                <h3 className="text-lg font-medium mb-3">Other families like yours also explored...</h3>
                <div className="space-y-4">
                  {platforms.slice(1, 3).map((platform) => (
                    <div
                      key={platform.id}
                      className="border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <img
                            src={platform.logo || "/placeholder.svg"}
                            alt={`${platform.name} logo`}
                            className="w-8 h-8 mr-3 rounded-md"
                          />
                          <div>
                            <h4 className="font-medium">{platform.name}</h4>
                            <p className="text-sm text-gray-400">{platform.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-gray-700 text-gray-200">
                          {platform.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-3">
                        <div>
                          <h5 className="text-xs font-medium text-gray-400 mb-1">Key Features</h5>
                          <div className="flex flex-wrap gap-1">
                            {platform.keyFeatures.slice(0, 2).map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-gray-800 text-gray-200 text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {platform.keyFeatures.length > 2 && (
                              <span className="text-xs text-gray-400">+{platform.keyFeatures.length - 2} more</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-xs font-medium text-gray-400 mb-1">Best For</h5>
                          <div className="flex flex-wrap gap-1">
                            {platform.bestFor.slice(0, 2).map((trait: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-gray-800 text-gray-200 text-xs">
                                {trait}
                              </Badge>
                            ))}
                            {platform.bestFor.length > 2 && (
                              <span className="text-xs text-gray-400">+{platform.bestFor.length - 2} more</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-xs font-medium text-gray-400 mb-1">Structure Level</h5>
                          <p className="text-sm">
                            {platform.structureLevel.charAt(0).toUpperCase() + platform.structureLevel.slice(1)}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-xs font-medium text-gray-400 mb-1">Pricing Model</h5>
                          <p className="text-sm">{platform.costRange}</p>
                        </div>

                        <div>
                          <h5 className="text-xs font-medium text-gray-400 mb-1">Support Level</h5>
                          <p className="text-sm">
                            {platform.supportLevel.charAt(0).toUpperCase() + platform.supportLevel.slice(1)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          See Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Pencil className="mr-2 h-4 w-4" />
                Adjust Preferences
              </Button>
              <a href={topPlatform.url} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                  Visit {topPlatform.name}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* 4. Explanation & Discovery */}
      <Card className="mb-12 border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
            Not sure which is best? Let's explore together.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="mr-2 h-4 w-4 text-blue-400" />
                What if I want more structure?
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                More structured platforms provide clear daily lessons, assessments, and a traditional approach. They're
                ideal for families who thrive with routine and measurable progress.
              </p>
              <Button
                size="sm"
                onClick={() => handlePreferenceChange("structurePreference", "structured")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update to Structured Approach
              </Button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="mr-2 h-4 w-4 text-green-400" />
                How does switching to a year-round schedule change my options?
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                Year-round learning spreads education throughout the calendar, reducing summer learning loss and
                allowing for more breaks during the traditional school year. It works well with flexible platforms.
              </p>
              <Button
                size="sm"
                onClick={() => handlePreferenceChange("termStructure", "year_round")}
                className="bg-green-600 hover:bg-green-700"
              >
                Try Year-Round Schedule
              </Button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="mr-2 h-4 w-4 text-purple-400" />
                Why was {platforms[0]?.name} recommended?
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                {platforms[0]?.name} was recommended because it aligns with your {preferences.structurePreference}{" "}
                structure preference, works well with your {preferences.daysPerWeek}-day schedule, and supports your
                expected outcome level of {formatOutcomeLevel(preferences.outcomeLevel)}.
              </p>
              <Button
                size="sm"
                onClick={() => togglePlatformSelection(platforms[0]?.id)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Select This Platform
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-700 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Ready to move forward?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lock className="mr-2 h-5 w-5 text-green-400" />
                Lock in your platform choice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Ready to commit to a platform? Save your selection to your profile and get started with your chosen
                learning platform.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                disabled={selectedPlatforms.length !== 1}
              >
                {selectedPlatforms.length === 1 ? (
                  <>
                    Confirm Selection <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>Select a platform first</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Pencil className="mr-2 h-5 w-5 text-blue-400" />
                Explore more subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Want to see platform recommendations for other subjects? Check out options for different subject areas.
              </p>
              <Select
                value={subject}
                onValueChange={(value) => router.push(`/platform-recommendation?id=${parentId}&subject=${value}`)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="language arts">Language Arts</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 6. Help Section */}
      <div className="text-center mb-12">
        <h2 className="text-xl font-bold mb-4">Need more help deciding?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Our team is here to help you find the perfect learning platform for your child's unique needs.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Schedule a Consultation
        </Button>
      </div>
    </div>
  )
}
