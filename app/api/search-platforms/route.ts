import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

// Debug environment on module load
console.log('\n🔍 DEBUG: API ROUTE MODULE LOADED')
console.log('📊 Environment Check:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
  NEXT_RUNTIME: process.env.NEXT_RUNTIME || 'not set'
})

// Example JSON structure for GPT reference
const EXAMPLE_JSON_RESPONSE = [
  {
    "name": "Example Academy",
    "description": "A comprehensive learning platform with interactive content.",
    "price": "$19.99/month (Free trial available)",
    "url": "https://example.com",
    "strengths": [
      "Adaptive learning technology",
      "Comprehensive progress tracking",
      "Interactive content"
    ],
    "considerations": [
      "Requires stable internet connection",
      "Parent setup needed initially"
    ],
    "why_this_platform": "This platform is particularly well-suited for your child because it aligns with their visual learning style and allows for the moderate parent involvement you prefer. The self-paced nature supports your goal of early graduation while maintaining high academic standards.",
    "age_range": "Grades 6-12",
    "curriculum_focus": "STEM with emphasis on practical applications",
    "budget_fit": "Within your $167/subject monthly budget"
  }
]

// Function to extract JSON from response text
function extractJSONFromText(text: string): string {
  console.log('🔍 Attempting to extract JSON from text:', text.slice(0, 100) + '...')
  
  // Try to find JSON array pattern
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    console.log('✅ Found JSON array pattern')
    return jsonMatch[0]
  }
  
  // Try to find any JSON-like structure
  const bracketMatch = text.match(/\{[\s\S]*\}/)
  if (bracketMatch) {
    console.log('✅ Found JSON object pattern')
    return `[${bracketMatch[0]}]`
  }
  
  console.log('❌ No JSON pattern found in text')
  throw new Error('No valid JSON found in response')
}

// Function to validate platform data
function validatePlatformData(data: any[]): boolean {
  return data.every(item => 
    typeof item === 'object' &&
    typeof item.name === 'string' &&
    typeof item.description === 'string' &&
    typeof item.price === 'string' &&
    typeof item.url === 'string'
  )
}

// Mock data for different subjects
const MOCK_RESPONSES: Record<string, any[]> = {
  default: [
    {
      name: "Khan Academy",
      description: "Comprehensive online learning platform offering interactive exercises, instructional videos, and a personalized learning dashboard. Perfect for self-paced learning with detailed progress tracking.",
      price: "Free",
      url: "https://www.khanacademy.org",
      strengths: [
        "Self-paced learning structure",
        "Comprehensive video library",
        "Interactive practice exercises",
        "Detailed progress tracking"
      ],
      considerations: [
        "Requires self-motivation",
        "Internet connection needed",
        "Limited teacher interaction"
      ],
      why_this_platform: "Khan Academy's self-paced structure and comprehensive coverage align perfectly with your goal of independent learning while maintaining high academic standards. The platform's detailed progress tracking helps maintain accountability.",
      age_range: "K-12 and beyond",
      curriculum_focus: "Core subjects with emphasis on STEM",
      budget_fit: "Excellent fit - completely free platform"
    },
    {
      name: "IXL Learning",
      description: "Adaptive learning platform covering K-12 subjects with personalized guidance and analytics. Features comprehensive curriculum aligned with state standards.",
      price: "$19.95/month (Free trial available)",
      url: "https://www.ixl.com",
      strengths: [
        "Adaptive technology",
        "Comprehensive analytics",
        "Standards-aligned content",
        "Personalized learning path"
      ],
      considerations: [
        "Monthly subscription cost",
        "May require parent guidance",
        "Best with regular practice"
      ],
      why_this_platform: "IXL's adaptive technology ensures your child is always working at the right level, while the analytics provide the oversight you need for moderate involvement. The structured approach supports academic excellence.",
      age_range: "K-12",
      curriculum_focus: "Core subjects with personalized adaptation",
      budget_fit: "Well within the $167/month budget"
    },
    {
      name: "Outschool",
      description: "Live online classes and activities for K-12 learners. Offers unique, interest-based courses taught by experienced educators in small group settings.",
      price: "Classes start at $10 (Many free trial classes available)",
      url: "https://outschool.com",
      strengths: [
        "Live teacher interaction",
        "Small group settings",
        "Interest-based learning",
        "Flexible scheduling"
      ],
      considerations: [
        "Requires scheduling coordination",
        "Variable pricing per class",
        "Class availability may vary"
      ],
      why_this_platform: "Outschool's live classes provide the structured learning environment you seek while allowing flexibility in scheduling. The small group format ensures personal attention while maintaining peer interaction.",
      age_range: "Ages 3-18",
      curriculum_focus: "Diverse subjects with interest-based approach",
      budget_fit: "Variable cost, but can fit within $167/month budget with careful class selection"
    }
  ],
  math: [
    {
      name: "Beast Academy Online",
      description: "Engaging, comic-based math curriculum for grades 2-5. Features challenging problems and interactive tools to develop deep mathematical thinking.",
      price: "$15/month (14-day free trial)",
      url: "https://beastacademy.com"
    },
    {
      name: "Prodigy Math Game",
      description: "Math learning platform disguised as an engaging RPG game. Adapts to student level and aligns with school curriculum.",
      price: "Free (Premium features available)",
      url: "https://www.prodigygame.com"
    },
    {
      name: "CTC Math",
      description: "Comprehensive K-12 math curriculum with video lessons and interactive exercises. Includes detailed progress reports and parent dashboard.",
      price: "$29.97/month family plan (1-year access)",
      url: "https://www.ctcmath.com"
    }
  ],
  science: [
    {
      name: "Mystery Science",
      description: "Ready-made science lessons with engaging videos and hands-on activities. Perfect for elementary and middle school with minimal prep required.",
      price: "$99/year",
      url: "https://mysteryscience.com"
    },
    {
      name: "Generation Genius",
      description: "Science videos and lessons aligned with NGSS standards. Includes teacher guides, activities, and assessments.",
      price: "$95/year (Free trial available)",
      url: "https://www.generationgenius.com"
    },
    {
      name: "Science4Us",
      description: "Interactive K-2 science curriculum covering physical science, life science, and earth/space science. Includes offline activities.",
      price: "$7.95/month per student",
      url: "https://www.science4us.com"
    }
  ],
  reading: [
    {
      name: "Reading Eggs",
      description: "Learn-to-read program combining scientific research with interactive activities. Features placement test and progress tracking.",
      price: "$9.99/month (30-day free trial)",
      url: "https://readingeggs.com"
    },
    {
      name: "Epic!",
      description: "Digital library for kids with thousands of books, learning videos, and quizzes. Personalized recommendations based on reading level.",
      price: "$7.99/month (30-day free trial)",
      url: "https://www.getepic.com"
    },
    {
      name: "Lexia Core5",
      description: "Research-proven reading program providing explicit, systematic instruction. Adapts in real-time based on student performance.",
      price: "Contact for pricing (Demo available)",
      url: "https://www.lexialearning.com"
    }
  ]
}

