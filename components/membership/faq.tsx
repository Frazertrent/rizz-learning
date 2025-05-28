"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Users, FileText, ArrowRightLeft } from "lucide-react"

export function MembershipFAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you'll continue to have access until the end of your current billing period.",
      icon: <HelpCircle className="h-5 w-5 text-red-400" />,
    },
    {
      question: "What happens if I have multiple children?",
      answer:
        "The Starter Plan includes 1 personalized learning plan. The Core Plan supports up to 3 student profiles, and the Power Plan offers unlimited student profiles. Each child gets their own personalized dashboard, progress tracking, and curriculum recommendations.",
      icon: <Users className="h-5 w-5 text-blue-400" />,
    },
    {
      question: "Is this aligned with state regulations?",
      answer:
        "Yes, our platform is designed to help you meet state homeschooling requirements. We provide guidance specific to your state's regulations and can help you with documentation, reporting, and compliance needs. Our curriculum recommendations are aligned with state standards.",
      icon: <FileText className="h-5 w-5 text-gray-400" />,
    },
    {
      question: "How do I switch plans later?",
      answer:
        "You can upgrade or downgrade your plan at any time from your account settings. When upgrading, you'll get immediate access to the new features. When downgrading, the change will take effect at the start of your next billing cycle.",
      icon: <ArrowRightLeft className="h-5 w-5 text-purple-400" />,
    },
  ]

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold flex items-center justify-center gap-2 mb-10">
        <HelpCircle className="h-7 w-7 text-purple-500" /> Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl overflow-hidden">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-800 last:border-b-0">
            <button
              onClick={() => toggleItem(index)}
              className="flex items-center justify-between w-full p-6 text-left"
            >
              <div className="flex items-center gap-3">
                {faq.icon}
                <span className="text-lg font-medium">{faq.question}</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  openItem === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openItem === index ? "max-h-96 pb-6 px-6" : "max-h-0"
              }`}
            >
              <p className="text-gray-400 pl-10">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
