"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPlatformForCourse } from "@/lib/platform-mappings"
import { BookOpen, ExternalLink, Search, Loader2 } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

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

// Add learningStyle state at the top level
let globalLearningStyle = 'hands-on activities'
let globalParentInvolvement = 'minimal parent involvement'
let globalEducationalValues = 'STEM excellence'
let globalGradeLevel = 'my child'
let globalEducationalGoals = 'early graduation with an associate\'s degree'
let globalOutcomeLevel = 'proficient level'
let globalEducationBudget = 200
let globalStartTime = '8:00'
let globalEndTime = '15:00'  
let globalBlockLength = 90
let globalBudgetText = 'My budget is approximately $50 per subject based on my $200/month education budget across 4 daily blocks.'

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
      // Format grade level text properly
      let gradeText = data.grade_level.toLowerCase()
      
      // Remove redundant "grader" if present
      gradeText = gradeText.replace(/\s*grader\s*$/i, '')
      
      // Replace "grade" with "Grader"
      gradeText = gradeText.replace(/\s*grade\s*$/i, '')
      
      // Add "Grader" suffix
      const formattedGrade = `my ${gradeText} Grader`
      
      console.log('✅ Found grade level for', data.first_name, ':', data.grade_level)
      console.log('✅ Using formatted grade text:', formattedGrade)
      globalGradeLevel = formattedGrade
      return formattedGrade
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
  // Format educational goals with proper grammar
  const formattedGoals = globalEducationalGoals.includes(',') 
    ? globalEducationalGoals.replace(/,([^,]*)$/, ', and$1')
    : globalEducationalGoals

  return `Find me a ${subject} platform for a ${course} course that fits ${globalGradeLevel} who learns best through ${globalLearningStyle}. My goal is ${formattedGoals} at a ${globalOutcomeLevel}. I prefer structured independence with ${globalParentInvolvement} and value ${globalEducationalValues}. ${globalBudgetText.replace('My budget is approximately', 'My budget limit is approximately')}`
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

const fetchOutcomeLevel = async (parentId: string): Promise<string> => {
  console.log('🔍 fetchOutcomeLevel started with parentId:', parentId)
  
  if (!parentId) {
    console.log('❌ No parentId provided, using default')
    globalOutcomeLevel = 'proficient level'
    return 'proficient level'
  }
  
  try {
    console.log('📡 Querying parent_intake_form for outcome_level...')
    
    const { data, error } = await supabase
      .from('parent_intake_form')
      .select('outcome_level')
      .eq('parent_id', parentId)
      .limit(1)
      .single()
    
    console.log('📊 Outcome level query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data && data.outcome_level) {
      const outcomeText = `${data.outcome_level} level`
      console.log('✅ Found outcome level:', data.outcome_level)
      console.log('✅ Using outcome text:', outcomeText)
      globalOutcomeLevel = outcomeText
      return outcomeText
    } else {
      console.log('⚠️ No outcome level found, using default')
      globalOutcomeLevel = 'proficient level'
      return 'proficient level'
    }
  } catch (error) {
    console.log('💥 Error in fetchOutcomeLevel:', error)
    globalOutcomeLevel = 'proficient level'
    return 'proficient level'
  }
}

const fetchEducationBudget = async (parentId: string): Promise<number> => {
  console.log('🔍 fetchEducationBudget started with parentId:', parentId)
  
  if (!parentId) {
    console.log('❌ No parentId provided, using default')
    globalEducationBudget = 200
    return 200
  }
  
  try {
    console.log('📡 Querying parent_intake_form for education_budget...')
    
    const { data, error } = await supabase
      .from('parent_intake_form')
      .select('education_budget')
      .eq('parent_id', parentId)
      .limit(1)
      .single()
    
    console.log('📊 Education budget query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data && data.education_budget) {
      console.log('✅ Found education budget:', data.education_budget)
      globalEducationBudget = data.education_budget
      return data.education_budget
    } else {
      console.log('⚠️ No education budget found, using default')
      globalEducationBudget = 200
      return 200
    }
  } catch (error) {
    console.log('💥 Error in fetchEducationBudget:', error)
    globalEducationBudget = 200
    return 200
  }
}

