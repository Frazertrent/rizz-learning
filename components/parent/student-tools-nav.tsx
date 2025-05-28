"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, GraduationCap, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export function StudentToolsNav() {
  return (
    <div className="w-full mb-6 overflow-x-auto pb-2">
      <motion.div
        className="flex space-x-4 justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/parent/students/schedule">
          <Button
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </Link>

        <Link href="/parent/students/feedback">
          <Button
            variant="default"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback
          </Button>
        </Link>

        <Link href="/parent/students/gradebook">
          <Button
            variant="default"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Gradebook
          </Button>
        </Link>

        <Link href="/parent/students/reflection">
          <Button
            variant="default"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Reflection
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
