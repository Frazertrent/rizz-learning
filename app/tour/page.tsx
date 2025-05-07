"use client"

import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Sparkles,
  BarChart,
  Lightbulb,
  Shield,
  Star,
  Gift,
  Clipboard,
  Layers,
  Settings,
  PlusCircle,
  Upload,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PublicNav } from "@/components/public-nav"

export default function TourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#141416] text-white">
      {/* Public Navigation */}
      <PublicNav />

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="container text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
            Your Homeschool Command Center
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            See how you'll define expectations, monitor performance, and stay in control—without doing it all yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/onboarding">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-medium hover:scale-105 transition-transform hover:shadow-glow-purple">
                Find My Fit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo-selection">
              <Button
                variant="outline"
                className="bg-black text-white border-white hover:bg-white hover:text-black rounded-full px-8 py-6 text-lg font-medium transition-colors"
              >
                Try a Live Demo
              </Button>
            </Link>
          </div>
          <div className="mt-8 animate-bounce text-gray-400">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-1">Scroll to explore</span>
              <ChevronDown className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Research */}
      <section id="research" className="py-20 bg-[#0a0a0a]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4 bg-purple-900/30 text-purple-400 border-purple-700 hover:bg-purple-900/50">
                Intelligent Planning
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                We Replace Hours of Research with Intelligent Clarity
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Turn uncertainty into a personalized education strategy — in minutes.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our dynamic intake tool helps you define your family's educational vision, considering your goals,
                values, budget, and each child's learning style. No more endless research or decision fatigue.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Just answer a few questions, and we'll recommend the perfect mix of resources tailored to your family's
                unique needs.
              </p>
            </div>

            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-white">Educational Vision Wizard</h3>
                    <Badge className="bg-purple-900/30 text-purple-400 border-purple-700">Step 1 of 3</Badge>
                  </div>

                  <h4 className="font-medium mb-3 text-gray-200">What are your family's educational goals?</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "College Preparation", selected: true },
                      { label: "Character Development", selected: true },
                      { label: "Practical Life Skills", selected: false },
                      { label: "Religious Foundation", selected: true },
                      { label: "Creative Expression", selected: false },
                      { label: "Critical Thinking", selected: true },
                    ].map((goal, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${goal.selected ? "bg-purple-900/20 border-purple-700" : "border-gray-700 bg-gray-800/50"} cursor-pointer hover:border-purple-600 transition-colors`}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={goal.selected}
                            id={`goal-${i}`}
                            className="mr-2 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label htmlFor={`goal-${i}`} className="text-gray-200">
                            {goal.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-200">Preferred learning style?</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Visual", icon: "👁️", selected: true },
                      { label: "Auditory", icon: "👂", selected: false },
                      { label: "Kinesthetic", icon: "👐", selected: true },
                    ].map((style, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border text-center ${style.selected ? "bg-purple-900/20 border-purple-700" : "border-gray-700 bg-gray-800/50"} cursor-pointer hover:border-purple-600 transition-colors`}
                      >
                        <div className="text-2xl mb-1">{style.icon}</div>
                        <div className="text-sm font-medium text-gray-200">{style.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative p-4 bg-blue-900/20 rounded-lg border border-blue-800 mb-4">
                  <div className="absolute -top-3 -right-3">
                    <div className="p-1 bg-yellow-500 rounded-full animate-pulse">
                      <Lightbulb className="h-5 w-5 text-yellow-900" />
                    </div>
                  </div>
                  <h4 className="font-medium mb-2 flex items-center text-blue-300">
                    <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
                    Your Personalized Recommendation
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">Based on your goals and preferences, we recommend:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-gray-800 text-gray-200 border-gray-700">SEU Ignite</Badge>
                    <Badge className="bg-gray-800 text-gray-200 border-gray-700">Khan Academy</Badge>
                    <Badge className="bg-gray-800 text-gray-200 border-gray-700">Classical Conversations</Badge>
                    <Badge className="bg-gray-800 text-gray-200 border-gray-700">Brave Writer</Badge>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    View Full Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2: Command Center */}
      <section id="command" className="py-20 bg-[#0c0c14]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm order-2 md:order-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-white">Parent Dashboard</h3>
                  <Badge className="bg-green-900/30 text-green-400 border-green-800">Live</Badge>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-200">Your Students</h4>
                  <div className="flex gap-3 mb-4">
                    {[
                      { name: "Tyson", avatar: "T", status: "On Track" },
                      { name: "Emma", avatar: "E", status: "Needs Review" },
                    ].map((student, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2 border-2 border-purple-700 bg-purple-900/30">
                          <AvatarFallback className="bg-purple-900/50 text-purple-200">{student.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-200">{student.name}</span>
                        <Badge
                          className={`mt-1 ${student.status === "On Track" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-yellow-900/30 text-yellow-400 border-yellow-800"}`}
                        >
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-2 hover:border-purple-600 transition-colors cursor-pointer">
                        <PlusCircle className="h-6 w-6 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Add Student</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-200">Today's Schedule</h4>
                    <Badge variant="outline" className="border-gray-700 text-gray-300">
                      Monday
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        time: "8:30 AM",
                        subject: "Morning Meeting",
                        color: "bg-blue-900/20 border-blue-800 text-blue-300",
                      },
                      {
                        time: "9:00 AM",
                        subject: "Mathematics",
                        color: "bg-green-900/20 border-green-800 text-green-300",
                      },
                      {
                        time: "10:30 AM",
                        subject: "Language Arts",
                        color: "bg-purple-900/20 border-purple-800 text-purple-300",
                      },
                      {
                        time: "1:00 PM",
                        subject: "Science",
                        color: "bg-yellow-900/20 border-yellow-800 text-yellow-300",
                      },
                    ].map((block, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${block.color} flex justify-between hover:bg-opacity-30 transition-colors`}
                      >
                        <div className="font-medium">{block.subject}</div>
                        <div className="text-sm">{block.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="p-3 rounded-lg bg-green-900/20 border border-green-800 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <div>
                      <span className="font-medium text-gray-200">Check-In Status: Tyson</span>
                      <span className="ml-2 text-green-400">On Time ✅</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Routine
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Weekly Summary
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <Badge className="mb-4 bg-blue-900/30 text-blue-400 border-blue-700 hover:bg-blue-900/50">
                Parent Control
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                One Dashboard. Total Control.
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                See everything. Customize anything. Without the chaos.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our parent command center gives you a bird's-eye view of your entire homeschool operation. Manage
                multiple students, customize routines, and track progress—all from one clean interface.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                No more juggling spreadsheets, apps, and paper planners. Everything you need is right here, organized
                and accessible.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Set your expectations once, and let the system handle the daily enforcement and tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Student Autonomy */}
      <section id="autonomy" className="py-20 bg-[#0a0a0a]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4 bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/50">
                Student Growth
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                Build Confidence. Teach Responsibility.
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Students check in, complete work, reflect — all tracked and visible to you.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our student interface is designed to foster independence while maintaining accountability. Students
                learn to manage their time, track their own progress, and develop self-reflection skills.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                They'll check in to subjects, complete assignments, and reflect on their learning—all while you maintain
                visibility and oversight.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The result? Students who take ownership of their education and develop the executive functioning skills
                they'll need for life.
              </p>
            </div>

            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 border border-blue-700 bg-blue-900/30">
                      <AvatarFallback className="bg-blue-900/50 text-blue-200">T</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg text-white">Tyson's Dashboard</h3>
                  </div>
                  <Badge className="bg-blue-900/30 text-blue-400 border-blue-700">Student View</Badge>
                </div>

                <div className="mb-6">
                  <Card className="border-2 border-blue-700 bg-blue-900/20 p-4 mb-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-300">Language Arts</h4>
                      <Badge className="bg-blue-900/40 text-blue-300 border-blue-700">Current</Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white">
                        Check In
                      </Button>
                      <div className="text-sm text-blue-300">
                        <Clock className="h-4 w-4 inline mr-1" />
                        <span>Not started</span>
                      </div>
                    </div>
                    <div className="text-sm text-blue-300">
                      Today: Complete reading assignment and vocabulary worksheet
                    </div>
                  </Card>

                  <Card className="border border-gray-700 bg-gray-800/50 p-4 mb-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-200">Active Session</h4>
                      <div className="text-sm font-medium text-gray-300">
                        <Clock className="h-4 w-4 inline mr-1" />
                        <span>32:45</span>
                      </div>
                    </div>
                    <Progress value={65} className="h-2 mb-4 bg-gray-700">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                    </Progress>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2 text-gray-300">Before checking out:</h5>
                      <Textarea
                        placeholder="Write your summary of what you learned today..."
                        defaultValue=""
                        className="w-full h-20 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-purple-600 focus:ring-purple-600"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Complete & Check Out
                    </Button>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-200">Rewards Progress</h4>
                    <Badge variant="outline" className="gap-1 border-yellow-700 text-yellow-400">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span>Level 3</span>
                    </Badge>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>XP Progress</span>
                      <span>175/250 XP</span>
                    </div>
                    <Progress value={70} className="h-2 bg-gray-700">
                      <div className="h-full bg-gradient-to-r from-yellow-600 to-orange-500 rounded-full" />
                    </Progress>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Math Streak", days: 4 },
                      { name: "Reading", days: 7 },
                      { name: "Journaling", days: 2 },
                    ].map((streak, i) => (
                      <div key={i} className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-2 text-center">
                        <div className="text-xs text-yellow-400 font-medium">{streak.name}</div>
                        <div className="flex items-center justify-center gap-1 text-yellow-300">
                          <span className="text-sm font-bold">{streak.days}</span>
                          <span className="text-xs">day streak</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 4: Curriculum Planning */}
      <section id="curriculum" className="py-20 bg-[#0c0c14]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm order-2 md:order-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-white">Curriculum Planner</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-900/30 text-purple-400 border-purple-700">Week 3</Badge>
                    <Badge variant="outline" className="border-gray-700 text-gray-300">
                      Term 1
                    </Badge>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-5 gap-1 mb-2 text-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                      <div key={day} className="text-sm font-medium py-1 text-gray-300">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        time: "9:00 AM",
                        blocks: [
                          {
                            day: 0,
                            subject: "Biology",
                            source: "SEATS",
                            color: "bg-green-900/20 border-green-800 text-green-300",
                          },
                          {
                            day: 1,
                            subject: "Biology",
                            source: "SEATS",
                            color: "bg-green-900/20 border-green-800 text-green-300",
                          },
                          {
                            day: 2,
                            subject: "PE",
                            source: "RHS",
                            color: "bg-blue-900/20 border-blue-800 text-blue-300",
                          },
                          {
                            day: 3,
                            subject: "Biology",
                            source: "SEATS",
                            color: "bg-green-900/20 border-green-800 text-green-300",
                          },
                          {
                            day: 4,
                            subject: "Biology",
                            source: "SEATS",
                            color: "bg-green-900/20 border-green-800 text-green-300",
                          },
                        ],
                      },
                      {
                        time: "10:30 AM",
                        blocks: [
                          {
                            day: 0,
                            subject: "Math",
                            source: "Khan",
                            color: "bg-purple-900/20 border-purple-800 text-purple-300",
                          },
                          {
                            day: 1,
                            subject: "Math",
                            source: "Khan",
                            color: "bg-purple-900/20 border-purple-800 text-purple-300",
                          },
                          {
                            day: 2,
                            subject: "Math",
                            source: "Khan",
                            color: "bg-purple-900/20 border-purple-800 text-purple-300",
                          },
                          {
                            day: 3,
                            subject: "Math",
                            source: "Khan",
                            color: "bg-purple-900/20 border-purple-800 text-purple-300",
                          },
                          {
                            day: 4,
                            subject: "Math",
                            source: "Khan",
                            color: "bg-purple-900/20 border-purple-800 text-purple-300",
                          },
                        ],
                      },
                      {
                        time: "1:00 PM",
                        blocks: [
                          {
                            day: 0,
                            subject: "Scripture",
                            source: "Home",
                            color: "bg-yellow-900/20 border-yellow-800 text-yellow-300",
                          },
                          {
                            day: 1,
                            subject: "Co-op",
                            source: "Group",
                            color: "bg-red-900/20 border-red-800 text-red-300",
                          },
                          {
                            day: 2,
                            subject: "Scripture",
                            source: "Home",
                            color: "bg-yellow-900/20 border-yellow-800 text-yellow-300",
                          },
                          {
                            day: 3,
                            subject: "Co-op",
                            source: "Group",
                            color: "bg-red-900/20 border-red-800 text-red-300",
                          },
                          {
                            day: 4,
                            subject: "Scripture",
                            source: "Home",
                            color: "bg-yellow-900/20 border-yellow-800 text-yellow-300",
                          },
                        ],
                      },
                    ].map((row, i) => (
                      <div key={i} className="flex">
                        <div className="w-20 text-sm py-2 pr-2 text-gray-400">{row.time}</div>
                        <div className="flex-1 grid grid-cols-5 gap-1">
                          {row.blocks.map((block, j) => (
                            <div
                              key={j}
                              className={`p-2 rounded-lg border ${block.color} text-center text-xs hover:bg-opacity-30 transition-colors cursor-pointer`}
                            >
                              <div className="font-medium">{block.subject}</div>
                              <div className="text-xs opacity-80">{block.source}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Platform
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Assign Project
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <Badge className="mb-4 bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/50">
                Curriculum
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                Bring It All Together — Seamlessly.
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Coordinate everything from SEATS and Khan to piano lessons and co-ops.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our curriculum planner brings together all your educational resources in one place. Whether you're using
                online platforms, textbooks, co-ops, or creating your own materials, everything is organized and
                accessible.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Drag and drop activities to create the perfect schedule, assign supplemental projects, and track
                progress across all platforms.
              </p>
              <p className="text-gray-300 leading-relaxed">
                No more jumping between different systems or losing track of what's happening where. It's all here,
                working together seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Paperwork */}
      <section id="paperwork" className="py-20 bg-[#0a0a0a]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4 bg-blue-900/30 text-blue-400 border-blue-700 hover:bg-blue-900/50">
                Administration
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                Reimbursements, Scholarships, Transcripts — Done.
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                We automate the admin, so you can focus on learning.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our system handles all the paperwork that comes with homeschooling. From tracking expenses for
                reimbursement to generating professional transcripts, we've got you covered.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Apply for scholarships and grants with pre-filled forms, store important documents in our secure vault,
                and generate reports with a single click.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Say goodbye to the administrative burden of homeschooling and hello to more time for what
                matters—teaching and learning.
              </p>
            </div>

            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-white">Financial & Records</h3>
                  <Badge className="bg-green-900/30 text-green-400 border-green-800">Updated</Badge>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-200">Available Reimbursements</h4>
                  <div className="space-y-2">
                    {[
                      { item: "Science Curriculum", cost: "$129.99", eligible: true },
                      { item: "Math Workbooks", cost: "$45.50", eligible: true },
                      { item: "Art Supplies", cost: "$78.25", eligible: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                        <Checkbox
                          id={`item-${i}`}
                          checked={item.eligible}
                          className="mr-3 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <div className="flex-1">
                          <Label htmlFor={`item-${i}`} className="font-medium text-gray-200">
                            {item.item}
                          </Label>
                          <div className="text-sm text-gray-400">{item.cost}</div>
                        </div>
                        <Badge
                          className={
                            item.eligible
                              ? "bg-green-900/30 text-green-400 border-green-800"
                              : "bg-gray-800 text-gray-400 border-gray-700"
                          }
                        >
                          {item.eligible ? "Eligible" : "Check Eligibility"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-200">Reimbursement Application</h4>
                  <Card className="border border-gray-700 bg-gray-800/50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="student-name" className="text-sm text-gray-300">
                          Student Name
                        </Label>
                        <Input
                          id="student-name"
                          defaultValue="Tyson Miller"
                          className="mt-1 bg-gray-800 border-gray-700 text-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course" className="text-sm text-gray-300">
                          Course/Subject
                        </Label>
                        <Input
                          id="course"
                          defaultValue="Science Curriculum"
                          className="mt-1 bg-gray-800 border-gray-700 text-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cost" className="text-sm text-gray-300">
                          Cost
                        </Label>
                        <Input
                          id="cost"
                          defaultValue="$129.99"
                          className="mt-1 bg-gray-800 border-gray-700 text-gray-200 focus:border-purple-600 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="receipt" className="text-sm text-gray-300">
                          Upload Receipt
                        </Label>
                        <div className="mt-1 border border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-purple-600 transition-colors cursor-pointer">
                          <Upload className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                          <div className="text-sm text-gray-400">Drag & drop or click to upload</div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Submit Application
                    </Button>
                  </Card>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-gray-200">Document Vault</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "Transcript_2023.pdf", date: "Mar 15, 2023" },
                      { name: "Attendance_Record.pdf", date: "Apr 2, 2023" },
                      { name: "Course_Catalog.pdf", date: "Jan 10, 2023" },
                      { name: "Progress_Report_Q1.pdf", date: "Nov 5, 2023" },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-purple-600 transition-colors cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="flex-1 overflow-hidden">
                          <div className="text-sm font-medium truncate text-gray-200">{doc.name}</div>
                          <div className="text-xs text-gray-500">{doc.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 6: Rules */}
      <section id="rules" className="py-20 bg-[#0c0c14]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm order-2 md:order-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-white">Parent Controls</h3>
                  <Badge className="bg-purple-900/30 text-purple-400 border-purple-700">Customizable</Badge>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-200">Mentor Tone Settings</h4>
                  <div className="p-4 border border-gray-700 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-300">Mentor Tone</div>
                      <div className="flex items-center gap-2">
                        {["Calm Tutor", "Strict Instructor", "Fun Coach"].map((tone, i) => (
                          <Badge
                            key={i}
                            className={
                              i === 0
                                ? "bg-blue-900/30 text-blue-400 border-blue-700"
                                : "bg-gray-800 text-gray-400 border-gray-700"
                            }
                          >
                            {tone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="encouragement" className="text-sm text-gray-300">
                          Encouragement Level
                        </Label>
                        <div className="w-1/2">
                          <Input id="encouragement" type="range" defaultValue={70} className="accent-purple-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="correction" className="text-sm text-gray-300">
                          Correction Style
                        </Label>
                        <div className="w-1/2">
                          <Input id="correction" type="range" defaultValue={50} className="accent-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-200">Academic Rules</h4>
                  <div className="space-y-2">
                    {[
                      { rule: "Require 80% quiz score to unlock next subject", enabled: true },
                      { rule: "Daily reading minimum: 30 minutes", enabled: true },
                      { rule: "Weekly writing assignment required", enabled: false },
                    ].map((rule, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/50"
                      >
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-purple-400 mr-2" />
                          <span className="text-sm text-gray-200">{rule.rule}</span>
                        </div>
                        <Switch
                          checked={rule.enabled}
                          className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-gray-200">Recent Alerts</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border border-yellow-800 bg-yellow-900/20 flex items-start">
                      <div className="p-1 bg-yellow-800 rounded-full mr-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-300" />
                      </div>
                      <div className="text-sm text-yellow-300">
                        <span className="font-medium">Tyson missed his History check-in</span>
                        <div className="text-xs mt-1 text-yellow-400/70">Today at 10:15 AM</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-green-800 bg-green-900/20 flex items-start">
                      <div className="p-1 bg-green-800 rounded-full mr-2">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                      </div>
                      <div className="text-sm text-green-300">
                        <span className="font-medium">Emma completed all assignments for today</span>
                        <div className="text-xs mt-1 text-green-400/70">Today at 2:30 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <Badge className="mb-4 bg-purple-900/30 text-purple-400 border-purple-700 hover:bg-purple-900/50">
                Oversight
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                Parent-Powered Oversight
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">You set the rules. We enforce them.</p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our system puts you in control of your children's education. You choose the tone, the thresholds, and
                the limits—and we back you up with consistent enforcement.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Set academic requirements, customize mentor feedback styles, and receive alerts when something needs
                your attention.
              </p>
              <p className="text-gray-300 leading-relaxed">
                No more repeating yourself or constantly checking in. The system handles the day-to-day enforcement,
                freeing you to focus on the big picture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Motivation */}
      <section id="motivation" className="py-20 bg-[#0a0a0a]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4 bg-yellow-900/30 text-yellow-400 border-yellow-700 hover:bg-yellow-900/50">
                Motivation
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                Reward Progress. Celebrate Wins.
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Streaks, points, and goals keep students moving without constant reminders.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our motivation engine transforms daily tasks into momentum-building achievements. Students earn points,
                maintain streaks, and unlock rewards—all customized by you.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                They'll stay motivated and engaged, even when you're not there to remind them. And you'll have the peace
                of mind knowing they're making progress.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Plus, our reflection prompts help students develop metacognition and self-awareness, turning every
                assignment into an opportunity for growth.
              </p>
            </div>

            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 border border-blue-700 bg-blue-900/30">
                      <AvatarFallback className="bg-blue-900/50 text-blue-200">T</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg text-white">Tyson's Rewards</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium text-yellow-400">350 points</span>
                  </div>
                </div>

                <div className="mb-6">
                  <Card className="border-2 border-yellow-700 bg-yellow-900/20 p-4 mb-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5 text-yellow-400" />
                      <h4 className="font-medium text-yellow-300">3-Day Streak — +50 pts</h4>
                    </div>
                    <p className="text-sm text-yellow-400/80 mb-3">
                      You've completed your Math assignments 3 days in a row!
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-yellow-300">Keep it going!</span>
                      <Badge className="bg-yellow-800/50 text-yellow-300 border-yellow-700">Claimed</Badge>
                    </div>
                  </Card>

                  <Card className="border border-purple-700 bg-purple-900/20 p-4 mb-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-purple-300">Reward: Movie Night 🎬</h4>
                      <Badge className="bg-purple-800/50 text-purple-300 border-purple-700">500 pts</Badge>
                    </div>
                    <Progress value={70} className="h-2 mb-3 bg-gray-700">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                    </Progress>
                    <p className="text-sm text-purple-400/80">350/500 points earned. Keep going!</p>
                  </Card>
                </div>

                <div className="mb-6">
                  <Button className="w-full mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white">
                    <Gift className="h-4 w-4 mr-2" />
                    Spend Points
                  </Button>
                </div>

                <div>
                  <Card className="border border-blue-700 bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Clipboard className="h-5 w-5 text-blue-400" />
                      <h4 className="font-medium text-blue-300">Reflection Prompt</h4>
                    </div>
                    <p className="text-sm text-blue-400/80 mb-3">What could you do better tomorrow?</p>
                    <Textarea
                      placeholder="Write your reflection here..."
                      defaultValue=""
                      className="w-full h-20 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600 mb-3"
                    />
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white w-full"
                    >
                      Submit Reflection
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 8: Onboarding */}
      <section id="onboarding" className="py-20 bg-[#0c0c14]">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="overflow-hidden rounded-xl border-0 bg-gray-900/50 shadow-xl shadow-purple-900/10 backdrop-blur-sm order-2 md:order-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-white">Getting Started</h3>
                  <Badge className="bg-green-900/30 text-green-400 border-green-800">Easy Setup</Badge>
                </div>

                <div className="mb-6">
                  <Card className="border border-blue-700 bg-blue-900/20 p-4 mb-4 rounded-lg">
                    <h4 className="font-medium text-blue-300 mb-3">Tell us what you want out of homeschooling</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="goal-1"
                          checked
                          className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <Label htmlFor="goal-1" className="text-gray-200">
                          Academic excellence
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="goal-2"
                          checked
                          className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <Label htmlFor="goal-2" className="text-gray-200">
                          Character development
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="goal-3" className="border-gray-600" />
                        <Label htmlFor="goal-3" className="text-gray-200">
                          Practical life skills
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="goal-4"
                          checked
                          className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <Label htmlFor="goal-4" className="text-gray-200">
                          Customized learning pace
                        </Label>
                      </div>
                    </div>
                  </Card>

                  <Card className="border border-green-700 bg-green-900/20 p-4 mb-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <h4 className="font-medium text-green-300">You're doing great — we'll take it from here.</h4>
                    </div>
                    <p className="text-sm text-green-400/80">
                      Based on your answers, we've created a personalized plan for your family. You can always adjust it
                      later.
                    </p>
                  </Card>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-gray-200">Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="defaults" className="text-sm text-gray-300">
                        Use smart defaults?
                      </Label>
                      <Switch
                        id="defaults"
                        checked
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="suggestions" className="text-sm text-gray-300">
                        Show suggestions?
                      </Label>
                      <Switch
                        id="suggestions"
                        checked
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="later" className="text-sm text-gray-300">
                        Decide later?
                      </Label>
                      <Switch id="later" className="border-gray-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 md:order-2">
              <Badge className="mb-4 bg-blue-900/30 text-blue-400 border-blue-700 hover:bg-blue-900/50">
                Onboarding
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
                Start Smart — Even If You're Not Sure Yet.
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                We guide you step-by-step and adapt as you go.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our gentle onboarding process makes getting started easy, even if you're new to homeschooling or unsure
                about your approach.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                We'll guide you through setting up your account, defining your educational vision, and creating your
                first schedule—all with helpful defaults and suggestions.
              </p>
              <p className="text-gray-300 leading-relaxed">
                And as you learn and grow, the system adapts with you. Change your approach, adjust your schedule, or
                try new resources—it's all flexible and customizable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
            You Don't Have to Figure It All Out. That's Our Job.
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join thousands of parents who are building confident, independent learners with our homeschool platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-medium hover:scale-105 transition-transform hover:shadow-glow-purple"
              >
                Create My Homeschool Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="mailto:demo@homeschooldashboard.com">
              <Button
                size="lg"
                variant="outline"
                className="bg-black text-white border-white hover:bg-white hover:text-black rounded-full px-8 py-6 text-lg font-medium transition-colors"
              >
                Schedule a Demo
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
