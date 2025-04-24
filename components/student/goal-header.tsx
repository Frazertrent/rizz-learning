"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function GoalHeader() {
  const [isVisible, setIsVisible] = useState(false)
  const [verbIndex, setVerbIndex] = useState(0)

  const verbs = ["Set", "Make", "Celebrate"]
  const nouns = ["a goal", "a plan", "your progress"]

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setVerbIndex((prev) => (prev + 1) % 3)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Particle configuration
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 2 + 1,
    delay: Math.random() * 0.5,
  }))

  return (
    <div className="relative mb-10 overflow-hidden">
      {/* Dynamic Background Banner */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-blue-900/30 rounded-2xl opacity-70 dark:opacity-40"></div>

      {/* Radial Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>
      </div>

      {/* Animated Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white dark:bg-white/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 40 - 20],
            y: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 3 + 1,
          }}
        />
      ))}

      {/* Soft Wave Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0,64 C100,42 200,86 300,64 C400,42 500,86 600,64 C700,42 800,86 900,64 C1000,42 1100,86 1200,64 L1200,136 L0,136 Z"
            fill="url(#wave-gradient)"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,64 C100,42 200,86 300,64 C400,42 500,86 600,64 C700,42 800,86 900,64 C1000,42 1100,86 1200,64 L1200,136 L0,136 Z;
                M0,64 C100,86 200,42 300,64 C400,86 500,42 600,64 C700,86 800,42 900,64 C1000,86 1100,42 1200,64 L1200,136 L0,136 Z;
                M0,64 C100,42 200,86 300,64 C400,42 500,86 600,64 C700,42 800,86 900,64 C1000,42 1100,86 1200,64 L1200,136 L0,136 Z
              "
            />
          </path>
        </svg>
      </div>

      <div className="relative z-10 py-10 px-8 rounded-2xl">
        {/* Title with Animated Icon */}
        <div className="flex items-center justify-center md:justify-start mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.8,
            }}
            className="mr-3 text-5xl"
          >
            <motion.span
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              🎯
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x"
          >
            Your Goals
          </motion.h1>
        </div>

        {/* Animated Subtitle */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-500 dark:text-gray-400 text-lg md:text-xl flex flex-wrap gap-x-2"
          >
            {verbs.map((verb, index) => (
              <motion.span
                key={verb}
                animate={{
                  scale: verbIndex === index ? 1.1 : 1,
                  color: verbIndex === index ? "#8b5cf6" : "",
                  fontWeight: verbIndex === index ? "bold" : "normal",
                }}
                className="inline-flex"
              >
                {verb} {nouns[index]}.
              </motion.span>
            ))}
          </motion.div>

          {/* Motivational One-liner */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            <span className="inline-block mr-2 animate-bounce">🎉</span>
            You're one step closer to your next achievement.
          </motion.p>
        </div>
      </div>
    </div>
  )
}
