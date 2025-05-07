"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PublicNav } from "@/components/public-nav"
import { FrictionSolutionSections } from "./friction-solution-sections"

// Testimonial data
const testimonials = [
  {
    quote: "I finally feel like I'm not failing at this. The dashboard keeps us on track without the stress.",
    name: "Emily",
    title: "Homeschool Mom of 3",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    quote: "My kids are thriving—and I'm not exhausted. The reward system actually works!",
    name: "Michael",
    title: "Dad & Part-time Teacher",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    quote: "It's like having a co-teacher who never sleeps. The AI feedback saves me hours every week.",
    name: "Sarah",
    title: "Single Parent, 2 Children",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    quote: "We can finally mix our co-op classes with home learning and keep everything organized.",
    name: "David & Lisa",
    title: "Parents of 4 Students",
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

// Comparison table data
const comparisonData = [
  { feature: "Parent Check-ins", others: false, dashboard: true },
  { feature: "XP + Streaks", others: false, dashboard: true },
  { feature: "Assignment Sync", others: "partial", dashboard: true },
  { feature: "AI Feedback", others: false, dashboard: true },
  { feature: "Custom Schedules", others: "partial", dashboard: true },
  { feature: "Progress Analytics", others: "partial", dashboard: true },
  { feature: "Reward System", others: false, dashboard: true },
]

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleTestimonialChange = (index: number) => {
    setActiveTestimonial(index)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#141416] text-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400">
            Homeschooling. Handled.
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            The all-in-one platform for homeschool families. Track progress, manage curriculum, and keep your students
            engaged.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex flex-col items-center">
              <Link href="/pre-assessment">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-medium hover:scale-105 transition-transform">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <span className="text-xs text-gray-400 mt-2">Takes 2 minutes — no commitment</span>
            </div>
            <div className="flex flex-col items-center">
              <Link href="/tour">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-600 rounded-full px-8 py-6 text-lg font-medium"
                >
                  Take a Tour
                </Button>
              </Link>
              <span className="text-xs text-gray-400 mt-2">See exactly how it works</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 pt-20">
        {/* Value Proposition Section */}
        <FrictionSolutionSections />

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-950 relative overflow-hidden">
          {/* Background gradient with animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-emerald-900/20 animate-pulse"></div>

          <div className="container relative">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold">What Parents Are Saying</h2>
              <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              {/* Testimonial carousel */}
              <div className="overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.name}
                    className={cn(
                      "transition-opacity duration-500 absolute inset-0 flex flex-col items-center justify-center p-8",
                      index === activeTestimonial ? "opacity-100 z-10" : "opacity-0 z-0",
                    )}
                  >
                    <div className="text-center">
                      <p className="text-xl md:text-2xl italic text-gray-300 mb-6">"{testimonial.quote}"</p>
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-700">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-sm text-gray-400">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Static version for layout purposes */}
                <div className="opacity-0 pointer-events-none">
                  <div className="text-center">
                    <p className="text-xl md:text-2xl italic text-gray-300 mb-6">
                      "I finally feel like I'm not failing at this. The dashboard keeps us on track without the stress."
                    </p>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-700"></div>
                      <div className="text-left">
                        <p className="font-bold">Emily</p>
                        <p className="text-sm text-gray-400">Homeschool Mom of 3</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestimonialChange(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      index === activeTestimonial ? "bg-purple-500 scale-110" : "bg-gray-600 hover:bg-gray-500",
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-0 w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors z-20"
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors z-20"
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Visual Demo Teaser */}
        <section className="py-20 bg-gray-900">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold">See How It Works</h2>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                From check-ins to automated grading — here's what your day could look like.
              </p>
              <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </motion.div>

            <motion.div
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-xl shadow-purple-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse"></div>
                <div className="p-1">
                  <div className="bg-gray-800 rounded-xl aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <p className="text-3xl mb-4">🎥</p>
                      <p className="text-gray-400 mb-6">Future demo animation will appear here</p>
                      <div className="flex justify-center">
                        <Link href="/tour">
                          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                            <span>Take the Tour</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-20 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-emerald-900/50 animate-gradient-x"></div>

          <div className="container relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                You shouldn't have to choose between freedom and structure.
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Try a smarter homeschool system—backed by automation, driven by you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tour">
                  <Button
                    size="lg"
                    className="group bg-white text-gray-900 hover:bg-gray-100 w-full sm:w-auto transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                  >
                    <span>Start the Tour</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/membership">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group border-white/50 hover:border-white hover:bg-white/10 w-full sm:w-auto transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                  >
                    <span>See Membership Plans</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/tour" className="text-gray-400 hover:text-white transition-colors">
                    Tour
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="text-gray-400 hover:text-white transition-colors">
                    Plans & Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col items-center justify-center text-center">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-400">
                &copy; {new Date().getFullYear()} Homeschool Dashboard. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
