"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Upload, Brain, Trophy } from "lucide-react"

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("how-it-works")?.offsetTop || 0

      if (scrollPosition > elementPosition) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const cards = [
    {
      emoji: "📚",
      icon: <Upload className="h-8 w-8 text-purple-300" />,
      title: "Upload Your Work",
      description: "Drop in your assignments, notes, or workbook pages.",
      link: "/student/uploads",
      gradient: "from-pink-600 to-purple-700",
      delay: 0.2,
    },
    {
      emoji: "🧠",
      icon: <Brain className="h-8 w-8 text-indigo-300" />,
      title: "Get AI Help",
      description: "Get instant feedback, flashcards, quizzes, and study tools — automatically.",
      link: "/student/writing-submissions",
      gradient: "from-indigo-600 to-blue-700",
      delay: 0.4,
    },
    {
      emoji: "🏆",
      icon: <Trophy className="h-8 w-8 text-amber-300" />,
      title: "Track Progress & Rewards",
      description: "See grades, earn coins, level up, and stay on streaks.",
      link: "/student/rewards",
      gradient: "from-amber-500 to-orange-600",
      delay: 0.6,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">So... What Does It Actually Do?</h2>
          <p className="mx-auto max-w-2xl text-lg text-purple-200">
            Our platform simplifies homeschooling with powerful tools that make learning engaging and tracking progress
            easy.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.6, delay: card.delay }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-1 shadow-lg transition-all duration-300`}
            >
              <Link href={card.link} className="block h-full">
                <div className="flex h-full flex-col rounded-xl bg-slate-900/90 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 text-4xl">
                      {card.emoji}
                    </div>
                    <div className="rounded-full bg-white/10 p-2">{card.icon}</div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">{card.title}</h3>
                  <p className="mb-6 text-lg text-purple-200">{card.description}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-purple-200">
                      Learn more →
                    </span>
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
