"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPlatformForCourse } from "@/lib/platform-mappings"
import { BookOpen, ExternalLink, Search, Loader2 } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import OpenAI from 'openai'

interface PlatformResult {
  id: number
  name: string
  description: string
  price: string
  url: string
}

interface CoursePlatformCardProps {
  subject: string
  course: string
  platformUrl?: string
  needPlatformHelp?: boolean | null
  onPlatformSelect?: (url: string) => void
  onHelpToggle?: (needsHelp: boolean) => void
  parentId?: string
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const supabase = createClientComponentClient()

// Add learningStyle state at the top level
let globalLearningStyle = 'hands-on activities'

// Helper function to validate URLs
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch (e) {
    return false
  }
}

// Add fetchLearningStyle at the top level
const fetchLearningStyle = async (parentId: string): Promise<string> => {
  console.log('🔍 fetchLearningStyle started with parentId:', parentId)
  
  if (!parentId) {
    console.log('❌ No parentId provided, using default')
    globalLearningStyle = 'hands-on activities'
    return 'hands-on activities'
  }
  
  try {
    console.log('📡 Querying parent_intake_form table...')
    
    const { data, error } = await supabase
      .from('parent_intake_form')
      .select('structure_preference')
      .eq('parent_id', parentId)
      .limit(1)
      .single()
    
    console.log('📊 Supabase query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data && data.structure_preference) {
      // Convert structure_preference to learning style for the prompt
      const learningStyleMap: Record<string, string> = {
        'balance': 'balanced learning approaches',
        'structured': 'structured activities', 
        'flexible': 'flexible methods',
        'independent': 'independent study'
      }
      
      const learningStyle = learningStyleMap[data.structure_preference] || data.structure_preference
      console.log('✅ Found structure preference:', data.structure_preference)
      console.log('✅ Using learning style:', learningStyle)
      globalLearningStyle = learningStyle
      return learningStyle
    } else {
      console.log('⚠️ No structure preference found, using default')
      globalLearningStyle = 'hands-on activities'
      return 'hands-on activities'
    }
  } catch (error) {
    console.log('💥 Error in fetchLearningStyle:', error)
    globalLearningStyle = 'hands-on activities'
    return 'hands-on activities'
  }
}

