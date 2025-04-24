"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, Smile, Monitor } from "lucide-react"

export function SafetySection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("safety")?.offsetTop || 0

      if (scrollPosition > elementPosition) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const safetyFeatures = [
    {
      icon: <Lock className="h-8 w-8" />,
      emoji: "🔐",
      title: "Private & Secure",
      description: "Your data stays private with end-to-end encryption and strict privacy controls.",
      delay: 0.1,
    },
    {
      icon: <Smile className="h-8 w-8" />,
      emoji: "👶",
      title: "Kid-Friendly UX",
      description: "Designed for children with intuitive navigation and age-appropriate content.",
      delay: 0.2,
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      emoji: "💻",
      title: "No Setup Required",
      description: "Works instantly in your browser with no downloads or complicated configuration.",
      delay: 0.3,
    },
  ]

  return (
    <section id="safety" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"></div>
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Safe, Private, and Easy to Use</h2>
            <p className="mx-auto max-w-2xl text-lg text-purple-200">
              You can be up and running in 5 minutes — no tech skills needed.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="overflow-hidden rounded-xl bg-white/10 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
                  {feature.emoji}
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-purple-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
