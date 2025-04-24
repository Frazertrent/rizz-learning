"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ComparisonTable() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const element = document.getElementById("comparison-table")
        if (!element) return

        const rect = element.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.75) {
          setIsVisible(true)
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      handleScroll() // Check on initial load

      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Curriculum Path Builder", starter: true, pro: true, premium: true },
        { name: "Program + Platform Matcher", starter: true, pro: true, premium: true },
        { name: "Dashboard Overview", starter: true, pro: true, premium: true },
        { name: "Getting Started Tools", starter: true, pro: true, premium: true },
      ],
    },
    {
      category: "Student Tools",
      items: [
        { name: "Upload Assignments", starter: false, pro: true, premium: true },
        { name: "Track Progress", starter: false, pro: true, premium: true },
        { name: "Student Dashboard", starter: false, pro: true, premium: true },
        { name: "Rewards & XP System", starter: false, pro: true, premium: true },
        { name: "GPT Tutor Help", starter: false, pro: false, premium: true },
        { name: "AI Essay Feedback", starter: false, pro: false, premium: true },
      ],
    },
    {
      category: "Parent Tools",
      items: [
        { name: "Weekly Reports", starter: false, pro: true, premium: true },
        { name: "Auto-fill Forms", starter: false, pro: false, premium: true },
        { name: "Program Discovery", starter: false, pro: false, premium: true },
        { name: "GPT Task Management", starter: false, pro: false, premium: true },
      ],
    },
    {
      category: "Support",
      items: [
        { name: "Email Support", starter: true, pro: true, premium: true },
        { name: "Priority Support", starter: false, pro: true, premium: true },
        { name: "Dedicated Onboarding", starter: false, pro: false, premium: true },
      ],
    },
  ]

  const prices = {
    starter: { monthly: "$0", annual: "$0" },
    pro: { monthly: "$12", annual: "$108" },
    premium: { monthly: "$28", annual: "$252" },
  }

  const savings = {
    pro: { value: "$36", percent: "25%" },
    premium: { value: "$84", percent: "25%" },
  }

  return (
    <section id="comparison-table" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Compare All Features</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            See exactly what&apos;s included in each plan to find your perfect fit.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center rounded-full bg-slate-800 p-1">
            <Button
              variant={isAnnual ? "ghost" : "default"}
              className={`rounded-full px-6 ${!isAnnual ? "bg-indigo-600" : "text-gray-300 hover:text-white"}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </Button>
            <Button
              variant={isAnnual ? "default" : "ghost"}
              className={`rounded-full px-6 ${isAnnual ? "bg-indigo-600" : "text-gray-300 hover:text-white"}`}
              onClick={() => setIsAnnual(true)}
            >
              Annual <span className="ml-1 text-xs">Save 25%</span>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-xl border border-gray-700 bg-slate-900/50 shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="bg-slate-800 px-6 py-5 text-left text-sm font-semibold text-white">Features</th>
                  <th className="bg-slate-800 px-6 py-5 text-center text-sm font-semibold text-white">
                    <div className="flex flex-col items-center">
                      <span>Starter</span>
                      <span className="mt-1 text-lg font-bold text-white">
                        {prices.starter[isAnnual ? "annual" : "monthly"]}
                      </span>
                      <span className="text-xs text-gray-400">{isAnnual ? "per year" : "per month"}</span>
                    </div>
                  </th>
                  <th className="bg-slate-800 px-6 py-5 text-center text-sm font-semibold text-white">
                    <div className="flex flex-col items-center">
                      <span>Pro</span>
                      <span className="mt-1 text-lg font-bold text-white">
                        {prices.pro[isAnnual ? "annual" : "monthly"]}
                      </span>
                      <span className="text-xs text-gray-400">{isAnnual ? "per year" : "per month"}</span>
                      {isAnnual && (
                        <span className="mt-1 text-xs text-green-400">
                          Save {savings.pro.value} ({savings.pro.percent})
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="bg-indigo-900/50 px-6 py-5 text-center text-sm font-semibold text-white">
                    <div className="flex flex-col items-center">
                      <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs">Popular</span>
                      <span className="mt-1">Premium</span>
                      <span className="mt-1 text-lg font-bold text-white">
                        {prices.premium[isAnnual ? "annual" : "monthly"]}
                      </span>
                      <span className="text-xs text-gray-400">{isAnnual ? "per year" : "per month"}</span>
                      {isAnnual && (
                        <span className="mt-1 text-xs text-green-400">
                          Save {savings.premium.value} ({savings.premium.percent})
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {features.map((featureGroup, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    <tr className="bg-slate-800/50">
                      <td colSpan={4} className="px-6 py-3 text-sm font-medium text-indigo-300">
                        {featureGroup.category}
                      </td>
                    </tr>
                    {featureGroup.items.map((feature, featureIndex) => (
                      <tr key={featureIndex} className={featureIndex % 2 === 0 ? "bg-slate-900/30" : "bg-slate-800/30"}>
                        <td className="px-6 py-4 text-sm text-gray-300">{feature.name}</td>
                        <td className="px-6 py-4 text-center">
                          {feature.starter ? (
                            <Check className="mx-auto h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-gray-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {feature.pro ? (
                            <Check className="mx-auto h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-gray-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {feature.premium ? (
                            <Check className="mx-auto h-5 w-5 text-green-500" />
                          ) : (
                            <X className="mx-auto h-5 w-5 text-gray-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