// Generate personalized prompt using client-side OpenAI
const generatePersonalizedPrompt = async (parentId: string, subject: string, course: string): Promise<string> => {
  try {
    console.log('Fetching data for parentId:', parentId)
    
    // Fetch parent data using client-side Supabase (where auth works)
    const [intakeResult, assessmentResult] = await Promise.allSettled([
      supabase
        .from('parent_intake_form')
        .select('learning_style, educational_goals, other_goal, outcome_level, structure_preference, educational_values, parent_involvement, education_budget')
        .eq('parent_id', parentId)
        .maybeSingle(),
      supabase
        .from('parent_onboarding_assessment')
        .select('child_age_grade, learning_style, parent_involvement')
        .eq('parent_id', parentId)
        .maybeSingle()
    ])
    
    const intakeData = intakeResult.status === 'fulfilled' ? intakeResult.value.data : null
    const assessmentData = assessmentResult.status === 'fulfilled' ? assessmentResult.value.data : null
    
    console.log('Client-side fetched intakeData:', intakeData)
    console.log('Client-side fetched assessmentData:', assessmentData)
    
    if (!intakeData && !assessmentData) {
      return `Find a ${subject} platform for ${course} that fits my 9th grader who learns best through ${globalLearningStyle}. My goal is early graduation with an associate's degree at a proficient level. I prefer structured independence with minimal parent involvement and value STEM excellence. My budget is approximately $50 per subject based on my $200/month education budget across 4 daily blocks.`
    }
    
    // Calculate budget per subject
    const dailyBlocks = 4
    const totalBudget = intakeData?.education_budget || 200
    const budgetPerBlock = totalBudget / dailyBlocks
    
    const systemPrompt = `You are a helpful assistant that creates personalized homeschool platform search requests. Transform the given parent preferences into a natural, conversational search request.`
    
    const userPrompt = `Create a personalized search request for finding a ${subject} platform for a ${course} course using these parent preferences:

PARENT PREFERENCES:
- Child Age/Grade: ${assessmentData?.child_age_grade || 'Not specified'}
- Learning Style: ${intakeData?.learning_style || assessmentData?.learning_style || 'Not specified'}
- Educational Goals: ${intakeData?.educational_goals || 'Not specified'}${intakeData?.other_goal ? ' (' + intakeData.other_goal + ')' : ''}
- Outcome Level: ${intakeData?.outcome_level || 'Not specified'}
- Structure Preference: ${intakeData?.structure_preference || 'Not specified'}
- Educational Values: ${intakeData?.educational_values || 'Not specified'}
- Parent Involvement Preference: ${intakeData?.parent_involvement || assessmentData?.parent_involvement || 'Not specified'}
- Budget per subject: $${budgetPerBlock.toFixed(0)} (from total budget of $${totalBudget}/month ÷ ${dailyBlocks} daily time blocks)

Write in first person as if the parent is speaking. Make it conversational and natural. Include specific preferences that would help in platform selection. Keep it 2-3 sentences maximum.

EXAMPLE: "Find a Language Arts platform for Reading that fits my 9th grader who learns best through hands-on activities. My goal is early graduation with an associate's degree at a proficient level. I prefer structured independence with minimal parent involvement and value STEM excellence. My budget is approximately $50 per subject based on my $200/month education budget across 4 daily blocks."

Create a similar request for ${subject} - ${course}:`
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })
    
    return response.choices[0]?.message?.content || `Find a ${subject} platform for ${course} that fits my 9th grader who learns best through ${globalLearningStyle}. My goal is early graduation with an associate's degree at a proficient level. I prefer structured independence with minimal parent involvement and value STEM excellence. My budget is approximately $50 per subject based on my $200/month education budget across 4 daily blocks.`
    
  } catch (error) {
    console.error('Error generating personalized prompt:', error)
    return `Find a ${subject} platform for ${course} that fits my 9th grader who learns best through ${globalLearningStyle}. My goal is early graduation with an associate's degree at a proficient level. I prefer structured independence with minimal parent involvement and value STEM excellence. My budget is approximately $50 per subject based on my $200/month education budget across 4 daily blocks.`
  }
}

