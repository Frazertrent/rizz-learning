"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Brain, Trophy } from "lucide-react"

export function StudentSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section
      id="student-section"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 z-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"></div>

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-purple-600/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-indigo-600/10 blur-3xl"></div>
      <div className="absolute top-40 right-1/4 h-24 w-24 rounded-full bg-pink-600/10 blur-3xl"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 mx-auto max-w-7xl"
      >
        <div className="mb-12 text-center">
          <motion.h2
            variants={itemVariants}
            className="mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            For Students
          </motion.h2>
          <motion.p variants={itemVariants} className="mx-auto max-w-3xl text-xl text-purple-200">
            Learning tools that make homework feel less like work and more like play.
          </motion.p>
        </div>

        <motion.div variants={containerVariants} className="grid gap-8 md:grid-cols-3">
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-1 shadow-lg transition-all duration-300 hover:shadow-indigo-500/20 hover:shadow-xl"
          >
            <div className="h-full rounded-xl bg-slate-900/90 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900/50 text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Homework Coach & Quiz Helper</h3>
              <p className="mb-4 text-purple-200">
                Upload an assignment, get GPT-based tutoring or quiz prep instantly.
              </p>
              <div className="mt-auto">
                <Link
                  href="/student/assignments"
                  className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-1 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-xl"
          >
            <div className="h-full rounded-xl bg-slate-900/90 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50 text-purple-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Learn It, Don't Just Track It</h3>
              <p className="mb-4 text-purple-200">
                From concept coaching to long-answer help — your dashboard isn't just where you see tasks, it helps you
                do them.
              </p>
              <div className="mt-auto">
                <Link
                  href="/student/practice-tests"
                  className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 p-1 shadow-lg transition-all duration-300 hover:shadow-pink-500/20 hover:shadow-xl"
          >
            <div className="h-full rounded-xl bg-slate-900/90 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-900/50 text-pink-400">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Rewards & XP Motivation System</h3>
              <p className="mb-4 text-purple-200">
                Earn XP, badges, coins, and streaks by completing tasks — it's school, but it feels like a game.
              </p>
              <div className="mt-auto">
                <Link
                  href="/student/rewards"
                  className="inline-flex items-center text-sm font-medium text-pink-400 hover:text-pink-300"
                >
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
          >
            <Link href="/student">Explore Student Tools</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
