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
  studentId?: string
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const supabase = createClientComponentClient()

// Add learningStyle state at the top level
let globalLearningStyle = 'hands-on activities'
let globalParentInvolvement = 'minimal parent involvement'
let globalEducationalValues = 'STEM excellence'
let globalGradeLevel = 'my child'
let globalEducationalGoals = 'early graduation with an associate\'s degree'

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

const fetchParentInvolvement = async (parentId: string): Promise<string> => {
  console.log('🔍 fetchParentInvolvement started with parentId:', parentId)
  
  if (!parentId) {
    console.log('❌ No parentId provided, using default')
    globalParentInvolvement = 'minimal parent involvement'
    return 'minimal parent involvement'
  }
  
  try {
    console.log('📡 Querying parent_intake_form for parent_involvement...')
    
    const { data, error } = await supabase
      .from('parent_intake_form')
      .select('parent_involvement')
      .eq('parent_id', parentId)
      .limit(1)
      .single()
    
    console.log('📊 Parent involvement query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data && data.parent_involvement) {
      const involvementText = `${data.parent_involvement} parent involvement`
      console.log('✅ Found parent involvement:', data.parent_involvement)
      console.log('✅ Using involvement text:', involvementText)
      globalParentInvolvement = involvementText
      return involvementText
    } else {
      console.log('⚠️ No parent involvement found, using default')
      globalParentInvolvement = 'minimal parent involvement'
      return 'minimal parent involvement'
    }
  } catch (error) {
    console.log('💥 Error in fetchParentInvolvement:', error)
    globalParentInvolvement = 'minimal parent involvement'
    return 'minimal parent involvement'
  }
}

const fetchEducationalValues = async (parentId: string): Promise<string> => {
  console.log('🔍 fetchEducationalValues started with parentId:', parentId)
  
  if (!parentId) {
    console.log('❌ No parentId provided, using default')
    globalEducationalValues = 'STEM excellence'
    return 'STEM excellence'
  }
  
  try {
    console.log('📡 Querying parent_intake_form for educational_values...')
    
    const { data, error } = await supabase
      .from('parent_intake_form')
      .select('educational_values')
      .eq('parent_id', parentId)
      .limit(1)
      .single()
    
    console.log('📊 Educational values query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data && data.educational_values) {
      // Convert array of values to readable text
      let valuesArray = data.educational_values
      
      // Handle if it's a string that looks like an array
      if (typeof valuesArray === 'string') {
        try {
          valuesArray = JSON.parse(valuesArray)
        } catch (e) {
          console.log('Could not parse educational_values as JSON, using as string')
          valuesArray = [valuesArray]
        }
      }
      
      const valuesText = Array.isArray(valuesArray) ? valuesArray.join(' and ') : valuesArray
      console.log('✅ Found educational values:', data.educational_values)
      console.log('✅ Using values text:', valuesText)
      globalEducationalValues = valuesText
      return valuesText
    } else {
      console.log('⚠️ No educational values found, using default')
      globalEducationalValues = 'STEM excellence'
      return 'STEM excellence'
    }
  } catch (error) {
    console.log('💥 Error in fetchEducationalValues:', error)
    globalEducationalValues = 'STEM excellence'
    return 'STEM excellence'
  }
}

// Update fetchGradeLevel function
const fetchGradeLevel = async (parentId: string, studentId?: string): Promise<string> => {
  console.log('🔍 fetchGradeLevel started with parentId:', parentId, 'studentId:', studentId)
  
  if (!parentId || !studentId) {
    console.log('❌ No parentId or studentId provided, using default')
    globalGradeLevel = 'my child'
    return 'my child'
  }
  
  try {
    console.log('📡 Querying student table for specific student grade_level...')
    
    const { data, error } = await supabase
      .from('student')
      .select('grade_level, first_name, id')
      .eq('id', studentId)  // Query by specific student ID
      .single()
    
    console.log('📊 Grade level query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data && data.grade_level) {
      const gradeText = `my ${data.grade_level} grader`
      console.log('✅ Found grade level for', data.first_name, ':', data.grade_level)
      console.log('✅ Using grade text:', gradeText)
      globalGradeLevel = gradeText
      return gradeText
    } else {
      console.log('⚠️ No grade level found, using default')
      globalGradeLevel = 'my child'
      return 'my child'
    }
  } catch (error) {
    console.log('💥 Error in fetchGradeLevel:', error)
    globalGradeLevel = 'my child'
    return 'my child'
  }
}

// Generate personalized prompt using client-side OpenAI
const generatePersonalizedPrompt = async (parentId: string, subject: string, course: string): Promise<string> => {
  try {
    console.log('Fetching data for parentId:', parentId)
    
    // Default prompt if no parent data is available
    return `Find a ${subject} platform for ${course} that fits ${globalGradeLevel} who learns best through ${globalLearningStyle}. My goal is ${globalEducationalGoals} at a proficient level. I prefer structured independence with ${globalParentInvolvement} and value ${globalEducationalValues}.`
  } catch (error) {
    console.error('Error in generatePersonalizedPrompt:', error)
    // Fallback prompt
    return `Find a ${subject} platform for ${course} that fits ${globalGradeLevel} who learns best through ${globalLearningStyle}. My goal is ${globalEducationalGoals} at a proficient level. I prefer structured independence with ${globalParentInvolvement} and value ${globalEducationalValues}.`
  }
}

