"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, MessageSquare, Save, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Question {
  id: string
  text: string
  subject: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  expectedLength: number
  hints: string[]
  rubric: string[]
}

export function LongAnswerPractice() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch questions from Supabase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)

        const { data: questionsData, error: questionsError } = await supabase
          .from('practice_questions')
          .select('*')
          .eq('type', 'long_answer')
          .order('created_at')

        if (questionsError) throw questionsError

        setQuestions(questionsData as Question[] || [])
        setAnswers(Array(questionsData?.length || 0).fill(""))
        setError(null)
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowCompletionDialog(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleReset = () => {
    setCurrentQuestionIndex(0)
    setAnswers(Array(questions.length).fill(""))
    setShowCompletionDialog(false)
  }

  const handleSaveProgress = async () => {
    try {
      const { error } = await supabase
        .from('practice_progress')
        .insert({
          user_id: 'current_user_id', // Replace with actual user ID
          question_id: currentQuestion.id,
          answer: answers[currentQuestionIndex],
          completed: false,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Progress Saved",
        description: "Your answer has been saved successfully.",
      })
    } catch (err) {
      console.error('Error saving progress:', err)
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error loading questions: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <p>No practice questions available.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Long Answer Practice</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
            </div>
            <Progress value={progress} className="w-1/3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question:</h3>
            <p className="text-gray-200">{currentQuestion.text}</p>
            {currentQuestion.hints && currentQuestion.hints.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Hints:</h4>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
        </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Answer:</h3>
            <Textarea
              value={answers[currentQuestionIndex]}
              onChange={(e) =>
                setAnswers(answers.map((a, i) => (i === currentQuestionIndex ? e.target.value : a)))
              }
              placeholder="Type your answer here..."
              className="min-h-[200px] bg-gray-700 text-white border-transparent focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSaveProgress}>
              <Save className="mr-2 h-4 w-4" />
              Save Progress
            </Button>
            <Button onClick={handleNext}>
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Complete Practice
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Practice Complete!</DialogTitle>
            <DialogDescription>
              You completed {questions.length} questions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Would you like to review your answers or start a new practice session?</p>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              New Session
            </Button>
            <Button onClick={() => setCurrentQuestionIndex(0)}>
              Review Answers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
