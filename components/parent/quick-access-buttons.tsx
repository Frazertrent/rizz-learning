"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Target, Library, Shield, Settings } from "lucide-react"

export function QuickAccessButtons() {
  // Button configurations
  const buttons = [
    {
      label: "Schedule Review",
      icon: <Calendar className="h-5 w-5" />,
      href: "/parent/schedule-review",
      gradient: "from-blue-500 to-indigo-600",
      hoverGradient: "from-blue-600 to-indigo-700",
    },
    {
      label: "Goals & Milestones",
      icon: <Target className="h-5 w-5" />,
      href: "/parent/goals",
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-600 to-pink-700",
    },
    {
      label: "Resource Library",
      icon: <Library className="h-5 w-5" />,
      href: "/parent/resources",
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "from-emerald-600 to-teal-700",
    },
    {
      label: "Safety Settings",
      icon: <Shield className="h-5 w-5" />,
      href: "/parent/safety",
      gradient: "from-amber-500 to-orange-600",
      hoverGradient: "from-amber-600 to-orange-700",
    },
    {
      label: "Admin Tools",
      icon: <Settings className="h-5 w-5" />,
      href: "/parent/admin",
      gradient: "from-rose-500 to-red-600",
      hoverGradient: "from-rose-600 to-red-700",
    },
  ]

  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex flex-wrap gap-3 justify-center md:justify-start min-w-max md:min-w-0">
        {buttons.map((button, index) => (
          <Link key={button.label} href={button.href}>
            <motion.div
              className={`inline-flex items-center justify-center px-4 py-2.5 rounded-2xl bg-gradient-to-r ${button.gradient} text-white font-medium shadow-md hover:shadow-lg transition-all duration-200`}
              whileHover={{
                y: -3,
                scale: 1.03,
                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: index * 0.1,
              }}
            >
              <span className="flex items-center gap-2">
                {button.icon}
                {button.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
