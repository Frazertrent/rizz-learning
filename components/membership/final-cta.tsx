"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const element = document.getElementById("final-cta")
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.75) {
          setIsVisible(true)
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      handleScroll() // Check on initial load

      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section id="final-cta" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-indigo-950/70"></div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0.5,
              opacity: 0.3,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute h-3 w-3 rounded-full bg-indigo-500/20"
            style={{
              filter: "blur(3px)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-3xl font-bold text-white sm:text-4xl"
        >
          Ready to start your smarter homeschool journey?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-lg hover:from-pink-600 hover:to-purple-700"
          >
            <Link href="/signup">Try Free Starter Plan</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-purple-300 bg-transparent text-lg text-purple-100 hover:bg-purple-900/30"
          >
            <Link href="/signup?plan=premium">Explore Premium Features</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
