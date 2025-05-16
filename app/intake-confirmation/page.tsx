"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  Sparkles,
  Brain,
  Clock3,
  MessageSquare,
  Book,
  Zap,
  DollarSign,
  Wrench,
  Compass,
  FolderOpen,
  Users,
  Award,
  Target,
  Eye,
  Shield,
  Music,
} from "lucide-react"

export default function IntakeConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const parentId = searchParams.get("id")
  const [loading, setLoading] = useState(true)
  const [parentData, setParentData] = useState<any>(null)
  const [intakeData, setIntakeData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("balanced")

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

        // Set the active tab based on structure preference
        if (intakeForm?.structure_preference === "structured") {
          setActiveTab("structured")
        } else if (intakeForm?.structure_preference === "flexible") {
          setActiveTab("flexible")
        } else {
          setActiveTab("balanced")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [parentId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Finalizing Your Personalized Plan...</h2>
          <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500">Just a moment while we put everything together!</p>
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
              To receive your personalized homeschooling plan, you need to complete the parent intake form.
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

  // Extract data from the intake form for display
  const learningPriorities = intakeData?.educational_goals || ["Critical thinking", "Independence"]
  const targetGpa = intakeData?.target_gpa || { hasPreference: false, value: 3.5 }
  const outcomeLevel = intakeData?.outcome_level || "proficient"
  const customOutcome = intakeData?.custom_outcome || ""

  const schedulePreferences = intakeData?.school_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const blockLength = intakeData?.block_length || 45
  const termStructure = intakeData?.term_structure || "school"
  const termLength = intakeData?.term_length || 9
  const termUnit = intakeData?.term_unit || "weeks"

  const mentorPersonality = intakeData?.mentor_personality || ["Calm", "Encouraging"]

  const courses = intakeData?.courses || [{ subject: "Math", gradeLevel: "5", hasPlatform: false, platform: "" }]
  const subjectFocus = courses
    .map((c: any) => ({
      subject: c.subject,
      hasPlatform: c.hasPlatform,
      platform: c.platform,
    }))
    .filter((s: any) => s.subject)

  const structurePreference = intakeData?.structure_preference || "balance"
  const learningStyle = intakeData?.educational_values || ["Self-paced", "Project-based"]

  const students = intakeData?.students || [
    {
      name: "Student",
      age: "10",
      gradeLevel: "5",
      learningCharacteristics: ["Visual learner"],
      iepDetails: "",
      otherCharacteristic: "",
    },
  ]

  const extracurriculars = intakeData?.extracurriculars || ["Sports", "Music"]

  const parentInvolvement = intakeData?.parent_involvement || "active"
  const oversightPreferences = intakeData?.oversight_preferences || ["Daily check-ins", "Weekly reviews"]

  const penaltyLevel = intakeData?.penalty_level || "moderate"

  const budget = {
    education: intakeData?.education_budget ? `$${intakeData.education_budget}` : "$1000/month",
    rewards: intakeData?.reward_budget ? `$${intakeData.reward_budget}` : "$100/month",
  }

  // Format the term structure for display
  const formatTermStructure = () => {
    if (termStructure === "school") {
      return "Traditional school year"
    } else if (termStructure === "year_round") {
      return "Year-round learning"
    } else if (termStructure === "custom") {
      return `Custom: ${termLength} ${termUnit}`
    }
    return "Traditional school year"
  }

  // Format the outcome level for display
  const formatOutcomeLevel = () => {
    if (outcomeLevel === "mastery") {
      return "Mastery (90%+)"
    } else if (outcomeLevel === "proficient") {
      return "Proficient (80-89%)"
    } else if (outcomeLevel === "passing") {
      return "Passing (70-79%)"
    } else if (outcomeLevel === "custom" && customOutcome) {
      return `Custom: ${customOutcome}`
    }
    return "Proficient (80-89%)"
  }

  // Format the structure preference for display
  const formatStructurePreference = () => {
    if (structurePreference === "structured") {
      return "Highly structured"
    } else if (structurePreference === "flexible") {
      return "Flexible & adaptable"
    } else {
      return "Balanced approach"
    }
  }

  // Format the parent involvement for display
  const formatParentInvolvement = () => {
    if (parentInvolvement === "active") {
      return "Active involvement"
    } else if (parentInvolvement === "moderate") {
      return "Moderate oversight"
    } else if (parentInvolvement === "minimal") {
      return "Minimal supervision"
    }
    return "Active involvement"
  }

  // Sample curriculum paths with updated descriptions
  const curriculumPaths = [
    {
      id: "balanced",
      name: "Balanced Approach",
      description: "A well-rounded option that gives families both structure and breathing room.",
      subjects: ["Math", "Science", "Language Arts", "History", "Art"],
      features: ["Daily structure", "Weekly flexibility", "Multimedia resources"],
      recommended: structurePreference === "balance",
      explanation:
        "Based on your responses, you value a solid academic foundation with room to adapt day-by-day. The Balanced Approach blends predictability and flexibility — perfect for families who want daily structure but also need space for creativity, outside activities, or changing energy levels. This track supports your child's independence while keeping progress on track across all core subjects.",
    },
    {
      id: "structured",
      name: "Structured Curriculum",
      description: "A traditional, high-accountability path with daily lesson plans and assessments.",
      subjects: ["Math", "Science", "Language Arts", "History", "Foreign Language"],
      features: ["Daily lesson plans", "Regular assessments", "Traditional approach"],
      recommended: structurePreference === "structured",
      explanation:
        "You indicated a preference for a more traditional, rigorous approach — and this track delivers just that. With daily lesson plans, built-in assessments, and clear expectations, the Structured Curriculum is ideal for families who thrive with routine, measurable progress, and clear academic milestones. It's a strong fit if you're aiming for college readiness, advanced placement, or early graduation.",
    },
    {
      id: "flexible",
      name: "Flexible & Interest-Led",
      description: "A creative, adaptable path designed around student passions and self-direction.",
      subjects: ["Math", "Science", "Language Arts", "Project-Based Learning"],
      features: ["Interest-led projects", "Core skill development", "Flexible scheduling"],
      recommended: structurePreference === "flexible",
      explanation:
        "You emphasized independence, curiosity, and the freedom to explore — this track was built for that. The Flexible & Interest-Led Curriculum empowers your child to take ownership of their learning journey while still hitting core subjects. With flexible scheduling and project-based learning, it's ideal for families who want education to feel inspiring, not prescribed. Perfect for natural learners, creative thinkers, and hands-on doers.",
    },
  ]

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* 1. Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block animate-bounce mb-4 text-4xl">🎉</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          You're All Set, {parentName}!
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          We've built a custom homeschooling experience based on your goals, preferences, and priorities.
        </p>
      </motion.div>

      {/* 2. Summary of What We Collected */}
      <motion.div className="mb-12" variants={containerVariants} initial="hidden" animate="show">
        <motion.h2 className="text-2xl font-bold mb-6 text-center" variants={itemVariants}>
          ✅ Here's What We Collected
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Learning Priorities Tile - UPDATED */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-300" />
                  <CardTitle className="text-lg text-purple-100">Learning Priorities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {learningPriorities.map((priority: string, index: number) => (
                    <Badge key={index} className="bg-purple-700 text-purple-100 hover:bg-purple-600">
                      {priority}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-purple-300" />
                    <span className="text-purple-100">
                      Target GPA: {targetGpa.hasPreference ? targetGpa.value : "No specific target"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-purple-300" />
                    <span className="text-purple-100">Expected Outcome: {formatOutcomeLevel()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Schedule Preferences Tile - UPDATED */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Clock3 className="mr-2 h-5 w-5 text-blue-300" />
                  <CardTitle className="text-lg text-blue-100">Schedule Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 mb-3">
                  {schedulePreferences.length} days per week
                  {intakeData?.start_time && intakeData?.end_time && (
                    <span>
                      {" "}
                      • {intakeData.start_time} to {intakeData.end_time}
                    </span>
                  )}
                </p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-300" />
                    <span className="text-blue-100">Term Structure: {formatTermStructure()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock3 className="h-4 w-4 mr-2 text-blue-300" />
                    <span className="text-blue-100">Learning Block: {blockLength} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* GPT Mentor Tone Tile */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-green-300" />
                  <CardTitle className="text-lg text-green-100">GPT Mentor Tone</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentorPersonality.map((trait: string, index: number) => (
                    <Badge key={index} className="bg-green-700 text-green-100 hover:bg-green-600">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subject Focus Tile - UPDATED */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-red-900 to-red-800 border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Book className="mr-2 h-5 w-5 text-red-300" />
                  <CardTitle className="text-lg text-red-100">Subject Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjectFocus.map((subject: any, index: number) => (
                    <div key={index} className="bg-red-800/50 p-2 rounded-md">
                      <div className="font-medium text-red-100">{subject.subject}</div>
                      {subject.hasPlatform ? (
                        <div className="text-sm text-red-200 mt-1">Platform: {subject.platform}</div>
                      ) : (
                        <div className="mt-2">
                          <Button
                            size="default"
                            className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 animate-pulse hover:animate-none"
                            onClick={() =>
                              router.push(`/platform-recommendation?id=${parentId}&subject=${subject.subject}`)
                            }
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Click here for your curated platform recommendations!
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Style Tile - UPDATED */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-amber-900 to-amber-800 border-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-amber-300" />
                  <CardTitle className="text-lg text-amber-100">Learning Style</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {learningStyle.map((style: string, index: number) => (
                    <Badge key={index} className="bg-amber-700 text-amber-100 hover:bg-amber-600">
                      {style}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 bg-amber-800/50 p-2 rounded-md">
                  <div className="flex items-center">
                    <Compass className="h-4 w-4 mr-2 text-amber-300" />
                    <span className="text-amber-100">Structure Preference: {formatStructurePreference()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Students Tile - UPDATED */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-teal-900 to-teal-800 border-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-teal-300" />
                  <CardTitle className="text-lg text-teal-100">Students</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map((student: any, index: number) => (
                    <div key={index} className="bg-teal-800/50 p-2 rounded-md">
                      <div className="font-medium text-teal-100">{student.name}</div>
                      <div className="text-sm text-teal-200 mt-1">
                        Age: {student.age} • Grade: {student.gradeLevel}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {student.learningCharacteristics?.map((characteristic: string, i: number) => (
                          <Badge key={i} className="bg-teal-700 text-teal-100 hover:bg-teal-600 text-xs">
                            {characteristic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Extracurriculars Tile - NEW */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 border-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Music className="mr-2 h-5 w-5 text-indigo-300" />
                  <CardTitle className="text-lg text-indigo-100">Extracurriculars</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {extracurriculars.map((activity: string, index: number) => (
                    <Badge key={index} className="bg-indigo-700 text-indigo-100 hover:bg-indigo-600">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Parent Oversight Tile - NEW */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-violet-900 to-violet-800 border-violet-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-violet-300" />
                  <CardTitle className="text-lg text-violet-100">Parent Oversight</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <Badge className="bg-violet-700 text-violet-100 hover:bg-violet-600">
                    {formatParentInvolvement()}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {oversightPreferences.map((preference: string, index: number) => (
                    <Badge key={index} className="bg-violet-700/70 text-violet-100 hover:bg-violet-600">
                      {preference}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accountability & Point Penalties Tile - NEW */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-rose-900 to-rose-800 border-rose-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-rose-300" />
                  <CardTitle className="text-lg text-rose-100">Accountability Level</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-rose-800/50 p-3 rounded-md">
                  <p className="text-rose-100">When your child misses expectations, the system will be:</p>
                  <Badge className="mt-2 bg-rose-700 text-rose-100 hover:bg-rose-600">
                    {penaltyLevel.charAt(0).toUpperCase() + penaltyLevel.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget & Financial Goals Tile - UPDATED */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-pink-900 to-pink-800 border-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-pink-300" />
                  <CardTitle className="text-lg text-pink-100">Budget & Financial Goals</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-pink-300" />
                    <span className="text-pink-100">Education: {budget.education}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-pink-300" />
                    <span className="text-pink-100">Rewards: {budget.rewards}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* 3. How We Used Your Info */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 border-indigo-700 shadow-lg">
          <CardHeader>
            <div className="flex items-center">
              <Wrench className="mr-2 h-6 w-6 text-indigo-300" />
              <CardTitle className="text-xl text-indigo-100">🛠️ How We Used Your Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-100 leading-relaxed">
              We analyzed your responses and generated personalized curriculum tracks, study schedules, mentorship
              settings, and recommendation lists to help you homeschool with confidence. All of these settings are
              visible and fully editable in your dashboard, so you can fine-tune your experience at any time.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4. Curriculum Track Recommendation */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-center mb-6">
          <Compass className="mr-2 h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-center">🧭 Your Curriculum Track</h2>
        </div>

        <Tabs defaultValue={activeTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="balanced">Balanced Approach</TabsTrigger>
            <TabsTrigger value="structured">Structured Curriculum</TabsTrigger>
            <TabsTrigger value="flexible">Flexible Learning</TabsTrigger>
          </TabsList>

          {curriculumPaths.map((path) => (
            <TabsContent key={path.id} value={path.id} className="mt-0">
              <Card className="border-purple-800 bg-gray-900">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">{path.name}</CardTitle>
                    {path.recommended && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Recommended for You</Badge>
                    )}
                  </div>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Core Subjects</h3>
                      <ul className="space-y-2">
                        {path.subjects.map((subject, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            {subject}
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-lg font-semibold mt-6 mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {path.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Why This Track?</h3>
                      <p className="text-gray-300">{path.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* 5. Resource Downloads */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-center mb-6">
          <FolderOpen className="mr-2 h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-center">📂 Resource Downloads</h2>
        </div>

        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="bg-blue-800 border-blue-600 text-blue-100 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" /> Curriculum Guide (PDF)
              </Button>
              <Button variant="outline" className="bg-blue-800 border-blue-600 text-blue-100 hover:bg-blue-700">
                <Calendar className="mr-2 h-4 w-4" /> Sample Weekly Schedule (PDF)
              </Button>
              <Button variant="outline" className="bg-blue-800 border-blue-600 text-blue-100 hover:bg-blue-700">
                <BookOpen className="mr-2 h-4 w-4" /> Resource List (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 6. Final Call to Action */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="inline-block mb-4 text-4xl">🚀</div>
        <h2 className="text-3xl font-bold mb-4">You're ready to get started!</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Your personalized homeschooling plan is ready. Access your dashboard to begin your journey!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/parent/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto"
            >
              Go to My Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/parent-intake">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
            >
              Edit Intake Form
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
