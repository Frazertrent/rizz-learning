"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function DifferenceSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("difference")?.offsetTop || 0

      if (scrollPosition > elementPosition) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    { icon: "✨", text: "Built for students, loved by parents" },
    { icon: "⚡", text: "AI-powered feedback & suggestions" },
    { icon: "🎮", text: "XP, coins, streaks, and gamified learning" },
    { icon: "🎯", text: "Helps *you* stay on track (not just your kids)" },
    { icon: "🛠️", text: "Works with *your* curriculum, not just ours" },
  ]

  return (
    <section id="difference" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
              Not just a tracker. A full-on learning companion.
            </h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-700/30 text-xl">
                    {feature.icon}
                  </div>
                  <div className="pt-1">
                    <p className="text-lg text-purple-100">{feature.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
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
                      <h3 className="text-xl font-bold text-white">AI Learning Assistant</h3>
                      <p className="text-purple-200">Personalized help when you need it</p>
                    </div>
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="h-4 w-full rounded-full bg-slate-700/40"></div>
                    <div className="h-4 w-5/6 rounded-full bg-slate-700/40"></div>
                    <div className="h-4 w-4/6 rounded-full bg-slate-700/40"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 5, 0, -5, 0],
                        transition: { duration: 5, repeat: Number.POSITIVE_INFINITY },
                      }}
                      className="overflow-hidden rounded-lg bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 p-4 shadow-lg"
                    >
                      <div className="mb-2 h-4 w-3/4 rounded-md bg-indigo-700/40"></div>
                      <div className="h-16 rounded-md bg-indigo-700/20"></div>
                    </motion.div>

                    <motion.div
                      animate={{
                        rotate: [0, -5, 0, 5, 0],
                        transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 },
                      }}
                      className="overflow-hidden rounded-lg bg-gradient-to-br from-purple-800/50 to-purple-900/50 p-4 shadow-lg"
                    >
                      <div className="mb-2 h-4 w-3/4 rounded-md bg-purple-700/40"></div>
                      <div className="h-16 rounded-md bg-purple-700/20"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
