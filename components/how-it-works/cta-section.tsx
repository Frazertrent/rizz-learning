"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("cta")?.offsetTop || 0

      if (scrollPosition > elementPosition - 200) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl"
      >
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-2xl">
          <div className="relative px-6 py-16 sm:px-12 lg:px-16">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">Start Your Homeschool Upgrade Today ✨</h2>
              <p className="mb-10 text-xl text-purple-100">
                Join thousands of families who are making homeschooling more effective, engaging, and enjoyable.
              </p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 md:justify-center">
                <Button asChild size="lg" className="bg-white text-lg font-semibold text-purple-700 hover:bg-purple-50">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white bg-transparent text-lg font-semibold text-white hover:bg-white/10"
                >
                  <Link href="/tour">See It in Action</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