const fetchTimeData = async (parentId: string): Promise<{startTime: string, endTime: string, blockLength: number}> => {
  console.log('🔍 fetchTimeData started with parentId:', parentId)
  
  if (!parentId) {
    console.log('❌ No parentId provided, using defaults')
    globalStartTime = '8:00'
    globalEndTime = '15:00'
    globalBlockLength = 90
    return { startTime: '8:00', endTime: '15:00', blockLength: 90 }
  }
  
  try {
    console.log('📡 Querying parent_intake_form for time data...')
    
    const { data, error } = await supabase
      .from('parent_intake_form')
      .select('start_time, end_time, block_length')
      .eq('parent_id', parentId)
      .limit(1)
      .single()
    
    console.log('📊 Time data query completed')
    console.log('📊 Data received:', data)
    console.log('📊 Error received:', error)
    
    if (data) {
      const startTime = data.start_time || '8:00'
      const endTime = data.end_time || '15:00'
      const blockLength = data.block_length || 90
      
      console.log('✅ Found time data - start:', startTime, 'end:', endTime, 'block length:', blockLength)
      globalStartTime = startTime
      globalEndTime = endTime
      globalBlockLength = blockLength
      
      return { startTime, endTime, blockLength }
    } else {
      console.log('⚠️ No time data found, using defaults')
      globalStartTime = '8:00'
      globalEndTime = '15:00'
      globalBlockLength = 90
      return { startTime: '8:00', endTime: '15:00', blockLength: 90 }
    }
  } catch (error) {
    console.log('💥 Error in fetchTimeData:', error)
    globalStartTime = '8:00'
    globalEndTime = '15:00'
    globalBlockLength = 90
    return { startTime: '8:00', endTime: '15:00', blockLength: 90 }
  }
}

