"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Rocket } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PreAssessmentPage() {
  const [progress, setProgress] = useState(0)
  const [showFirstText, setShowFirstText] = useState(false)
  const [showSecondText, setShowSecondText] = useState(false)
  const [showThirdText, setShowThirdText] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 0.5
      })
    }, 30)

    // Show text sections sequentially
    const timer1 = setTimeout(() => setShowFirstText(true), 500)
    const timer2 = setTimeout(() => setShowSecondText(true), 2500)
    const timer3 = setTimeout(() => setShowThirdText(true), 4500)
    const timer4 = setTimeout(() => setShowButton(true), 6000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute top-60 -right-40 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 left-60 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-3xl w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"
          >
            Before We Begin
          </motion.h1>

          <div className="max-w-md mx-auto mb-12">
            <Progress value={progress} className="h-1.5 bg-gray-800/50" />
          </div>

          <div className="space-y-8">
            {showFirstText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass p-6"
              >
                <p className="text-lg md:text-xl text-gray-100">
                  This free intro assessment is just a smart preview — designed to explore your student's learning
                  style, strengths, and routines.
                </p>
              </motion.div>
            )}

            {showSecondText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass p-6"
              >
                <p className="text-lg md:text-xl text-gray-100">
                  You can skip any part, but the more you share, the more custom we can make your journey.
                </p>
              </motion.div>
            )}

            {showThirdText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass p-6"
              >
                <p className="text-lg md:text-xl text-gray-100">
                  A deeper, personalized path comes later if you choose to subscribe. For now, just relax and see what
                  Rizzlearner can do. 🚀
                </p>
              </motion.div>
            )}

            {showButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mt-8"
              >
                <Link href="/onboarding">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full hover:scale-105 transition-all duration-300 group"
                  >
                    Begin Assessment
                    <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
