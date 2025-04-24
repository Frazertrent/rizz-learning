"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MembershipHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToPlans = () => {
    const element = document.getElementById("membership-plans")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 opacity-90"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 0.5 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 0.4 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl"
        />
      </div>

      {/* Confetti animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: -20,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: "100vh",
              rotate: Math.random() * 360,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            className={`absolute h-${Math.floor(Math.random() * 3) + 2} w-${Math.floor(Math.random() * 3) + 2} rounded-full`}
            style={{
              backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
        >
          Find the Plan That Fits Your Family
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-3xl text-xl text-purple-100 sm:text-2xl"
        >
          From getting started to automating everything, we&apos;ve got a membership tier to support your homeschool
          journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-lg hover:from-pink-600 hover:to-purple-700"
          >
            <Link href="/signup">Sign Up Free</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-purple-300 bg-transparent text-lg text-purple-100 hover:bg-purple-900/30"
            onClick={scrollToPlans}
          >
            Compare Plans
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
