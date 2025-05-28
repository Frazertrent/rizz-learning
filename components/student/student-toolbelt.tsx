"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Book, Brain, Lightbulb, Target, Clock, Calendar } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Subject {
  id: string
  name: string
  tools: Tool[]
}

interface Tool {
  id: string
  name: string
  description: string
  type: "Practice" | "Study" | "Resource"
  url: string
  icon: string
  subjects: string[]
}

export function StudentToolbelt() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showGptModal, setShowGptModal] = useState(false)
  const [gptQuestion, setGptQuestion] = useState("")
  const { toast } = useToast()

  // Fetch subjects and tools from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('name')

        if (subjectsError) throw subjectsError

        // Fetch tools
        const { data: toolsData, error: toolsError } = await supabase
          .from('tools')
          .select('*')
          .order('name')

        if (toolsError) throw toolsError

        // Group tools by subject
        const subjectsWithTools = subjectsData.map(subject => ({
          ...subject,
          tools: toolsData.filter(tool => tool.subjects.includes(subject.id))
        }))

        setSubjects(subjectsWithTools)
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAskGpt = async () => {
    try {
      // Save the question to Supabase
      const { error } = await supabase
        .from('gpt_questions')
        .insert({
          user_id: 'current_user_id', // Replace with actual user ID
          question: gptQuestion,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Question Saved",
        description: "Your question has been saved and will be answered soon.",
      })

      setGptQuestion("")
      setShowGptModal(false)
    } catch (err) {
      console.error('Error saving question:', err)
      toast({
        title: "Error",
        description: "Failed to save question. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your toolbelt...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error loading toolbelt: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Learning Toolbelt</h1>
        <Button onClick={() => setShowGptModal(true)}>
          <MessageSquare className="mr-2 h-4 w-4" />
                  Ask GPT
                </Button>
              </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {subjects.map((subject) => (
            <div key={subject.id} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{subject.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subject.tools.map((tool) => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {tool.name}
                        <Badge variant={tool.type === "Practice" ? "default" : tool.type === "Study" ? "secondary" : "outline"}>
                          {tool.type}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        {tool.type === "Practice" && <Target className="h-4 w-4" />}
                        {tool.type === "Study" && <Book className="h-4 w-4" />}
                        {tool.type === "Resource" && <Brain className="h-4 w-4" />}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          Open Tool
                        </a>
                  </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="practice">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.flatMap(subject => 
              subject.tools
                .filter(tool => tool.type === "Practice")
                .map(tool => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {tool.name}
                        <Badge>Practice</Badge>
                      </CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">{subject.name}</Badge>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          Start Practice
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
        </TabsContent>

        <TabsContent value="study">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.flatMap(subject => 
              subject.tools
                .filter(tool => tool.type === "Study")
                .map(tool => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {tool.name}
                        <Badge variant="secondary">Study</Badge>
                      </CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">{subject.name}</Badge>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          Study Now
                        </a>
                  </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.flatMap(subject => 
              subject.tools
                .filter(tool => tool.type === "Resource")
                .map(tool => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {tool.name}
                        <Badge variant="outline">Resource</Badge>
                      </CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">{subject.name}</Badge>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          View Resource
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
                          )}
                        </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showGptModal} onOpenChange={setShowGptModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask GPT</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={gptQuestion}
              onChange={(e) => setGptQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="h-24 w-full resize-none rounded bg-gray-700 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleAskGpt} className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask Question
                            </Button>
                        </div>
        </DialogContent>
      </Dialog>
      </div>
  )
}
