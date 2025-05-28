"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"
import { Home, Calendar, BookOpen, Upload, MessageSquare, Settings, Menu, X } from "lucide-react"

interface DashboardSidebarProps {
  studentName: string
  coins: number
  xp: number
  level: number
  streak: number
}

export default function DashboardSidebar({ studentName, coins, xp, level, streak }: DashboardSidebarProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(!isMobile)

  useEffect(() => {
    setIsOpen(!isMobile)
  }, [isMobile])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const navItems = [
    { href: "/student", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/student/schedule", label: "Schedule", icon: <Calendar className="h-5 w-5" /> },
    { href: "/student/assignments", label: "Assignments", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/student/uploads", label: "Uploads", icon: <Upload className="h-5 w-5" /> },
    { href: "/student/chat", label: "Chat", icon: <MessageSquare className="h-5 w-5" /> },
  ]

  return (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" onClick={toggleSidebar} className="bg-white dark:bg-gray-800 shadow-md">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex flex-col items-center space-y-2 py-6 border-b border-gray-200 dark:border-gray-800">
            <Avatar className="h-16 w-16 mb-2 bg-primary text-primary-foreground">
              <AvatarFallback>{studentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{studentName}</h2>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Level {level}</span>
              <span>•</span>
              <span>{xp} XP</span>
            </div>
            <div className="w-full mt-2">
              <Progress value={xp % 100} className="h-2" />
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
            </div>
            <div className="flex justify-between w-full mt-4">
              <div className="flex flex-col items-center">
                <span className="text-amber-500 font-bold">{coins}</span>
                <span className="text-xs text-gray-500">Coins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-orange-500 font-bold">{streak}</span>
                <span className="text-xs text-gray-500">Day Streak</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 mt-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebarOnMobile}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/student/settings"
              onClick={closeSidebarOnMobile}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
