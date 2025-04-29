"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl w-full"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: 5,
            }}
            className="text-6xl mb-6"
          >
            🎒
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Welcome to Rizz Learning!
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 mb-10"
          >
            We're going to make this unbelievably easy.
          </motion.h2>

          <div className="space-y-8 mb-10 w-full max-w-xl">
            {[
              {
                icon: "📝",
                title: "Create your free account",
                delay: 0.4,
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Complete your Family Enrollment Profile (be as detailed or as minimal as you want)",
                delay: 0.5,
              },
              {
                icon: "🎯",
                title: "Pick the perfect resources for your family — no stress!",
                delay: 0.6,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay }}
                className="flex items-start text-left bg-gray-50 rounded-2xl p-4"
              >
                <div className="text-3xl mr-4">{step.icon}</div>
                <div className="text-lg font-medium text-gray-700">{step.title}</div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 mb-10 max-w-2xl"
          >
            You can update your Family Enrollment Profile anytime. The more details you share, the better we can match
            you to amazing programs, scholarships, and resources.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="text-lg font-medium text-gray-700 mb-2">Step 1</div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create Your Free Account
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
