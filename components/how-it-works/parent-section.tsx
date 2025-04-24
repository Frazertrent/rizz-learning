"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, DollarSign, FileText, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ParentSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("parent-section")?.offsetTop || 0

      if (scrollPosition > elementPosition) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      emoji: "✅",
      title: "Curriculum Planning Made Easy",
      description:
        "Tell us your goals. We'll find the best programs that fit your values, learning style, and location — whether public, charter, or private.",
      delay: 0.1,
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      emoji: "💸",
      title: "Discover and Maximize Financial Aid",
      description:
        "Our AI shows you scholarships, reimbursements, tax credits, and grant opportunities — and handles the paperwork.",
      delay: 0.2,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      emoji: "📝",
      title: "Autofill Everything",
      description:
        "From enrollment to reimbursement: we pre-fill forms, submit documentation, and remind you before deadlines.",
      delay: 0.3,
    },
    {
      icon: <Bot className="h-6 w-6" />,
      emoji: "🧑‍🏫",
      title: "No More Policing, Just Parenting",
      description: "Let GPT handle task reminders and scheduling — you focus on encouragement and connection.",
      delay: 0.4,
    },
  ]

  return (
    <section id="parent-section" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"></div>
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                For Parents:
              </span>{" "}
              Smarter Planning, Less Stress
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-purple-200 sm:text-xl">
              Let your AI assistant handle the research, paperwork, and daily task juggling — so you can focus on
              parenting, not policing.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto flex max-w-md items-center justify-center lg:max-w-full"
            >
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl"></div>

                <div className="relative z-10 rounded-2xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 p-1 shadow-2xl">
                  <div className="rounded-xl bg-slate-900/90 p-6">
                    <div className="mb-6 flex items-center space-x-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-3xl shadow-lg">
                        🧠
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Parent Assistant</h3>
                        <p className="text-purple-200">Your personal homeschool manager</p>
                      </div>
                    </div>

                    <div className="mb-6 space-y-3">
                      <div className="h-4 w-full rounded-full bg-slate-700/40"></div>
                      <div className="h-4 w-5/6 rounded-full bg-slate-700/40"></div>
                      <div className="h-4 w-4/6 rounded-full bg-slate-700/40"></div>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                        }}
                        className="overflow-hidden rounded-lg bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 p-4 shadow-lg"
                      >
                        <div className="mb-2 flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-green-500"></div>
                          <div className="h-4 w-3/4 rounded-md bg-indigo-700/40"></div>
                        </div>
                        <div className="h-16 rounded-md bg-indigo-700/20"></div>
                      </motion.div>

                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 },
                        }}
                        className="overflow-hidden rounded-lg bg-gradient-to-br from-purple-800/50 to-purple-900/50 p-4 shadow-lg"
                      >
                        <div className="mb-2 flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <div className="h-4 w-3/4 rounded-md bg-purple-700/40"></div>
                        </div>
                        <div className="h-16 rounded-md bg-purple-700/20"></div>
                      </motion.div>
                    </div>

                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 },
                      }}
                      className="overflow-hidden rounded-lg bg-gradient-to-br from-pink-800/50 to-pink-900/50 p-4 shadow-lg"
                    >
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-pink-500"></div>
                        <div className="h-4 w-3/4 rounded-md bg-pink-700/40"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 rounded-md bg-pink-700/20"></div>
                        <div className="h-12 rounded-md bg-pink-700/20"></div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                    className="rounded-xl bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <div className="mb-2 flex items-center space-x-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-xl shadow-lg">
                        {feature.emoji}
                      </div>
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    </div>
                    <p className="ml-13 text-purple-200">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 rounded-xl bg-white/10 p-6 backdrop-blur-sm"
              >
                <p className="text-lg italic text-purple-100">
                  "This replaced 3 hours of nightly research. My only regret is not starting sooner."
                </p>
                <p className="mt-2 text-sm font-semibold text-purple-300">– Jennifer K., Homeschool Parent</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                  onClick={() => {
                    const element = document.getElementById("how-it-works")
                    element?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  See How It Works For You
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