export function CoursePlatformCard({
  subject,
  course,
  platformUrl,
  needPlatformHelp,
  onPlatformSelect,
  onHelpToggle,
  parentId,
}: CoursePlatformCardProps) {
  const [url, setUrl] = useState(platformUrl || "")
  const [title, setTitle] = useState(course || subject)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<PlatformResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [promptGenerated, setPromptGenerated] = useState(false)

  // Load default platform URL if none provided
  useEffect(() => {
    if (!platformUrl) {
      getPlatformForCourse(subject, course).then(defaultPlatform => {
        if (defaultPlatform?.url) {
          setUrl(defaultPlatform.url)
        }
      })
    }
  }, [subject, course, platformUrl])

  // Fetch learning style when component mounts
  useEffect(() => {
    console.log('=== LEARNING STYLE DEBUG START ===')
    console.log('Component mounted with parentId:', parentId)
    console.log('Subject:', subject, 'Course:', course)
    
    if (parentId) {
      console.log('Calling fetchLearningStyle with parentId:', parentId)
      fetchLearningStyle(parentId).then(result => {
        console.log('fetchLearningStyle completed with result:', result)
        console.log('globalLearningStyle is now:', globalLearningStyle)
      })
    } else {
      console.log('No parentId provided, skipping fetchLearningStyle')
    }
    console.log('=== LEARNING STYLE DEBUG END ===')
  }, [parentId])

  // Generate initial prompt when search opens
  useEffect(() => {
    if (showSearch && !promptGenerated && !isValidUrl(url)) {
      generateInitialPrompt()
    }
  }, [showSearch, promptGenerated, url])

  const generateInitialPrompt = async () => {
    setIsGeneratingPrompt(true)
    
    if (!parentId) {
      setSearchQuery(`Find a ${subject} platform for ${course} that fits my 9th grader who learns best through ${globalLearningStyle}. My goal is early graduation with an associate's degree at a proficient level. I prefer structured independence with minimal parent involvement and value STEM excellence. My budget is approximately $50 per subject based on my $200/month education budget across 4 daily blocks.`)
      setPromptGenerated(true)
      setIsGeneratingPrompt(false)
      return
    }
    
    const personalizedPrompt = await generatePersonalizedPrompt(parentId, subject, course)
    setSearchQuery(personalizedPrompt)
    setPromptGenerated(true)
    setIsGeneratingPrompt(false)
  }

  // Handle platform selection
  const handlePlatformSelect = () => {
    if (onPlatformSelect && isValidUrl(url)) {
      onPlatformSelect(url)
    }
  }

  // Handle external link click
  const handleExternalLinkClick = () => {
    if (isValidUrl(url)) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  // Get fallback results when API fails
  const getFallbackResults = (): PlatformResult[] => {
    return [
      {
        id: 1,
        name: "Khan Academy",
        description: "Free comprehensive educational platform with structured courses and interactive exercises.",
        price: "Free",
        url: "https://khanacademy.org"
      },
      {
        id: 2,
        name: "IXL Learning",
        description: "Personalized learning platform with comprehensive curriculum and adaptive technology.",
        price: "$19.95/month",
        url: "https://ixl.com"
      }
    ]
  }

  // Handle platform search using API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setShowResults(false)
    
    try {
      const response = await fetch('/api/search-platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchQuery })
      })
      const data = await response.json()
      setSearchResults(data.results)
      setShowResults(true)
    } catch (error) {
      console.error('Error searching platforms:', error)
      setSearchResults(getFallbackResults())
      setShowResults(true)
    }
    
    setIsSearching(false)
  }

  // Handle selecting a platform from search results
  const handleSelectPlatform = (platform: PlatformResult) => {
    if (onPlatformSelect) {
      setUrl(platform.url)
      onPlatformSelect(platform.url)
      setShowSearch(false)
      setShowResults(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:border-red-500/30 transition-all">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
          <BookOpen className="h-4 w-4 text-red-400" />
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">{subject}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 p-3 pt-0">
        <div className="flex justify-between w-full">
          {isValidUrl(url) ? (
            <Button
              size="sm"
              className="text-xs bg-green-600 hover:bg-green-700 text-white w-full"
              onClick={handleExternalLinkClick}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit Platform
            </Button>
          ) : (
            <Button
              size="sm"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white w-full"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-3 w-3 mr-1" />
              Use GPT to Find Platform
            </Button>
          )}
        </div>

        {/* Search expansion section */}
        {showSearch && !isValidUrl(url) && (
          <div className="mt-3 p-4 bg-gray-700 rounded-lg border-t border-gray-600 transition-all duration-200">
            {/* Search Input Section */}
            <div className="space-y-3">
              <textarea
                value={isGeneratingPrompt ? "Personalizing your search based on your preferences..." : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isGeneratingPrompt}
                placeholder={isGeneratingPrompt ? "Generating personalized search..." : "What kind of platform are you looking for? (e.g., 'interactive Bible study for teens')"}
                className={`w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isGeneratingPrompt ? 'animate-pulse' : ''}`}
                rows={4}
              />
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching || isGeneratingPrompt}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full transition-colors"
                size="sm"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-3 w-3 mr-2" />
                    Search Platforms
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            {showResults && (
              <div className="mt-4 space-y-2 transition-all duration-200">
                <h4 className="text-sm font-medium text-white mb-2">Recommended Platforms:</h4>
                {searchResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="p-3 bg-gray-800 rounded border border-gray-600 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-white text-sm">{result.name}</h5>
                        <p className="text-gray-400 text-xs mt-1">{result.description}</p>
                        <span className="text-green-400 text-xs mt-1 block">{result.price}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white ml-3 text-xs"
                        onClick={() => handleSelectPlatform(result)}
                      >
                        Use This
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
