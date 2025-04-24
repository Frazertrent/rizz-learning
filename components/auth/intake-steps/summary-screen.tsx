"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, ArrowRight, Star } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function SummaryScreen({ formData }) {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-transparent bg-clip-text">
          You've Just Built the Blueprint
        </h1>
        <div className="inline-flex items-center bg-green-600/20 px-4 py-2 rounded-full mb-6">
          <CheckCircle className="text-green-500 mr-2" size={20} />
          <span className="text-green-400 font-medium">Setup Complete</span>
        </div>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Here's what we've learned — and how we'll turn your vision into a working system.
        </p>
      </div>

      <Card className="bg-gray-900/60 border-gray-800 shadow-xl mb-12">
        <CardContent className="p-8 text-lg">
          <p className="text-gray-300 mb-6">
            Based on your responses, we've crafted a personalized educational blueprint for{" "}
            <span className="text-purple-400 font-medium">your child</span>. Your vision emphasizes{" "}
            <span className="text-blue-400 font-medium">personalized education and skill development</span>, with a{" "}
            <span className="text-green-400 font-medium">100%</span> home-based learning approach.
          </p>
          <p className="text-gray-300 mb-6">
            You've chosen to structure your academic year using a{" "}
            <span className="text-yellow-400 font-medium">traditional school-aligned calendar</span> with terms of
            approximately <span className="text-orange-400 font-medium">9 weeks</span>. Your weekly schedule will focus
            on a <span className="text-pink-400 font-medium">flexible weekly schedule</span>, utilizing{" "}
            <span className="text-blue-400 font-medium">recommended tools</span> to deliver engaging content.
          </p>
          <p className="text-gray-300">
            For your child's learning experience, you've indicated a preference for a mentor who is
            <span className="text-red-400 font-medium"> supportive and encouraging</span>. This will be paired with a{" "}
            <span className="text-teal-400 font-medium">balance</span> approach to structure, emphasizing{" "}
            <span className="text-teal-400 font-medium">balanced learning approach</span>.
          </p>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-center">🔓 Unlock Your Plan & Start Building</h2>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
          Choose the membership that fits your needs — and start using your personalized curriculum, weekly schedule,
          and homeschool tools right away.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <motion.div
            className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl border border-gray-800 p-6 shadow-lg"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-2">Starter Plan</h3>
            <div className="text-3xl font-bold text-white mb-4">
              $9<span className="text-gray-400 text-sm font-normal">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>Access to curriculum builder</li>
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>Weekly schedule planner</li>
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>Upload & feedback tools</li>
            </ul>
            <Link href="/checkout?plan=starter">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Get Starter Plan <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border border-gray-800 p-6 shadow-lg relative"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
            <div className="text-3xl font-bold text-white mb-4">
              $19<span className="text-gray-400 text-sm font-normal">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>Everything in Starter</li>
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>+ AI-generated curriculum suggestions</li>
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>+ XP + streak tracking</li>
            </ul>
            <Link href="/checkout?plan=pro">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Get Pro Plan <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            className="bg-gradient-to-br from-pink-900/40 to-orange-900/40 rounded-xl border border-gray-800 p-6 shadow-lg relative"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute -top-3 -right-3 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" /> Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Plan</h3>
            <div className="text-3xl font-bold text-white mb-4">
              $29<span className="text-gray-400 text-sm font-normal">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>Everything in Pro</li>
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>+ GPT assistant for feedback & lesson ideas</li>
              <li className="flex items-start text-gray-300"><span className="text-green-500 mr-2">•</span>+ Priority support</li>
            </ul>
            <Link href="/checkout?plan=premium">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white">
                Get Premium Plan <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-gray-400 mb-4">Not sure yet? Download your blueprint and explore more later.</p>
        <Button
          variant="outline"
          className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white mb-2"
        >
          <Download size={16} className="mr-2" /> Download Summary PDF
        </Button>
        <p className="text-gray-500 text-sm">You'll still be able to sign in anytime and pick up where you left off.</p>
      </div>
    </div>
  )
}
