"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToParentSection = () => {
    const element = document.getElementById("parent-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToStudentSection = () => {
    const element = document.getElementById("student-section")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 opacity-90"></div>
      <div className="absolute inset-0 z-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h1 className="mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
              Homeschool Help Has Arrived 🎉
            </h1>
            <p className="mb-8 text-xl text-purple-100 sm:text-2xl">
              A modern homeschool companion that&apos;s fun, flexible, and actually helps.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-start">
              <Link href="/parent-intake">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-lg hover:from-pink-600 hover:to-purple-700"
                >
                  Try a Live Demo
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 bg-transparent text-lg text-purple-100 hover:bg-purple-900/30"
                onClick={scrollToParentSection}
              >
                For Parents
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 bg-transparent text-lg text-purple-100 hover:bg-purple-900/30"
                onClick={scrollToStudentSection}
              >
                For Students
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative mx-auto max-w-md lg:max-w-full"
          >
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 p-1 shadow-2xl">
              <div className="relative rounded-xl bg-slate-900/90 p-4">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex space-x-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="rounded-md bg-slate-700/50 px-2 py-1 text-xs font-medium text-purple-200">
                    🔍 See how it works!
                  </div>
                </div>
                <div className="relative h-[300px] overflow-hidden rounded-lg bg-slate-800">
                  <motion.div
                    animate={{
                      y: [0, -300, -600, -900, -1200, -1500, 0],
                      transition: {
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                    }}
                    className="absolute inset-0"
                  >
                    <div className="p-4">
                      <div className="mb-4 h-8 w-48 rounded-md bg-purple-700/40"></div>
                      <div className="mb-2 h-4 w-full rounded-md bg-slate-700/40"></div>
                      <div className="mb-2 h-4 w-3/4 rounded-md bg-slate-700/40"></div>
                      <div className="mb-6 h-4 w-5/6 rounded-md bg-slate-700/40"></div>

                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-lg bg-indigo-700/30"></div>
                        <div className="h-24 rounded-lg bg-purple-700/30"></div>
                      </div>

                      <div className="mb-4 h-8 w-48 rounded-md bg-purple-700/40"></div>
                      <div className="mb-2 h-4 w-full rounded-md bg-slate-700/40"></div>
                      <div className="mb-2 h-4 w-3/4 rounded-md bg-slate-700/40"></div>
                      <div className="mb-6 h-4 w-5/6 rounded-md bg-slate-700/40"></div>

                      <div className="mb-4 grid grid-cols-3 gap-4">
                        <div className="h-20 rounded-lg bg-pink-700/30"></div>
                        <div className="h-20 rounded-lg bg-indigo-700/30"></div>
                        <div className="h-20 rounded-lg bg-purple-700/30"></div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-4 h-8 w-48 rounded-md bg-purple-700/40"></div>
                      <div className="mb-2 h-4 w-full rounded-md bg-slate-700/40"></div>
                      <div className="mb-2 h-4 w-3/4 rounded-md bg-slate-700/40"></div>
                      <div className="mb-6 h-4 w-5/6 rounded-md bg-slate-700/40"></div>

                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-lg bg-indigo-700/30"></div>
                        <div className="h-24 rounded-lg bg-purple-700/30"></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
