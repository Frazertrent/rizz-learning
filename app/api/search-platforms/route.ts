import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { searchQuery } = await request.json()
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Based on this search request: "${searchQuery}"
        
        Please recommend 3 educational platforms/resources. For each recommendation, provide:
        1. Platform name
        2. Brief description (1-2 sentences)
        3. Estimated price
        4. Website URL
        
        Format as JSON array with fields: name, description, price, url`
      }],
      max_tokens: 500,
      temperature: 0.7,
    })
    
    const gptResponse = response.choices[0]?.message?.content
    
    try {
      const platforms = JSON.parse(gptResponse || '[]')
      const results = platforms.map((p: any, index: number) => ({
        id: index + 1,
        name: p.name,
        description: p.description,
        price: p.price,
        url: p.url
      }))
      
      return NextResponse.json({ results })
    } catch (parseError) {
      // Fallback results
      return NextResponse.json({
        results: [
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
      })
    }
    
  } catch (error) {
    console.error('Error searching platforms:', error)
    return NextResponse.json({
      results: [
        {
          id: 1,
          name: "Khan Academy",
          description: "Free comprehensive educational platform",
          price: "Free", 
          url: "https://khanacademy.org"
        }
      ]
    })
  }
} 