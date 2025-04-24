"use client"

import { motion } from "framer-motion"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface IntroScreenProps {
  onBegin: () => void
}

export function IntroScreen({ onBegin }: IntroScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gradient-to-b from-gray-900 to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-3xl mx-auto overflow-hidden border border-gray-700/50"
      >
        <CardHeader className="text-center pb-2 pt-8 px-6 md:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              You're Right Where You Need to Be
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 md:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="max-w-[700px] text-center space-y-4">
              <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                You're here because you care deeply about your child — enough to shape their education around who they
                truly are. That is the most powerful place to start.
              </p>
              <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                No one knows your child better than you do. That makes <em>you</em> the most qualified person on the
                planet to guide their learning. And we're honored to support you in this meaningful journey.
              </p>
              <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                This short intake will help us get to know your goals, your child, and your preferred approach. You're
                welcome to complete as much or as little as you'd like. The more we learn, the better we can tailor
                recommendations and automate the experience for you later on.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center pt-4"
          >
            <Button
              onClick={onBegin}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-8 py-6 rounded-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Let's Begin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full filter blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-500/10 rounded-full filter blur-[100px]"></div>
        </CardContent>
      </motion.div>
    </div>
  )
}
