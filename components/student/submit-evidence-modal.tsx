"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileUp, PenSquare, CheckCircle2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"

interface SubmitEvidenceModalProps {
  isOpen: boolean
  onClose: () => void
  goalTitle: string
}

export default function SubmitEvidenceModal({ isOpen, onClose, goalTitle }: SubmitEvidenceModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleUploadFile = () => {
    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      showSuccessAndClose()

      // Navigate to uploads page after a delay
      setTimeout(() => {
        router.push("/student/uploads")
      }, 2500)
    }, 1500)
  }

  const handleWriteReflection = () => {
    // Navigate to reflection journal
    showSuccessAndClose()

    // Navigate to reflection page after a delay
    setTimeout(() => {
      router.push("/student/reflection")
    }, 2500)
  }

  const showSuccessAndClose = () => {
    // Trigger confetti animation
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Show success message
    setShowSuccess(true)

    // Hide success message and close modal after delay
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-gray-950 border border-gray-800 shadow-xl rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-teal-500/10 to-blue-500/10 pointer-events-none" />

        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
            Submit Evidence for Goal Completion
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence>
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-green-500/20 rounded-full p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  🎉 Proof submitted! Great work finishing this goal!
                </h3>
                <p className="text-gray-300">Your evidence has been recorded.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <p className="text-gray-300 mb-4">How would you like to show evidence for completing "{goalTitle}"?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleUploadFile}
                    disabled={isUploading}
                    className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-auto py-6 rounded-xl flex flex-col items-center justify-center gap-3"
                  >
                    <div className="bg-blue-500/20 rounded-full p-3">
                      <FileUp className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold">Upload File</p>
                      <p className="text-xs text-blue-200 mt-1">Share a document, photo, or screenshot</p>
                    </div>
                    {isUploading && (
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mt-2"></div>
                    )}
                  </Button>

                  <Button
                    onClick={handleWriteReflection}
                    className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-auto py-6 rounded-xl flex flex-col items-center justify-center gap-3"
                  >
                    <div className="bg-purple-500/20 rounded-full p-3">
                      <PenSquare className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold">Write a Reflection</p>
                      <p className="text-xs text-purple-200 mt-1">Share what you learned or accomplished</p>
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!showSuccess && (
          <DialogFooter>
            <Button variant="ghost" onClick={onClose} className="text-gray-300 hover:text-white hover:bg-gray-800">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
