"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, CreditCard, Calendar, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Plan data configuration
const planData = {
  starter: {
    name: "Starter Plan",
    price: "$19",
    tag: "",
    color: "from-blue-500 to-indigo-600",
    buttonColor: "from-blue-500 to-indigo-600",
    features: [
      "1 Personalized Learning Plan",
      "3 program or school matches (public/private/charter)",
      "Financial aid suggestions",
      "Weekly email tips & updates",
      'One-time download: "Starter Resource Toolkit"',
    ],
  },
  core: {
    name: "Core Plan",
    price: "$29",
    tag: "",
    color: "from-blue-600 to-blue-700",
    buttonColor: "from-blue-600 to-blue-700",
    features: [
      "All Starter features",
      "Full dashboard access for up to 3 students",
      "Custom curriculum planner",
      "Weekly progress snapshots",
      "AI Mentor feedback on submissions",
      "Reimbursement assistant & transcript builder",
    ],
  },
  power: {
    name: "Power Plan",
    price: "$39",
    tag: "Most Popular",
    color: "from-purple-600 to-pink-600",
    buttonColor: "from-purple-600 to-pink-600",
    features: [
      "All Core features",
      "Unlimited student profiles",
      "AI-powered grading assistant + reflections",
      "Auto-filled document vault",
      "Real-time alerts for missed work",
      "Dedicated onboarding concierge (human support)",
    ],
  },
}

export default function CheckoutPage() {
  // Get plan from URL query parameter
  const searchParams = useSearchParams()
  const router = useRouter()
  const planParam = searchParams.get("plan") || "core"
  const plan = planData[planParam as keyof typeof planData] || planData.core

  // State for form and modal
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessModal(true)
    }, 1500)
  }

  // Handle continue to profile setup
  const handleContinueToProfileSetup = () => {
    router.push("/profile-setup")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎉 Welcome! You're activating the{" "}
            <span className={`bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.name}</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Start building your personalized dashboard with custom curriculum tools, weekly schedules, and more —
            tailored just for your family.
          </p>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/70 border border-gray-700">
            <span className={`text-2xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
              {plan.price}/mo
            </span>
            {plan.tag && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-sm font-medium rounded-full">
                {plan.tag}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* What's Included Card */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="order-2 md:order-1">
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 p-6 rounded-xl h-full">
              <h2 className="text-2xl font-bold mb-6">What's Included</h2>

              <div className="space-y-4">
                {plan.features.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mt-0.5 mr-3">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center text-gray-300">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">30-Day Money-Back Guarantee</p>
                    <p className="text-sm text-gray-400">Try risk-free for a full month</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Payment Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Enter your payment details</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="cardNumber" className="text-gray-300">
                    Card Number
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiration" className="text-gray-300">
                      Expiration
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="expiration"
                        placeholder="MM/YY"
                        className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-gray-300">
                      CVC
                    </Label>
                    <Input id="cvc" placeholder="123" className="bg-gray-700/60 border-gray-600 text-white mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="nameOnCard" className="text-gray-300">
                    Name on Card
                  </Label>
                  <Input
                    id="nameOnCard"
                    placeholder="John Doe"
                    className="bg-gray-700/60 border-gray-600 text-white mt-1"
                  />
                </div>

                {/* Credit card icons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                      <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                    </div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                      <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                    </div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                      <div className="w-8 h-5 bg-red-500 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Lock className="h-3 w-3 mr-1" />
                    Secure Checkout
                  </div>
                </div>

                {/* CTA Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className={`w-full h-14 text-lg font-bold bg-gradient-to-r ${plan.buttonColor} hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 rounded-xl mt-4`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <>
                        Activate My Plan <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="text-center text-gray-400 text-sm pt-2">
                  <p>You can cancel anytime. No contracts. No hidden fees.</p>
                </div>
              </form>

              {/* Optional Link */}
              <div className="mt-6 text-center">
                <Link
                  href="/membership"
                  className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Pick a different plan
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl max-w-md w-full border border-gray-700 shadow-xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-4">🎊 Payment Successful!</h2>
                <p className="text-gray-300 mb-8">
                  Your payment has been processed successfully. Now let's set up your profiles to personalize your
                  experience.
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 rounded-xl"
                    onClick={handleContinueToProfileSetup}
                  >
                    Continue to Profile Setup <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
