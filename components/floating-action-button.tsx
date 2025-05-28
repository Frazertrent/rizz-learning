"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
        <Link href="/profile-setup">
          <Button className="rounded-full px-6 py-4 text-base font-bold shadow-xl text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400">
            🎉 Ready to Start? Click Here to Continue!
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
