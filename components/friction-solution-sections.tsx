"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, DollarSign, Search, Calendar, UserCheck, Bell, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SolutionCardProps {
  icon: React.ReactNode
  emoji: string
  title: string
  description: string
  href: string
  gradient: string
  delay: number
}

const SolutionCard = ({ icon, emoji, title, description, href, gradient, delay }: SolutionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-1 shadow-lg transition-all duration-300`}
    >
      <Link href={href} className="block h-full">
        <div className="flex h-full flex-col rounded-xl bg-slate-900/90 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 text-4xl">
              {emoji}
            </div>
            <div className="rounded-full bg-white/10 p-2">{icon}</div>
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
          <p className="mb-6 text-lg text-purple-200">{description}</p>
          <div className="mt-auto">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-purple-200">
              Learn more →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function FrictionSolutionSections() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("friction-solutions")?.offsetTop || 0

      if (scrollPosition > elementPosition) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const curriculumCards = [
    {
      emoji: "📘",
      icon: <BookOpen className="h-8 w-8 text-blue-300" />,
      title: "GPT-Curated Curriculum",
      description: "Tell us your kid's grade and goals. We'll plan it for you.",
      href: "/parent/curriculum-planner",
      gradient: "from-blue-600 to-indigo-700",
      delay: 0.1,
    },
    {
      emoji: "🎓",
      icon: <UserCheck className="h-8 w-8 text-emerald-300" />,
      title: "Visual Credit Tracker",
      description: "See what counts for credit — and what's optional.",
      href: "/tour",
      gradient: "from-emerald-600 to-teal-700",
      delay: 0.2,
    },
    {
      emoji: "💸",
      icon: <DollarSign className="h-8 w-8 text-green-300" />,
      title: "Reimbursement Finder",
      description: "Don't pay for things the state will cover.",
      href: "/parent/reimbursement",
      gradient: "from-green-600 to-emerald-700",
      delay: 0.3,
    },
    {
      emoji: "🔎",
      icon: <Search className="h-8 w-8 text-purple-300" />,
      title: "Preloaded Resource Library",
      description: "Skip the search. We've filtered the noise.",
      href: "/resources",
      gradient: "from-purple-600 to-indigo-700",
      delay: 0.4,
    },
  ]

  const taskCards = [
    {
      emoji: "🧭",
      icon: <Calendar className="h-8 w-8 text-orange-300" />,
      title: "Daily Routine Builder",
      description: "Structure that runs itself — no micromanaging.",
      href: "/student/schedule",
      gradient: "from-orange-600 to-amber-700",
      delay: 0.1,
    },
    {
      emoji: "🧑‍🏫",
      icon: <UserCheck className="h-8 w-8 text-pink-300" />,
      title: "Saved Expectations per Subject",
      description: "Set it once, never repeat it again.",
      href: "/parent/expectations",
      gradient: "from-pink-600 to-rose-700",
      delay: 0.2,
    },
    {
      emoji: "🔔",
      icon: <Bell className="h-8 w-8 text-cyan-300" />,
      title: "Automated Check-Ins",
      description: "Gentle nudges keep kids on task — without you.",
      href: "/student/check-ins",
      gradient: "from-cyan-600 to-blue-700",
      delay: 0.3,
    },
    {
      emoji: "🤖",
      icon: <Bot className="h-8 w-8 text-violet-300" />,
      title: "GPT = Taskmaster",
      description: "You stay the parent. We handle the follow-up.",
      href: "/tour",
      gradient: "from-violet-600 to-purple-700",
      delay: 0.4,
    },
  ]

  return (
    <div id="friction-solutions" className="w-full">
      {/* First Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-indigo-900/40 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 font-display text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              🧠 "I wanted to homeschool — but it was just too overwhelming."
            </h2>
            <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {curriculumCards.map((card, index) => (
              <SolutionCard key={index} {...card} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <Link href="/how-it-works">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-blue-600 text-xl font-bold text-white hover:from-purple-700 hover:to-blue-700"
              >
                🎉 Show Me How It Works
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900/40 to-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 font-display text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              ⏰ "I can't be the teacher, principal, and taskmaster."
            </h2>
            <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-pink-500 to-orange-500"></div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {taskCards.map((card, index) => (
              <SolutionCard key={index} {...card} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <Link href="/how-it-works">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-pink-600 to-orange-600 text-xl font-bold text-white hover:from-pink-700 hover:to-orange-700"
              >
                🎉 Show Me How It Works
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
