"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Zap } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal"
  href?: string
}

export function Logo({ size = "md", variant = "default", href }: LogoProps) {
  // Size mappings
  const sizeClasses = {
    sm: {
      container: "h-8",
      icon: "h-4 w-4",
      text: "text-lg",
    },
    md: {
      container: "h-10",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    lg: {
      container: "h-12",
      icon: "h-6 w-6",
      text: "text-2xl",
    },
  }

  const LogoContent = (
    <motion.div
      className={`flex items-center ${sizeClasses[size].container} px-3 rounded-lg`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {variant === "default" && (
        <div className="relative mr-2 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-emerald-500/30 rounded-full blur-md"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
          />
          <div className="relative bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full p-1.5 flex items-center justify-center">
            <Zap className={`${sizeClasses[size].icon} text-white`} />
          </div>
        </div>
      )}
      <span
        className={`font-extrabold ${sizeClasses[size].text} bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent`}
        style={{ fontFamily: "Poppins, Montserrat, sans-serif" }}
      >
        Rizz
      </span>
    </motion.div>
  )

  // Only wrap in Link if href is provided
  if (href) {
    return <Link href={href}>{LogoContent}</Link>
  }

  return LogoContent
}
