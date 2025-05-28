"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Home, Calendar, BookOpen, Upload, MessageSquare, Menu, X, LogOut, Zap, Award, Coins } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"

interface StudentHeaderProps {
  studentName: string
  level: number
  xp: number
  coins: number
  streak: number
  avatarUrl?: string
}

export function StudentHeader({
  studentName = "Alex",
  level = 5,
  xp = 450,
  coins = 120,
  streak = 7,
  avatarUrl,
}: StudentHeaderProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Only show on student routes
  if (!pathname.startsWith("/student")) {
    return null
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/student",
      icon: <Home className="h-5 w-5" />,
      color: "hover:text-blue-400 hover:bg-blue-500/10",
      activeColor: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Schedule",
      href: "/student/schedule",
      icon: <Calendar className="h-5 w-5" />,
      color: "hover:text-blue-400 hover:bg-blue-500/10",
      activeColor: "bg-blue-500/20 text-blue-400",
    },
    {
      name: "Assignments",
      href: "/student/assignments",
      icon: <BookOpen className="h-5 w-5" />,
      color: "hover:text-purple-400 hover:bg-purple-500/10",
      activeColor: "bg-purple-500/20 text-purple-400",
    },
    {
      name: "Uploads",
      href: "/student/uploads",
      icon: <Upload className="h-5 w-5" />,
      color: "hover:text-yellow-400 hover:bg-yellow-500/10",
      activeColor: "bg-yellow-500/20 text-yellow-400",
    },
    {
      name: "Chat",
      href: "/student/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "hover:text-pink-400 hover:bg-pink-500/10",
      activeColor: "bg-pink-500/20 text-pink-400",
    },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-navy-900/95 backdrop-blur-md shadow-lg"
            : "bg-gradient-to-r from-indigo-900 to-navy-900 border-b border-indigo-800/50",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Logo and Student Badge */}
            <div className="flex items-center gap-3">
              <Link href="/student" className="flex items-center gap-2">
                <Logo size="sm" />
                <div className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                  Student
                </div>
              </Link>
            </div>

            {/* Center - Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/student")

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div whileHover={{ y: -2 }} className="relative">
                      <Button
                        variant="ghost"
                        className={cn(
                          "rounded-full px-3 py-2 text-sm font-medium transition-all text-gray-200",
                          isActive ? item.activeColor : item.color,
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {item.icon}
                          <span>{item.name}</span>
                        </span>
                      </Button>
                      {isActive && (
                        <motion.div
                          layoutId="activeStudentIndicator"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            {/* Right side - Student Avatar and Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>

              {/* Student Avatar and Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-full p-0 h-10 w-10 hover:bg-indigo-800/50 transition-colors group"
                  >
                    <Avatar className="h-9 w-9 border-2 border-indigo-700 group-hover:border-blue-500 transition-colors">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold">
                        {studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute inset-0 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-indigo-900 border border-indigo-800 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg font-medium leading-none mb-2">{studentName}</p>

                      {/* Level Badge */}
                      <div className="flex items-center gap-2 p-2 rounded-md bg-gradient-to-r from-indigo-800 to-purple-800 mb-2 group">
                        <Award className="h-5 w-5 text-yellow-300 animate-pulse" />
                        <div className="flex flex-col">
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 group-hover:animate-pulse">
                            Level {level}
                          </span>
                          <span className="text-xs text-indigo-300">Keep going to unlock new rewards!</span>
                        </div>
                      </div>

                      {/* XP Badge */}
                      <div className="flex items-center gap-2 p-2 rounded-md bg-blue-900/40 mb-2">
                        <Zap className="h-5 w-5 text-blue-300" />
                        <div className="flex flex-col">
                          <span className="font-bold text-blue-300">{xp} XP</span>
                          <span className="text-xs text-blue-400/70">Earn XP by completing assignments and habits</span>
                        </div>
                      </div>

                      {/* Coins Badge */}
                      <div className="flex items-center gap-2 p-2 rounded-md bg-amber-900/30 mb-2">
                        <Coins className="h-5 w-5 text-amber-300" />
                        <div className="flex flex-col">
                          <span className="font-bold text-amber-300">{coins} Coins</span>
                          <span className="text-xs text-amber-400/70">Use your coins to buy fun rewards!</span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-indigo-800" />
                  <DropdownMenuItem className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-indigo-800 focus:bg-indigo-800">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-indigo-900 border-t border-indigo-800"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/student")

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive ? item.activeColor : `text-gray-300 ${item.color}`,
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-2 bg-indigo-800/50 rounded-lg">
                <div className="flex flex-col items-center p-2 rounded-md bg-gradient-to-r from-indigo-800 to-purple-800">
                  <span className="text-yellow-300 font-bold">Lvl {level}</span>
                  <span className="text-xs text-indigo-300">Level</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-blue-900/40">
                  <span className="text-blue-300 font-bold">{xp}</span>
                  <span className="text-xs text-blue-400/70">XP</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-md bg-amber-900/30">
                  <span className="text-amber-300 font-bold">{coins}</span>
                  <span className="text-xs text-amber-400/70">Coins</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Spacer to prevent content from being hidden under the header */}
      <div className="h-16"></div>
    </>
  )
}
