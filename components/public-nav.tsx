"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function PublicNav() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "How It Works",
      href: "/how-it-works",
    },
    {
      name: "Tour",
      href: "/tour",
    },
    {
      name: "Membership",
      href: "/membership",
    },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent border-b border-gray-800/20",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo size="md" href={undefined} />
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div whileHover={{ y: -2 }} className="relative">
                    <Button
                      variant="ghost"
                      className={cn(
                        "rounded-full px-3 py-2 text-sm font-medium transition-all",
                        isActive ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5",
                      )}
                    >
                      {item.name}
                    </Button>
                    {isActive && (
                      <motion.div
                        layoutId="activePublicIndicator"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Right side - CTA Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full text-gray-300 hover:text-white">
                  Log in
                </Button>
              </Link>
            </div>
            <Link href="/membership">
              <Button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 text-white">
                Sign up
              </Button>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-colors",
                    isActive ? "bg-white/10 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Log in
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}
