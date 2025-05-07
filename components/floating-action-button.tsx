"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FloatingActionButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
        <Button
          asChild
          className="rounded-full px-6 py-4 text-base font-bold shadow-xl text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400"
        >
          <Link href="/profile-setup">🎉 Ready to Start? Click Here to Continue!</Link>
        </Button>
      </motion.div>
    </div>
  )
}
