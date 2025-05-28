"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { FlashcardViewer } from "./flashcard-viewer"
import { FlashcardSelector } from "./flashcard-selector"
import { FlashcardCompletionModal } from "./flashcard-completion-modal"
import { FlashcardChatModal } from "./flashcard-chat-modal"
import { FlashcardTagEditor } from "./flashcard-tag-editor"
import { FlashcardListView } from "./flashcard-list-view"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Sparkles, List, MessageSquare, Tag, CheckCircle, Brain, Shuffle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Types
export interface Flashcard {
  id: string
  front: string
  back: string
  tags: string[]
  difficulty: "again" | "hard" | "good" | "easy" | null
}

export interface FlashcardSet {
  id: string
  name: string
  tags: string[]
  cards: Flashcard[]
  source: string
  dateCreated: string
}

export function FlashcardStudy() {
  // Sample flashcard sets
  const sampleFlashcardSets: FlashcardSet[] = [
    {
      id: "1",
      name: "World War II Overview",
      tags: ["History", "WWII", "Homework"],
      source: "History Textbook Chapter 7",
      dateCreated: "2023-04-15",
      cards: [
        {
          id: "1-1",
          front: "When did World War II begin?",
          back: "World War II began on September 1, 1939, when Nazi Germany invaded Poland.",
          tags: ["Date", "Beginning"],
          difficulty: null,
        },
        {
          id: "1-2",
          front: "Who were the main Axis Powers?",
          back: "The main Axis Powers were Nazi Germany, Imperial Japan, and Fascist Italy.",
          tags: ["Axis Powers", "Countries"],
          difficulty: null,
        },
        {
          id: "1-3",
          front: "What was D-Day?",
          back: "D-Day (June 6, 1944) was the Allied invasion of Normandy, France, which began the liberation of Western Europe from Nazi control.",
          tags: ["Operation", "Allied Forces"],
          difficulty: null,
        },
        {
          id: "1-4",
          front: "What was the Holocaust?",
          back: "The Holocaust was the systematic, state-sponsored persecution and murder of six million Jews and millions of others by the Nazi regime and its allies.",
          tags: ["Genocide", "Nazi Germany"],
          difficulty: null,
        },
        {
          id: "1-5",
          front: "When did World War II end?",
          back: "World War II ended in Europe on May 8, 1945 (V-E Day) and in Asia on September 2, 1945 (V-J Day) with the surrender of Japan.",
          tags: ["Date", "Ending"],
          difficulty: null,
        },
      ],
    },
    {
      id: "2",
      name: "Algebra Fundamentals",
      tags: ["Math", "Algebra", "Study Guide"],
      source: "Math Textbook Chapter 3",
      dateCreated: "2023-04-10",
      cards: [
        {
          id: "2-1",
          front: "What is the quadratic formula?",
          back: "x = (-b ± √(b² - 4ac)) / 2a, where ax² + bx + c = 0",
          tags: ["Formula", "Quadratic"],
          difficulty: null,
        },
        {
          id: "2-2",
          front: "What does FOIL stand for in algebra?",
          back: "FOIL stands for First, Outer, Inner, Last - a method for multiplying two binomials.",
          tags: ["Method", "Binomials"],
          difficulty: null,
        },
        {
          id: "2-3",
          front: "What is a linear equation?",
          back: "A linear equation is an equation that forms a straight line when graphed, typically in the form y = mx + b, where m is the slope and b is the y-intercept.",
          tags: ["Definition", "Linear"],
          difficulty: null,
        },
      ],
    },
    {
      id: "3",
      name: "Biology Cell Structure",
      tags: ["Science", "Biology", "Cells"],
      source: "Biology Textbook Chapter 4",
      dateCreated: "2023-04-05",
      cards: [
        {
          id: "3-1",
          front: "What is the function of mitochondria?",
          back: "Mitochondria are the powerhouses of the cell, generating most of the cell's supply of ATP (energy).",
          tags: ["Organelle", "Function"],
          difficulty: null,
        },
        {
          id: "3-2",
          front: "What is the difference between prokaryotic and eukaryotic cells?",
          back: "Prokaryotic cells lack a nucleus and membrane-bound organelles, while eukaryotic cells have a nucleus and membrane-bound organelles.",
          tags: ["Cell Types", "Comparison"],
          difficulty: null,
        },
        {
          id: "3-3",
          front: "What is the function of the cell membrane?",
          back: "The cell membrane (plasma membrane) regulates what enters and exits the cell and maintains the cell's integrity.",
          tags: ["Membrane", "Function"],
          difficulty: null,
        },
        {
          id: "3-4",
          front: "What is the endoplasmic reticulum?",
          back: "The endoplasmic reticulum (ER) is a network of membranes involved in protein synthesis (rough ER) and lipid synthesis (smooth ER).",
          tags: ["Organelle", "Function"],
          difficulty: null,
        },
      ],
    },
  ]

  const router = useRouter()

  // State
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [showTagEditor, setShowTagEditor] = useState(false)
  const [showListView, setShowListView] = useState(false)
  const [shuffleCards, setShuffleCards] = useState(false)
  const [missedCardsOnly, setMissedCardsOnly] = useState(false)
  const [studyCards, setStudyCards] = useState<Flashcard[]>([])
  const [cardStats, setCardStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  // Add new state for the quiz button tooltip
  const [showQuizTooltip, setShowQuizTooltip] = useState(false)

  // Function to handle clicking the "Quiz Me Instead" button
  const handleQuizButtonClick = () => {
    if (!selectedSet) {
      setShowQuizTooltip(true)
      setTimeout(() => setShowQuizTooltip(false), 3000)
    } else {
      // Navigate directly to practice tests page
      router.push(`/student/practice-tests?setId=${selectedSet.id}&setName=${encodeURIComponent(selectedSet.name)}`)
    }
  }

  // Effect to set the selected flashcard set
  useEffect(() => {
    if (selectedSetId) {
      const set = sampleFlashcardSets.find((set) => set.id === selectedSetId) || null
      setSelectedSet(set)

      if (set) {
        // Reset study session
        setCurrentCardIndex(0)
        setIsFlipped(false)
        setCardStats({
          again: 0,
          hard: 0,
          good: 0,
          easy: 0,
        })

        // Prepare cards based on settings
        let cards = [...set.cards]
        if (shuffleCards) {
          cards = shuffleArray(cards)
        }
        setStudyCards(cards)
      }
    }
  }, [selectedSetId, shuffleCards])

  // Effect to update study cards when missedCardsOnly changes
  useEffect(() => {
    if (selectedSet) {
      if (missedCardsOnly) {
        const missed = studyCards.filter((card) => card.difficulty === "again" || card.difficulty === "hard")
        if (missed.length > 0) {
          setStudyCards(missed)
          setCurrentCardIndex(0)
          setIsFlipped(false)
        } else {
          // If no missed cards, show all cards
          setMissedCardsOnly(false)
        }
      } else {
        // Reset to all cards
        let cards = [...selectedSet.cards]
        if (shuffleCards) {
          cards = shuffleArray(cards)
        }
        setStudyCards(cards)
        setCurrentCardIndex(0)
        setIsFlipped(false)
      }
    }
  }, [missedCardsOnly])

  // Helper function to shuffle array
  const shuffleArray = (array: any[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handleFlip()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFlipped])

  // Handle difficulty rating
  const handleDifficultyRating = (difficulty: "again" | "hard" | "good" | "easy") => {
    if (studyCards.length === 0) return

    // Update card difficulty
    const updatedCards = [...studyCards]
    updatedCards[currentCardIndex].difficulty = difficulty
    setStudyCards(updatedCards)

    // Update stats
    setCardStats({
      ...cardStats,
      [difficulty]: cardStats[difficulty] + 1,
    })

    // Move to next card
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      // End of deck
      setShowCompletionModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex flex-col mb-4 md:mb-0">
            <div className="flex items-center">
              <Link href="/student" className="mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">🧠 Flashcards</h1>
              <Badge className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Sparkles className="h-3 w-3 mr-1" /> Powered by AI
              </Badge>
            </div>
            <p className="text-gray-400 mt-1">Study your materials with smart, auto-generated cards.</p>
          </div>

          {/* Flashcard Set Selector */}
          <div className="w-full md:w-auto">
            <FlashcardSelector
              flashcardSets={sampleFlashcardSets}
              selectedSetId={selectedSetId}
              onSelectSet={setSelectedSetId}
            />
          </div>
        </div>

        {selectedSet ? (
          <>
            {/* Study Mode Toggles */}
            <div className="flex flex-wrap justify-between gap-4 mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch id="shuffle" checked={shuffleCards} onCheckedChange={setShuffleCards} />
                  <label htmlFor="shuffle" className="text-sm flex items-center cursor-pointer">
                    <Shuffle className="h-4 w-4 mr-1" /> Shuffle Cards
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="missed" checked={missedCardsOnly} onCheckedChange={setMissedCardsOnly} />
                  <label htmlFor="missed" className="text-sm flex items-center cursor-pointer">
                    <AlertCircle className="h-4 w-4 mr-1" /> Practice Missed Cards Only
                  </label>
                </div>
              </div>

              <div className="relative">
                <Button variant="outline" size="sm" className="text-sm" onClick={handleQuizButtonClick}>
                  <Brain className="h-4 w-4 mr-1" /> Quiz Me Instead
                </Button>

                {/* Tooltip for when no flashcard set is selected */}
                <AnimatePresence>
                  {showQuizTooltip && (
                    <motion.div
                      className="absolute -bottom-12 right-0 bg-red-900/90 text-white text-sm py-2 px-3 rounded-lg flex items-center whitespace-nowrap"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Please select a flashcard set first!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Flashcard Viewer */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {studyCards.length > 0 && (
                  <>
                    {/* Progress Tracker */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          {currentCardIndex + 1} of {studyCards.length} cards
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          initial={{ width: "0%" }}
                          animate={{ width: `${(currentCardIndex / studyCards.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Flashcard */}
                    <FlashcardViewer card={studyCards[currentCardIndex]} isFlipped={isFlipped} onFlip={handleFlip} />

                    {/* Memory Feedback Buttons */}
                    <AnimatePresence>
                      {isFlipped && (
                        <motion.div
                          className="grid grid-cols-4 gap-3 mt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            className="py-6 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0"
                            onClick={() => handleDifficultyRating("again")}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-lg mb-1">🔁</span>
                              <span className="font-medium">Again</span>
                              <span className="text-xs opacity-80 mt-1">Didn't remember</span>
                            </div>
                          </Button>

                          <Button
                            className="py-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0"
                            onClick={() => handleDifficultyRating("hard")}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-lg mb-1">🟧</span>
                              <span className="font-medium">Hard</span>
                              <span className="text-xs opacity-80 mt-1">Tough to remember</span>
                            </div>
                          </Button>

                          <Button
                            className="py-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0"
                            onClick={() => handleDifficultyRating("good")}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-lg mb-1">🟩</span>
                              <span className="font-medium">Good</span>
                              <span className="text-xs opacity-80 mt-1">I remembered</span>
                            </div>
                          </Button>

                          <Button
                            className="py-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
                            onClick={() => handleDifficultyRating("easy")}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-lg mb-1">🔵</span>
                              <span className="font-medium">Easy</span>
                              <span className="text-xs opacity-80 mt-1">Super easy</span>
                            </div>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>

              {/* Study Tools Panel */}
              <div className="w-full lg:w-64 bg-gray-800/50 rounded-xl p-4">
                <h3 className="font-medium mb-4 text-gray-300">Study Tools</h3>
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                    onClick={() => setShowListView(!showListView)}
                  >
                    <List className="h-4 w-4 mr-2" />
                    View Full Card List
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                    onClick={() => setShowChatModal(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Card Set to Chat
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                    onClick={() => setShowTagEditor(true)}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Edit Tags
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
                    onClick={() => setShowCompletionModal(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Deck Complete
                  </Button>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-3 text-gray-300">Set Details</h3>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p>
                      <span className="text-gray-500">Source:</span> {selectedSet.source}
                    </p>
                    <p>
                      <span className="text-gray-500">Created:</span> {selectedSet.dateCreated}
                    </p>
                    <p>
                      <span className="text-gray-500">Cards:</span> {selectedSet.cards.length}
                    </p>
                    <div className="pt-2">
                      <span className="text-gray-500 block mb-1">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedSet.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-gray-700/50 hover:bg-gray-700 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Button */}
            <div className="fixed bottom-6 right-6">
              <Button
                className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4"
                onClick={() => setShowChatModal(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask GPT About These Cards
              </Button>
            </div>

            {/* Footer Navigation */}
            <div className="mt-12 pt-6 border-t border-gray-800 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/student" className="hover:text-white transition-colors">
                Back to Dashboard
              </Link>
              <Link href="/student/uploads" className="hover:text-white transition-colors">
                View Uploads
              </Link>
              <Link href="/student/chat" className="hover:text-white transition-colors">
                Open GPT Chat
              </Link>
              <Link href="/student/assignments" className="hover:text-white transition-colors">
                See Assignments
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Brain className="h-12 w-12 text-gray-600" />
            </div>
            <h2 className="text-xl font-medium mb-2">Select a flashcard set to begin</h2>
            <p className="text-gray-400 max-w-md">
              Choose a set from the dropdown above to start studying with AI-generated flashcards.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCompletionModal && selectedSet && (
          <FlashcardCompletionModal
            stats={cardStats}
            totalCards={studyCards.length}
            onClose={() => setShowCompletionModal(false)}
            onRetryMissed={() => {
              setMissedCardsOnly(true)
              setShowCompletionModal(false)
            }}
            onReturnToDashboard={() => {
              router.push("/student")
            }}
          />
        )}

        {showChatModal && selectedSet && (
          <FlashcardChatModal flashcardSet={selectedSet} onClose={() => setShowChatModal(false)} />
        )}

        {showTagEditor && selectedSet && (
          <FlashcardTagEditor
            flashcardSet={selectedSet}
            onClose={() => setShowTagEditor(false)}
            onSave={(tags) => {
              // In a real app, this would update the tags in the database
              console.log("Saving tags:", tags)
              setShowTagEditor(false)
            }}
          />
        )}

        {showListView && selectedSet && (
          <FlashcardListView
            flashcardSet={selectedSet}
            currentIndex={currentCardIndex}
            onSelectCard={(index) => {
              setCurrentCardIndex(index)
              setIsFlipped(false)
              setShowListView(false)
            }}
            onClose={() => setShowListView(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
