"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MembershipPlans() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const element = document.getElementById("membership-plans")
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

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const plans = [
    {
      name: "Starter",
      tag: "Best for Beginners",
      price: "$0",
      period: "month",
      features: [
        { text: "Curriculum Path Builder", included: true },
        { text: "Program + Platform Matcher", included: true },
        { text: "Dashboard Overview", included: true },
        { text: "Getting Started Tools", included: true },
        { text: "No uploads, AI tools, or rewards", included: false, locked: true },
      ],
      buttonText: "Start for Free",
      buttonLink: "/signup",
      buttonVariant: "primary",
      delay: 0,
    },
    {
      name: "Pro",
      tag: "Most Popular",
      price: "$12",
      period: "month",
      features: [
        { text: "Everything in Free, plus:", included: true },
        { text: "Upload assignments and notes", included: true, icon: "📂" },
        { text: "Track progress and XP", included: true, icon: "🧠" },
        { text: "Student Dashboards", included: true, icon: "🧒" },
        { text: "Earn rewards, coins, and badges", included: true, icon: "🏆" },
        { text: "Weekly parent reports", included: true, icon: "📊" },
      ],
      buttonText: "Upgrade to Pro",
      buttonLink: "/signup?plan=pro",
      buttonVariant: "secondary",
      delay: 0.1,
    },
    {
      name: "Premium",
      tag: "All-In Access",
      price: "$28",
      period: "month",
      features: [
        { text: "Everything in Pro, plus:", included: true },
        { text: "GPT tutor help on quizzes + writing", included: true, icon: "🤖" },
        { text: "AI-powered essay feedback", included: true, icon: "📝" },
        { text: "Auto-fill forms for reimbursements, aid, taxes", included: true, icon: "🧾" },
        { text: "Discover state-funded, charter, or private programs", included: true, icon: "📌" },
        { text: "GPT handles taskforce-style enforcement with care", included: true, icon: "🧑‍🏫" },
      ],
      buttonText: "Go Premium",
      buttonLink: "/signup?plan=premium",
      buttonVariant: "premium",
      popular: true,
      delay: 0.2,
    },
  ]

  return (
    <section id="membership-plans" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Choose Your Plan</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Select the plan that best fits your homeschooling needs and budget.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 30,
                scale: isVisible ? 1 : 0.95,
              }}
              transition={{ duration: 0.5, delay: plan.delay }}
              className={`relative overflow-hidden rounded-2xl border-2 ${
                plan.popular
                  ? "border-purple-500 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg shadow-purple-500/20"
                  : "border-gray-700 bg-gradient-to-b from-slate-800/80 to-slate-900/80"
              } p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-1 text-sm font-medium text-white">
                  Popular
                </div>
              )}

              <div className="mb-4">
                <span className="inline-block rounded-full bg-indigo-900/50 px-3 py-1 text-xs font-medium text-indigo-300">
                  {plan.tag}
                </span>
              </div>

              <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    {feature.locked ? (
                      <Lock className="mr-3 h-5 w-5 shrink-0 text-gray-500" />
                    ) : feature.included ? (
                      feature.icon ? (
                        <span className="mr-3 text-lg">{feature.icon}</span>
                      ) : (
                        <Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
                      )
                    ) : (
                      <span className="mr-3 text-gray-500">✕</span>
                    )}
                    <span className={feature.locked ? "text-gray-500" : "text-gray-300"}>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${
                  plan.buttonVariant === "primary"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    : plan.buttonVariant === "premium"
                      ? "bg-gradient-to-r from-indigo-800 to-purple-900 hover:from-indigo-900 hover:to-purple-950 shadow-lg shadow-purple-700/20"
                      : "bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800"
                }`}
                size="lg"
              >
                <Link href={plan.buttonLink}>{plan.buttonText}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