// Add fetchEducationalGoals function
const fetchEducationalGoals = async (parentId: string): Promise<string> => {
  console.log('🔍 fetchEducationalGoals started with parentId:', parentId)
  
  if (!parentId) {
    console.log('❌ No parentId provided, using default')
    globalEducationalGoals = 'early graduation with an associate\'s degree'
    return 'early graduation with an associate\'s degree'
  }
  
  try {
    console.log('📡 Querying term_plans table for goals...')
    
    const { data, error } = await supabase
      .from('term_plans')
      .select('goals')
      .eq('user_id', parentId)
      .limit(1)
      .single()
    
    console.log('📊 Educational goals query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data && data.goals) {
      // Convert array of goals to readable text
      let goalsArray = data.goals
      
      // Handle if it's a string that looks like an array
      if (typeof goalsArray === 'string') {
        try {
          goalsArray = JSON.parse(goalsArray)
        } catch (e) {
          console.log('Could not parse goals as JSON, using as string')
          goalsArray = [goalsArray]
        }
      }
      
      // Convert goals array to natural sentence
      const goalsText = Array.isArray(goalsArray) 
        ? goalsArray.join(', ').toLowerCase()
        : goalsArray.toLowerCase()
      
      console.log('✅ Found educational goals:', data.goals)
      console.log('✅ Using goals text:', goalsText)
      globalEducationalGoals = goalsText
      return goalsText
    } else {
      console.log('⚠️ No educational goals found, using default')
      globalEducationalGoals = 'early graduation with an associate\'s degree'
      return 'early graduation with an associate\'s degree'
    }
  } catch (error) {
    console.log('💥 Error in fetchEducationalGoals:', error)
    globalEducationalGoals = 'early graduation with an associate\'s degree'
    return 'early graduation with an associate\'s degree'
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
  studentId
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
  const [error, setError] = useState<string | null>(null)

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

  // Update useEffect
  useEffect(() => {
    console.log('=== PARENT DATA DEBUG START ===')
    console.log('Component mounted with parentId:', parentId, 'studentId:', studentId)
    console.log('Subject:', subject, 'Course:', course)
    
    if (parentId) {
      console.log('Fetching all data: learning style, parent involvement, educational values, grade level, and educational goals...')
      fetchLearningStyle(parentId).then(result => {
        console.log('fetchLearningStyle completed with result:', result)
      })
      fetchParentInvolvement(parentId).then(result => {
        console.log('fetchParentInvolvement completed with result:', result)
      })
      fetchEducationalValues(parentId).then(result => {
        console.log('fetchEducationalValues completed with result:', result)
      })
      fetchGradeLevel(parentId, studentId).then(result => {
        console.log('fetchGradeLevel completed with result:', result)
      })
      fetchEducationalGoals(parentId).then(result => {
        console.log('fetchEducationalGoals completed with result:', result)
      })
    } else {
      console.log('No parentId provided, skipping data fetch')
    }
    console.log('=== PARENT DATA DEBUG END ===')
  }, [parentId, studentId])

  // Generate initial prompt when search opens
  useEffect(() => {
    if (showSearch && !promptGenerated && !isValidUrl(url)) {
      generateInitialPrompt()
    }
  }, [showSearch, promptGenerated, url])

  const generateInitialPrompt = async () => {
    try {
      setIsGeneratingPrompt(true)
      const prompt = await generatePersonalizedPrompt(parentId || '', subject, course)
      console.log('Generated prompt:', prompt)
      
      // EXAMPLE: "Find a Language Arts platform for Reading that fits my child who learns best through hands-on activities. My goal is early graduation with an associate's degree at a proficient level. I prefer structured independence with minimal parent involvement and value STEM excellence."
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that recommends educational platforms and resources for homeschooling families."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const generatedPrompt = response.choices[0]?.message?.content || `Find a ${subject} platform for ${course} that fits ${globalGradeLevel} who learns best through ${globalLearningStyle}. My goal is ${globalEducationalGoals} at a proficient level. I prefer structured independence with ${globalParentInvolvement} and value ${globalEducationalValues}.`
      
      console.log('Setting search query to:', generatedPrompt)
      setSearchQuery(generatedPrompt)
      setPromptGenerated(true)
    } catch (error) {
      console.error('Error in generateInitialPrompt:', error)
      const fallbackPrompt = `Find a ${subject} platform for ${course} that fits ${globalGradeLevel} who learns best through ${globalLearningStyle}. My goal is ${globalEducationalGoals} at a proficient level. I prefer structured independence with ${globalParentInvolvement} and value ${globalEducationalValues}.`
      console.log('Setting fallback search query:', fallbackPrompt)
      setSearchQuery(fallbackPrompt)
      setPromptGenerated(true)
    } finally {
      setIsGeneratingPrompt(false)
    }
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
    setIsSearching(true)
    setSearchResults([])
    setError(null)

    try {
      setSearchQuery(`Find a ${subject} platform for ${course} that fits ${globalGradeLevel} who learns best through ${globalLearningStyle}. My goal is ${globalEducationalGoals} at a proficient level. I prefer structured independence with ${globalParentInvolvement} and value ${globalEducationalValues}.`)
      
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
