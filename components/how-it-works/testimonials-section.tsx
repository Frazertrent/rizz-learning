"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const testimonials = [
    {
      quote: "This changed everything for us. My son is *so* much more motivated.",
      name: "Sarah K.",
      role: "Parent of 2",
      avatar: "👩‍👦‍👦",
      color: "bg-purple-600",
    },
    {
      quote: "The AI feedback gave me back HOURS each week.",
      name: "Michael T.",
      role: "Homeschool Dad",
      avatar: "👨‍👧",
      color: "bg-indigo-600",
    },
    {
      quote: "Feels like having a co-teacher that never gets tired.",
      name: "Jennifer L.",
      role: "Parent & Educator",
      avatar: "👩‍🏫",
      color: "bg-pink-600",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("testimonials")?.offsetTop || 0

      if (scrollPosition > elementPosition) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isVisible) {
      // Auto-advance testimonials
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)

    // Reset the interval when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 5000)
    }
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)

    // Reset the interval when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 5000)
    }
  }

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">What Parents Are Saying</h2>
          <p className="mx-auto max-w-2xl text-lg text-purple-200">
            Hear from families who are using our platform to transform their homeschooling experience.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-1 shadow-2xl">
            <div className="relative rounded-xl bg-slate-900/90 p-8">
              <div className="absolute -left-2 -top-2 text-5xl opacity-20">"</div>

              <div className="relative min-h-[200px]">
                {testimonials.map((testimonial, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: 100 }}>
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{
                        opacity: currentIndex === index ? 1 : 0,
                        x: currentIndex === index ? 0 : 100,
                      }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute inset-0 ${currentIndex === index ? "block" : "hidden"}`}
                    >
                      <div className="mb-6 text-center text-xl text-purple-100 md:text-2xl">{testimonial.quote}</div>

                      <div className="flex items-center justify-center">
                        <div
                          className={`mr-4 flex h-14 w-14 items-center justify-center rounded-full ${testimonial.color} text-3xl`}
                        >
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-white">{testimonial.name}</div>
                          <div className="text-sm text-purple-300">{testimonial.role}</div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-8 rounded-full transition-all ${
                      currentIndex === index ? "bg-purple-500" : "bg-slate-700"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute -left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 md:-left-6"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute -right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 md:-right-6"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
