"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, Calendar, Target, CalendarDays, FileUp } from "lucide-react"

export function CurriculumSubNav() {
  const navItems = [
    {
      name: "Feedback",
      href: "/parent/feedback",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      color: "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
    },
    {
      name: "Schedule",
      href: "/parent/schedule",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      color: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
    },
    {
      name: "Goals",
      href: "/parent/goals",
      icon: <Target className="h-4 w-4 mr-2" />,
      color: "from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
    },
    {
      name: "Calendar",
      href: "/parent/calendar",
      icon: <CalendarDays className="h-4 w-4 mr-2" />,
      color: "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
    },
    {
      name: "Upload Syllabus",
      href: "/parent/curriculum/upload-syllabus",
      icon: <FileUp className="h-4 w-4 mr-2" />,
      color: "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
    },
  ]

  return (
    <div className="w-full mb-6 overflow-x-auto pb-2 bg-gray-900/50 rounded-lg p-3">
      <div className="flex justify-center space-x-4">
        {navItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
            }}
            whileHover={{
              y: -3,
              scale: 1.05,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
              },
            }}
          >
            <Link href={item.href}>
              <div
                className={`flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white shadow-md hover:shadow-lg transition-all duration-200`}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
