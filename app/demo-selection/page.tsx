"use client"

import Link from "next/link"
import { PublicNav } from "@/components/public-nav"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function DemoSelectionPage() {
  return (
    <div className="min-h-screen bg-[#050510] flex flex-col">
      <PublicNav />

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to the Demo Environment
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore the platform through fully interactive sample dashboards.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/demo/parent">
              <Button className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 rounded-lg min-w-[250px]">
                Demo Parent Dashboard
              </Button>
            </Link>
            <Link href="/demo/student">
              <Button className="px-8 py-6 text-lg bg-purple-600 hover:bg-purple-700 rounded-lg min-w-[250px]">
                Demo Student Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
          <Link href="/profile-setup">
            <Button className="rounded-full px-6 py-4 text-base font-bold shadow-xl text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400">
              🎉 Ready to Start? Click Here to Continue!
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
