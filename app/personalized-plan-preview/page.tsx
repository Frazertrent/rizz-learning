"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Lightbulb,
  Shield,
  Star,
  Menu,
  X,
  Zap,
  Calendar,
  BookOpen,
  Compass,
  Target,
  Smile,
  Users,
  LogIn,
  UserPlus,
  Brain,
  Clock,
  Upload,
  Trophy,
  BarChart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function PersonalizedPlanPreviewPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mock data that would come from the onboarding quiz
  const quizResults = {
    teachingStyle: "Structure Seeker",
    priorities: [
      { name: "Consistency", value: 85 },
      { name: "Mastery", value: 70 },
      { name: "Flexibility", value: 60 },
      { name: "Creativity", value: 45 },
    ],
    topPriority: "consistency",
    childLearningStyle: "Visual & Hands-on",
    parentInvolvement: "Medium",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#141416] text-white">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Homeschool Dashboard
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/tour"
              className="px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Tour
            </Link>
            <Link
              href="/how-it-works"
              className="px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            >
              How It Works
            </Link>
            <Link
              href="/membership"
              className="px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Plans & Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-300 hover:text-white">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-600"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-gray-800 py-4">
            <div className="container space-y-2">
              <Link
                href="/tour"
                className="block px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Tour
              </Link>
              <Link
                href="/how-it-works"
                className="block px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                How It Works
              </Link>
              <Link
                href="/membership"
                className="block px-3 py-2 text-sm rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Plans & Pricing
              </Link>
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-600"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Header Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/20"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge className="mb-2 bg-purple-900/30 text-purple-400 border-purple-700 hover:bg-purple-900/50">
                Your Results
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                Your Personalized Homeschool Plan
              </h1>
              <p className="text-xl text-gray-300 max-w-xl">Built around your priorities, goals, and teaching style.</p>

              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-800/50 mt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-900/50 rounded-full">
                    <Compass className="h-6 w-6 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{quizResults.teachingStyle}</h3>
                </div>
                <p className="text-gray-300">
                  You prefer a structured approach with clear goals and consistent routines.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-6">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 max-w-md flex items-start">
                <div className="p-1.5 bg-green-800/50 rounded-full mr-3 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <h4 className="font-medium text-green-300 mb-1">You're off to a great start!</h4>
                  <p className="text-sm text-green-400/80">
                    We've analyzed your answers and created a personalized plan that matches your teaching style and
                    goals.
                  </p>
                </div>
              </div>

              <Link href="/signup" className="w-full md:w-auto">
                <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6 py-5 text-lg font-medium hover:scale-105 transition-transform hover:shadow-glow-purple">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Your Teaching Priorities */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-900/30 text-blue-400 border-blue-700 hover:bg-blue-900/50">
              Your Profile
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Teaching Priorities</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {quizResults.priorities.map((priority, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-200">{priority.name}</span>
                      <span className="text-sm text-gray-400">{priority.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          index === 0
                            ? "bg-gradient-to-r from-purple-600 to-pink-600"
                            : index === 1
                              ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                              : index === 2
                                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                                : "bg-gradient-to-r from-amber-600 to-orange-600",
                        )}
                        style={{ width: `${priority.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all hover:-translate-y-1 cursor-pointer">
                  <BookOpen className="h-6 w-6 text-blue-400 mb-2" />
                  <span className="text-sm text-gray-300">{quizResults.childLearningStyle}</span>
                  <span className="text-xs text-gray-500">Learning Style</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-600 transition-all hover:-translate-y-1 cursor-pointer">
                  <Users className="h-6 w-6 text-green-400 mb-2" />
                  <span className="text-sm text-gray-300">{quizResults.parentInvolvement}</span>
                  <span className="text-xs text-gray-500">Parent Involvement</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 relative">
              <div className="absolute -top-3 -left-3">
                <div className="p-1.5 bg-purple-600 rounded-full">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="pl-2">
                <h3 className="text-xl font-bold mb-4 text-white">Our Analysis</h3>
                <div className="text-gray-300 italic border-l-4 border-purple-600 pl-4 py-1">
                  "You told us {quizResults.topPriority} matters most. We've built that into your plan with daily
                  check-ins and clear routines."
                </div>
                <p className="mt-4 text-gray-400">
                  Your profile shows you value structure with some flexibility. You want to maintain high standards
                  while adapting to your child's learning pace and interests.
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Perfect match for our platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Here's What We Recommend */}
      <section className="py-16 bg-[#0c0c14]">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/50">
              Recommendations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Here's What We Recommend</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Based on your answers, we've selected these key features to help you achieve your homeschooling goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Automated Feedback & Check-Ins</h3>
                <p className="text-gray-400 text-sm">
                  We'll help your child build independence while you stay in control.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-300">Daily progress tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Parent Control Panel</h3>
                <p className="text-gray-400 text-sm">
                  Define expectations, approve work, enforce standards. Without the burnout.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-300">Customizable rules & thresholds</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Motivation Tools</h3>
                <p className="text-gray-400 text-sm">XP, coins, streaks, and rewards that actually work.</p>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-300">Personalized reward system</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Customizable Curriculum Planner</h3>
                <p className="text-gray-400 text-sm">
                  Easily map out subjects, electives, and pacing—built around your schedule.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-300">Flexible scheduling tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-900/20 text-purple-300 px-4 py-2 rounded-full border border-purple-800/50">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">These features are tailored to your teaching style</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Platform Fit Summary */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-900/30 text-amber-400 border-amber-700 hover:bg-amber-900/50">
              Perfect Match
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why This Platform Is a Good Match</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
              <p className="text-gray-300 text-lg mb-8">
                Based on your answers, you'll benefit most from a tool that balances structure with flexibility, gives
                your child freedom with accountability, and lets you oversee everything without micromanaging.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-green-600 transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-green-900/50 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <h4 className="font-medium text-white">Supports all learners</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Adapts to both fast and slow learning paces across different subjects.
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-green-600 transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-green-900/50 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <h4 className="font-medium text-white">Oversight without prep</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Gives you visibility and control without requiring daily lesson planning.
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-green-600 transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-1.5 bg-green-900/50 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <h4 className="font-medium text-white">Built-in motivation</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Helps your child stay motivated and on track with engaging rewards.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-900/50 rounded-full mt-0.5">
                    <Lightbulb className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-300 mb-1">Did you know?</h4>
                    <p className="text-sm text-blue-400/80">
                      Parents who use our platform report 68% less stress and 42% more completed assignments compared to
                      their previous homeschool methods.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Your Year at a Glance */}
      <section className="py-16 bg-[#0c0c14]">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-900/30 text-blue-400 border-blue-700 hover:bg-blue-900/50">Timeline</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">🎒 Your Year at a Glance</h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              See how the platform supports you week to week—from daily check-ins to long-term planning.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse"></div>
              <div className="p-8 bg-gray-800/70 backdrop-blur-sm">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-3">
                      <Clock className="h-6 w-6 text-purple-400" />
                    </div>
                    <h4 className="font-medium text-white mb-1">Weekly Check-ins</h4>
                    <p className="text-xs text-gray-400">Progress tracking and goal adjustments</p>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-3">
                      <BarChart className="h-6 w-6 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white mb-1">Monthly Reflections</h4>
                    <p className="text-xs text-gray-400">Review progress and celebrate wins</p>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-green-500 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-green-400" />
                    </div>
                    <h4 className="font-medium text-white mb-1">Reimbursement Uploads</h4>
                    <p className="text-xs text-gray-400">Organize receipts and forms</p>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-amber-500 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center mb-3">
                      <Trophy className="h-6 w-6 text-amber-400" />
                    </div>
                    <h4 className="font-medium text-white mb-1">XP Milestones</h4>
                    <p className="text-xs text-gray-400">Unlock rewards and achievements</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-300 mb-4">
                    Future animation showing your personalized timeline will appear here
                  </p>
                  <div className="inline-flex items-center gap-2 bg-purple-900/20 text-purple-300 px-4 py-2 rounded-full border border-purple-800/50">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">Customized to your teaching schedule</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: What You'll Unlock */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/50">
              Getting Started
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">📦 What You'll Unlock Right Away</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              These tools will be available immediately after you create your free account.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Guided Onboarding Path</h3>
              <p className="text-gray-400 text-sm">Step-by-step setup that matches your teaching style and goals.</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Calendar className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Daily Routine Builder</h3>
              <p className="text-gray-400 text-sm">Create consistent schedules that work for your family's rhythm.</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <Upload className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Upload Tool</h3>
              <p className="text-gray-400 text-sm">Easily submit work, projects, and track completed assignments.</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                <Trophy className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Rewards Dashboard</h3>
              <p className="text-gray-400 text-sm">Track XP, streaks, and unlock motivating achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Ready to Begin */}
      <section className="py-20 bg-gradient-to-b from-[#0c0c14] to-[#1a1a1a] relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-pink-900/30 animate-gradient-x"></div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-900/30 text-purple-400 border-purple-700 hover:bg-purple-900/50">
              Next Steps
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Save This Plan & Start Building Your Dashboard</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We'll walk you through a few quick steps to finalize your child's schedule, define expectations, and
              unlock the platform.
            </p>

            <div className="flex flex-col items-center">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-medium hover:scale-105 transition-transform hover:shadow-glow-purple">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <p className="mt-3 text-sm text-gray-400">No commitment. Explore the platform and cancel anytime.</p>

              <div className="mt-6 text-sm text-gray-400">
                Not ready? You can also
                <Link href="/tour" className="text-purple-400 hover:text-purple-300 mx-1">
                  preview the full tour
                </Link>
                or
                <Link href="/how-it-works" className="text-purple-400 hover:text-purple-300 mx-1">
                  read how it works
                </Link>
                .
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2 border border-gray-700">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-xs text-gray-400">Define Goals</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2 border border-gray-700">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-xs text-gray-400">Set Schedule</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2 border border-gray-700">
                  <Smile className="h-6 w-6 text-green-400" />
                </div>
                <span className="text-xs text-gray-400">Start Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-12 bg-[#0a0a0a] border-t border-gray-800">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-md mx-auto">
            <div>
              <h4 className="font-medium mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/tour" className="hover:text-purple-400 transition-colors">
                    Tour
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="hover:text-purple-400 transition-colors">
                    Plans & Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-purple-400 transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center mb-2">
              <GraduationCap className="w-5 h-5 text-purple-400 mr-2" />
              <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Homeschool Dashboard
              </span>
            </div>
            <p>&copy; {new Date().getFullYear()} Homeschool Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
