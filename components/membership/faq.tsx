"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function MembershipFAQ() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const element = document.getElementById("membership-faq")
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

  const faqs = [
    {
      question: "Can I change plans later?",
      answer:
        "You can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, you'll continue to have access to your current plan until the end of your billing cycle.",
    },
    {
      question: "Do I need to enter payment info to start?",
      answer:
        "No, you can sign up for our free Starter plan without entering any payment information. You'll only need to provide payment details when you decide to upgrade to Pro or Premium.",
    },
    {
      question: "Is my child's info secure?",
      answer:
        "Yes, we take security and privacy very seriously. All data is encrypted, and we never share your child's information with third parties. We comply with all relevant privacy regulations and provide tools for you to manage and delete your data at any time.",
    },
    {
      question: "What's included in the free version?",
      answer:
        "The free Starter plan includes our Curriculum Path Builder, Program + Platform Matcher, Dashboard Overview, and Getting Started Tools. It's designed to help you begin your homeschool journey and get familiar with our platform.",
    },
    {
      question: "Do I need Premium to use GPT?",
      answer:
        "Yes, the AI-powered features like GPT tutor help, essay feedback, and automated task management are exclusive to our Premium plan. These advanced features require additional resources and specialized AI models.",
    },
  ]

  return (
    <section id="membership-faq" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Find answers to common questions about our membership plans.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-gray-700 bg-slate-800/50 px-6"
              >
                <AccordionTrigger className="text-left text-lg font-medium text-white hover:text-indigo-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
