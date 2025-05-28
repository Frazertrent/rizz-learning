"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Users, BarChart3, Award, Upload, DollarSign, Home, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/components/auth-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { Logo } from "@/components/logo"

export function ParentHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const isMobile = useIsMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // Handle scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items for parent dashboard
  const navItems = [
    {
      name: "Dashboard",
      href: "/parent",
      icon: <Home className="h-5 w-5" />,
      color: "from-blue-500 to-indigo-500",
      textColor: "text-blue-500",
    },
    {
      name: "Students",
      href: "/parent/students",
      icon: <Users className="h-5 w-5" />,
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-500",
    },
    {
      name: "Curriculum",
      href: "/parent/curriculum",
      icon: <BookOpen className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      textColor: "text-green-500",
    },
    {
      name: "Reports",
      href: "/parent/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-500",
    },
    {
      name: "Rewards",
      href: "/parent/rewards",
      icon: <Award className="h-5 w-5" />,
      color: "from-yellow-500 to-amber-500",
      textColor: "text-yellow-500",
    },
    {
      name: "Uploads",
      href: "/parent/uploads",
      icon: <Upload className="h-5 w-5" />,
      color: "from-cyan-500 to-blue-500",
      textColor: "text-cyan-500",
    },
    {
      name: "Finances",
      href: "/parent/financial-tools",
      icon: <DollarSign className="h-5 w-5" />,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-500",
    },
    {
      name: "Settings",
      href: "/parent/settings",
      icon: <Settings className="h-5 w-5" />,
      color: "from-pink-500 to-rose-500",
      textColor: "text-pink-500",
    },
  ]

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutDialog(false)
    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md dark:bg-gray-900/95"
            : "bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Logo and "Parent Dashboard" text */}
            <div className="flex items-center gap-3">
              <Link href="/parent" className="flex items-center gap-2">
                <Logo size="md" />
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                  Parent Dashboard
                </span>
              </Link>
            </div>

            {/* Center - Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/parent")

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div whileHover={{ y: -2 }} className="relative">
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "rounded-full px-3 py-2 text-sm font-medium transition-all",
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                            : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {item.icon}
                          <span>{item.name}</span>
                        </span>
                      </Button>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            {/* Right side - User Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>

              {/* User Avatar and Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-full p-0 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar className="h-9 w-9 border-2 border-gray-200 hover:border-blue-500 transition-colors dark:border-gray-700">
                      <AvatarImage
                        src={user?.avatar || "/placeholder.svg?height=36&width=36"}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                        {user?.name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "Parent User"}</p>
                      <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                        {user?.email || "parent@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/parent/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/parent")

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white`
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to log back in to access your dashboard and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Spacer to prevent content from being hidden under the header */}
      <div className="h-16"></div>
    </>
  )
}