// Function to get mock response based on search query
function getMockResponse(query: string): any[] {
  // Convert query to lowercase for matching
  const queryLower = query.toLowerCase()
  
  // Check for subject-specific keywords
  if (queryLower.includes('math') || queryLower.includes('mathematics') || queryLower.includes('algebra')) {
    return MOCK_RESPONSES.math
  }
  if (queryLower.includes('science') || queryLower.includes('biology') || queryLower.includes('chemistry')) {
    return MOCK_RESPONSES.science
  }
  if (queryLower.includes('reading') || queryLower.includes('literacy') || queryLower.includes('language')) {
    return MOCK_RESPONSES.reading
  }
  
  // Default response if no specific subject matched
  return MOCK_RESPONSES.default
}

// Validate environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
console.log('🔑 OpenAI API Key Check:', {
  present: !!OPENAI_API_KEY,
  length: OPENAI_API_KEY?.length || 0,
  prefix: OPENAI_API_KEY?.slice(0, 3) || 'none',
  format: OPENAI_API_KEY?.startsWith('sk-') ? 'valid' : 'invalid',
  // Safely show part of the key for debugging
  preview: OPENAI_API_KEY ? `${OPENAI_API_KEY.slice(0, 10)}...${OPENAI_API_KEY.slice(-4)}` : 'none'
})

if (!OPENAI_API_KEY) {
  console.error('❌ CRITICAL: OPENAI_API_KEY is not set in environment variables')
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

if (!OPENAI_API_KEY.startsWith('sk-')) {
  console.error('❌ CRITICAL: OPENAI_API_KEY format appears invalid (should start with sk-)')
}

// Initialize OpenAI client
let openai: OpenAI
try {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  })
  console.log('✅ OpenAI client initialized successfully')
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error)
  throw error
}

