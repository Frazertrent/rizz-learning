"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, Brain, PenTool, BarChart3 } from "lucide-react"

export function ToolsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("tools")?.offsetTop || 0

      if (scrollPosition > elementPosition) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tools = [
    {
      emoji: "🧾",
      icon: <FileText className="h-6 w-6" />,
      title: "Assignments",
      description: "See everything due — and what's done.",
      link: "/student/assignments",
      gradient: "from-emerald-500 to-teal-600",
      delay: 0.1,
    },
    {
      emoji: "🧠",
      icon: <Brain className="h-6 w-6" />,
      title: "Practice Tests",
      description: "Take quizzes or get AI-guided coaching.",
      link: "/student/practice-tests",
      gradient: "from-blue-500 to-indigo-600",
      delay: 0.2,
    },
    {
      emoji: "📝",
      icon: <PenTool className="h-6 w-6" />,
      title: "Reflections",
      description: "Journaling & writing tools for growth.",
      link: "/student/reflection",
      gradient: "from-purple-500 to-violet-600",
      delay: 0.3,
    },
    {
      emoji: "📊",
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Grades",
      description: "See real-time progress by subject.",
      link: "/student/grades",
      gradient: "from-pink-500 to-rose-600",
      delay: 0.4,
    },
  ]

  return (
    <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Real Tools, Real Support</h2>
          <p className="mx-auto max-w-2xl text-lg text-purple-200">
            Everything you need to make homeschooling more effective and enjoyable.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.5, delay: tool.delay }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              }}
              className={`overflow-hidden rounded-xl bg-gradient-to-br ${tool.gradient} p-0.5 shadow-lg transition-all duration-300`}
            >
              <Link href={tool.link} className="block h-full">
                <div className="flex h-full flex-col rounded-lg bg-slate-900/90 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-2xl">
                      {tool.emoji}
                    </div>
                    <div className="rounded-full bg-white/10 p-2 text-white">{tool.icon}</div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{tool.title}</h3>
                  <p className="mb-4 text-purple-200">{tool.description}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-sm font-medium text-purple-200">Explore →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