const calculateBudget = async (parentId: string): Promise<string> => {
  console.log('🔍 calculateBudget started with parentId:', parentId)
  
  // Wait for both budget and time data to be fetched
  const budgetAmount = await fetchEducationBudget(parentId)
  const timeData = await fetchTimeData(parentId)
  
  console.log('💰 Budget calculation data:', { budgetAmount, timeData })
  
  // Calculate daily hours (convert time strings to minutes)
  const startHour = parseInt(timeData.startTime.split(':')[0])
  const startMinute = parseInt(timeData.startTime.split(':')[1] || '0')
  const endHour = parseInt(timeData.endTime.split(':')[0])  
  const endMinute = parseInt(timeData.endTime.split(':')[1] || '0')
  
  const startTotalMinutes = (startHour * 60) + startMinute
  const endTotalMinutes = (endHour * 60) + endMinute
  const dailyMinutes = endTotalMinutes - startTotalMinutes
  
  console.log('⏰ Time calculation:', { startTotalMinutes, endTotalMinutes, dailyMinutes })
  
  // Calculate number of daily blocks
  const dailyBlocks = Math.round(dailyMinutes / timeData.blockLength)
  
  // Calculate budget per subject
  const budgetPerSubject = Math.round(budgetAmount / dailyBlocks)
  
  console.log('🧮 Final calculation:', { dailyBlocks, budgetPerSubject })
  
  // Create the budget text
  const budgetText = `My budget is approximately $${budgetPerSubject} per subject based on my $${budgetAmount}/month education budget across ${dailyBlocks} daily blocks.`
  
  console.log('✅ Generated budget text:', budgetText)
  globalBudgetText = budgetText
  return budgetText
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
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string | null>(null)

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
      console.log('Fetching all data: learning style, parent involvement, educational values, grade level, educational goals, outcome level, education budget, time data, and calculating budget...')
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
      fetchOutcomeLevel(parentId).then(result => {
        console.log('fetchOutcomeLevel completed with result:', result)
      })
      fetchEducationBudget(parentId).then(result => {
        console.log('fetchEducationBudget completed with result:', result)
      })
      fetchTimeData(parentId).then(result => {
        console.log('fetchTimeData completed with result:', result)
      })
      calculateBudget(parentId).then(result => {
        console.log('calculateBudget completed with result:', result)
      })
    } else {
      console.log('No parentId provided, skipping data fetch')
    }
    console.log('=== PARENT DATA DEBUG END ===')
  }, [parentId, studentId])

  // Generate initial prompt when search opens
  useEffect(() => {
    if (showSearch && !promptGenerated && !isValidUrl(url)) {
      console.log('🔄 Triggering initial prompt generation', {
        showSearch,
        promptGenerated,
        url,
        subject,
        course
      })
      generateInitialPrompt()
    }
  }, [showSearch, promptGenerated, url])

  const generateInitialPrompt = async () => {
    console.log('🎯 Starting generateInitialPrompt', {
      parentId,
      subject,
      course
    })
    
    try {
      setIsGeneratingPrompt(true)
      const prompt = await generatePersonalizedPrompt(parentId || '', subject, course)
      console.log('✨ Generated personalized prompt:', prompt)
      
      // Store the generated prompt
      setLastGeneratedPrompt(prompt)
      setSearchQuery(prompt)
      setPromptGenerated(true)
      
      console.log('📡 Making API request to /api/search-platforms')
      const response = await fetch('/api/search-platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: prompt
        })
      })
      
      console.log('📥 API response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
      
      const data = await response.json()
      console.log('📦 API response data:', data)
      
      if (!response.ok) {
        console.error('❌ API request failed:', {
          status: response.status,
          error: data.error
        })
        throw new Error(data.error || 'Failed to search platforms')
      }
      
      if (!data.results || !Array.isArray(data.results)) {
        console.error('❌ Invalid API response format:', data)
        throw new Error('Invalid response format from server')
      }
      
      console.log('✅ Setting search results:', data.results)
      setSearchResults(data.results)
      setShowResults(true)
    } catch (error) {
      console.error('💥 Error in generateInitialPrompt:', error)
      
      // Even if API call fails, keep the generated prompt visible
      if (lastGeneratedPrompt) {
        console.log('⚠️ Using last generated prompt:', lastGeneratedPrompt)
        setSearchQuery(lastGeneratedPrompt)
      } else {
        // Generate a fallback prompt if no last prompt exists
        const fallbackPrompt = await generatePersonalizedPrompt(parentId || '', subject, course)
        console.log('⚠️ Using fallback prompt:', fallbackPrompt)
        setSearchQuery(fallbackPrompt)
      }
      
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
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
    // Format educational goals with proper grammar
    const formattedGoals = globalEducationalGoals.includes(',') 
      ? globalEducationalGoals.replace(/,([^,]*)$/, ', and$1')
      : globalEducationalGoals

    const prompt = `Find me a ${subject} platform for a ${course} course that fits ${globalGradeLevel} who learns best through ${globalLearningStyle}. My goal is ${formattedGoals} at a ${globalOutcomeLevel}. I prefer structured independence with ${globalParentInvolvement} and value ${globalEducationalValues}. ${globalBudgetText.replace('My budget is approximately', 'My budget limit is approximately')}`
    
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
    console.log('🔍 Starting platform search', {
      subject,
      course,
      parentId,
      currentQuery: searchQuery
    })
    
    setIsSearching(true)
    setSearchResults([])
    setError(null)

    try {
      // Use existing search query if it exists, otherwise generate new one
      const searchPrompt = searchQuery || await generatePersonalizedPrompt(parentId || '', subject, course)
      console.log('✨ Using search prompt:', searchPrompt)
      
      // Store the prompt being used
      setLastGeneratedPrompt(searchPrompt)
      setSearchQuery(searchPrompt)
      
      // Call the server-side API endpoint
      console.log('📡 Making API request to /api/search-platforms')
      const response = await fetch('/api/search-platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: searchPrompt
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search platforms')
      }
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid response format from server')
      }
      
      setSearchResults(data.results)
      setShowResults(true)
      
      // If this was a mock response, show a notice
      if (data.notice) {
        console.log('ℹ️ Using mock data:', data.notice)
      }
      
    } catch (error) {
      console.error('💥 Error searching platforms:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      
      // Keep the search query visible even if search fails
      if (lastGeneratedPrompt) {
        setSearchQuery(lastGeneratedPrompt)
      }
      
      setSearchResults(getFallbackResults())
      setShowResults(true)
    } finally {
      setIsSearching(false)
    }
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
            <div className="space-y-4">
              <textarea
                value={isGeneratingPrompt ? "Personalizing your search based on your preferences..." : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isGeneratingPrompt}
                placeholder={isGeneratingPrompt ? "Generating personalized search..." : "What kind of platform are you looking for? (e.g., 'interactive Bible study for teens')"}
                className={`w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] ${isGeneratingPrompt ? 'animate-pulse' : ''}`}
                rows={5}
              />
              
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded text-red-200 text-sm">
                  {error}
                </div>
              )}
              
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching || isGeneratingPrompt}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full transition-colors py-6"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching for the Perfect Platform...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    {searchResults.length > 0 ? 'Search Again' : 'Find Personalized Platform Recommendations'}
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            {showResults && (
              <div className="mt-4 space-y-4 transition-all duration-200">
                {/* Conversation Header */}
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <h4 className="text-sm font-medium text-white mb-2">AI Tutor Recommendations</h4>
                  <p className="text-gray-300 text-sm">
                    Based on your {globalGradeLevel} student who prefers {globalLearningStyle} learning approaches, here are my carefully selected recommendations for {subject} {course}:
                  </p>
                </div>

                {/* Platform Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-blue-500/30 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Platform Header */}
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-white">{result.name}</h5>
                          <span className="text-green-400 text-sm">{result.price}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm">{result.description}</p>

                        {/* Pros and Cons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <h6 className="text-green-400 text-xs font-medium mb-1">Strengths</h6>
                            <ul className="text-gray-300 text-xs space-y-1">
                              <li>• Aligns with {globalLearningStyle} learning</li>
                              <li>• Supports {globalOutcomeLevel} mastery</li>
                              <li>• Fits {globalParentInvolvement} approach</li>
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-yellow-400 text-xs font-medium mb-1">Considerations</h6>
                            <ul className="text-gray-300 text-xs space-y-1">
                              <li>• {result.price === "Free" ? "Limited advanced features" : "Requires subscription"}</li>
                              <li>• May need initial setup time</li>
                              <li>• Parent guidance recommended</li>
                            </ul>
                          </div>
                        </div>

                        {/* Why This Platform */}
                        <div className="pt-2">
                          <h6 className="text-blue-400 text-xs font-medium mb-1">Why This Platform</h6>
                          <p className="text-gray-300 text-xs">
                            This platform particularly excels for {globalGradeLevel} students focused on {subject}. 
                            It aligns with your goals of {globalEducationalGoals} while maintaining {globalParentInvolvement}.
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="pt-3 flex justify-end">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => handleSelectPlatform(result)}
                          >
                            Select This Platform
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison Summary */}
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                  <h4 className="text-sm font-medium text-white mb-2">Platform Comparison Summary</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Here's how these platforms compare for your specific needs:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="col-span-1 font-medium text-white">Feature</div>
                    {searchResults.slice(0, 2).map((result) => (
                      <div key={result.id} className="col-span-1 font-medium text-white">{result.name}</div>
                    ))}
                    {/* Comparison Rows */}
                    <div className="col-span-1 text-gray-400">Price</div>
                    {searchResults.slice(0, 2).map((result) => (
                      <div key={result.id} className="col-span-1 text-gray-300">{result.price}</div>
                    ))}
                    <div className="col-span-1 text-gray-400">Learning Style</div>
                    {searchResults.slice(0, 2).map((result) => (
                      <div key={result.id} className="col-span-1 text-gray-300">{globalLearningStyle}</div>
                    ))}
                    <div className="col-span-1 text-gray-400">Parent Involvement</div>
                    {searchResults.slice(0, 2).map((result) => (
                      <div key={result.id} className="col-span-1 text-gray-300">{globalParentInvolvement}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