// Request counter for debugging multiple calls
let requestCounter = 0

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  requestCounter++
  const requestId = `req_${Date.now()}_${requestCounter}`
  
  console.log(`\n🚀 ROUTE HIT! [${requestId}] ${new Date().toISOString()}`)
  
  try {
    const body = await request.json()
    const { searchQuery } = body
    
    try {
      // First attempt with strict JSON formatting
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a specialized educational platform recommendation API that provides detailed, personalized suggestions.
IMPORTANT: 
- Respond with ONLY valid JSON array
- Return MAXIMUM 4 platforms
- Each platform MUST have ALL fields from the example structure
- Make recommendations specific to the user's needs
- Consider the $167 per subject monthly budget
- Ensure "why_this_platform" is unique and specific for each platform
- Focus on value proposition and educational outcomes
- Include clear budget analysis in recommendations

The JSON must exactly match this structure:
${JSON.stringify(EXAMPLE_JSON_RESPONSE, null, 2)}

Required fields for each platform:
- name: String (platform name)
- description: String (2-3 sentences max)
- price: String (with trial info if available)
- url: String (main homepage URL)
- strengths: Array of 3-5 key strengths
- considerations: Array of 2-3 important considerations
- why_this_platform: String (UNIQUE explanation for this specific case)
- age_range: String (suitable grade/age range)
- curriculum_focus: String (main educational focus)
- budget_fit: String (analysis of cost vs budget)

NO additional fields or explanatory text allowed.
ONLY return the JSON array.`
          },
          {
            role: "user",
            content: `Search: "${searchQuery}"

Return up to 4 educational platforms as JSON array.
Remember:
1. ONLY return the JSON array
2. NO explanatory text
3. Must match example structure exactly
4. Must be valid JSON
5. Each platform must have a UNIQUE "why_this_platform" explanation
6. Consider the $167/subject monthly budget limit
7. Focus on educational outcomes and value`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })
      
      const rawResponse = response.choices[0]?.message?.content
      console.log('📝 Raw GPT Response:', rawResponse)
      
      if (!rawResponse) {
        throw new Error('Empty response from OpenAI')
      }
      
      let jsonData: any[]
      
      try {
        // First try direct JSON parse
        jsonData = JSON.parse(rawResponse)
        console.log('✅ Successfully parsed JSON directly')
      } catch (parseError) {
        console.log('⚠️ Direct JSON parse failed, attempting to extract JSON from text')
        
        // Try to extract JSON from response text
        const extractedJson = extractJSONFromText(rawResponse)
        jsonData = JSON.parse(extractedJson)
        console.log('✅ Successfully parsed extracted JSON')
      }
      
      // Validate the data structure
      if (!Array.isArray(jsonData)) {
        throw new Error('Response is not an array')
      }
      
      if (!validatePlatformData(jsonData)) {
        throw new Error('Response does not match required platform data structure')
      }
      
      // Format the results
      const results = jsonData.map((p, index) => ({
        id: index + 1,
        name: p.name,
        description: p.description,
        price: p.price,
        url: p.url,
        strengths: p.strengths || [],
        considerations: p.considerations || [],
        why_this_platform: p.why_this_platform || "",
        age_range: p.age_range || "",
        curriculum_focus: p.curriculum_focus || "",
        budget_fit: p.budget_fit || ""
      }))
      
      return NextResponse.json({ results })
      
    } catch (openaiError: any) {
      console.error(`💥 OpenAI API Error [${requestId}]:`, {
        name: openaiError.name,
        message: openaiError.message,
        status: openaiError.status
      })
      
      if (openaiError.status === 429) {
        console.error(`🚫 QUOTA EXCEEDED [${requestId}]`)
        console.error('To fix this issue:')
        console.error('1. Visit https://platform.openai.com/account/usage')
        console.error('2. Check your current usage and limits')
        console.error('3. Verify your payment method is valid')
        console.error('4. Consider upgrading your plan if needed')
        
        // Use mock response instead
        console.log('📚 Using mock response system as temporary fallback')
        const mockResults = getMockResponse(searchQuery)
        const results = mockResults.map((p, index) => ({
          id: index + 1,
          ...p
        }))
        
        return NextResponse.json({ 
          results,
          notice: "Using cached recommendations while API is unavailable"
        })
      }
      
      // If first attempt failed, try again with even stricter prompt
      try {
        console.log('🔄 First attempt failed, trying with stricter prompt...')
        
        const retryResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `CRITICAL: You are a JSON generator. ONLY output valid JSON arrays.
NO OTHER TEXT ALLOWED. NO EXPLANATIONS.
MUST match this EXACT structure:
${JSON.stringify(EXAMPLE_JSON_RESPONSE, null, 2)}`
            },
            {
              role: "user",
              content: `${searchQuery}

OUTPUT FORMAT:
[
  {
    "name": "Platform Name",
    "description": "Platform description",
    "price": "Price info",
    "url": "https://example.com"
  }
]

RULES:
- ONLY JSON
- NO other text
- 3 platforms only
- Must be valid JSON`
            }
          ],
          temperature: 0.5,
          max_tokens: 1000,
        })
        
        const retryRawResponse = retryResponse.choices[0]?.message?.content
        console.log('📝 Retry Raw Response:', retryRawResponse)
        
        if (!retryRawResponse) {
          throw new Error('Empty response from retry attempt')
        }
        
        const jsonData = JSON.parse(extractJSONFromText(retryRawResponse))
        
        if (!Array.isArray(jsonData) || !validatePlatformData(jsonData)) {
          throw new Error('Retry response does not match required structure')
        }
        
        const results = jsonData.map((p, index) => ({
          id: index + 1,
          name: p.name,
          description: p.description,
          price: p.price,
          url: p.url
        }))
        
        return NextResponse.json({ results })
        
      } catch (retryError) {
        console.error('💥 Retry attempt also failed:', retryError)
        throw openaiError // Throw original error
      }
    }
    
  } catch (error) {
    const endTime = Date.now()
    console.error(`💥 Request failed after ${endTime - startTime}ms:`, {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error)
    })
    
    // Use basic fallback as last resort
    return NextResponse.json({
      results: MOCK_RESPONSES.default.map((p, index) => ({
        id: index + 1,
        ...p
      })),
      error: 'An unexpected error occurred',
      notice: "Using fallback recommendations"
    }, {
      status: error instanceof Error && error.message.includes('OPENAI_API_KEY') ? 500 : 400
    })
  }
} 