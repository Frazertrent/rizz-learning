"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

interface MentorPersonalityProps {
  formData: {
    mentorPersonality?: string[];
    otherPersonality?: string;
  };
  updateFormData: (data: any) => void;
  editMode?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

export function MentorPersonality({ 
  formData, 
  updateFormData,
  editMode,
  onSave,
  isSaving,
  saveSuccess
}: MentorPersonalityProps) {
  // Add detailed debugging logs
  console.log('📋 MentorPersonality detailed debug:');
  console.log('  - formData:', formData);
  console.log('  - mentorPersonality:', formData.mentorPersonality);
  console.log('  - otherPersonality:', formData.otherPersonality);

  const [personality, setPersonality] = useState<string[]>(formData.mentorPersonality || [])
  const [otherPersonality, setOtherPersonality] = useState(formData.otherPersonality || "")
  const [isInitialRender, setIsInitialRender] = useState(true)

  console.log('  - local state:', {
    personality,
    otherPersonality
  });

  // Add effect to sync with incoming formData changes
  useEffect(() => {
    if (formData) {
      console.log('Updating local state from formData:', formData);
      setPersonality(formData.mentorPersonality || []);
      setOtherPersonality(formData.otherPersonality || "");
    }
  }, [formData]);

  // Effect for updating parent component
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    const updatedData = {
      mentorPersonality: personality,
      otherPersonality,
    };

    console.log('Updating parent formData with:', updatedData);
    updateFormData(updatedData)
  }, [personality, otherPersonality, updateFormData, isInitialRender])

  const handlePersonalityChange = (trait: string) => {
    if (personality.includes(trait)) {
      setPersonality(personality.filter((p) => p !== trait))
    } else {
      setPersonality([...personality, trait])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Mentor Personality</CardTitle>
        <CardDescription className="text-gray-400">
          Choose how you want your AI mentor to interact with your child
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">Select one or more preferred personality styles:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "supportive", label: "Supportive & encouraging" },
              { id: "professional", label: "Professional & objective" },
              { id: "cheerleader", label: "Cheerleader-style motivation" },
              { id: "taskmaster", label: "Straight-to-the-point taskmaster" },
              { id: "challenging", label: "Critically challenging" },
              { id: "other", label: "Other" },
            ].map((trait) => (
              <div key={trait.id} className="flex items-center space-x-2">
                <Checkbox
                  id={trait.id}
                  checked={personality.includes(trait.id)}
                  onCheckedChange={() => handlePersonalityChange(trait.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={trait.id} className="text-gray-300">
                  {trait.label}
                </Label>
              </div>
            ))}
          </div>

          {personality.includes("other") && (
            <div className="mt-2">
              <Label htmlFor="other-personality" className="text-gray-300">
                Please specify:
              </Label>
              <Input
                id="other-personality"
                value={otherPersonality}
                onChange={(e) => setOtherPersonality(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Describe your preferred mentor personality"
              />
            </div>
          )}
        </div>

        {editMode && (
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-800">
            {saveSuccess && (
              <div className="flex items-center text-green-400 mr-4">
                <CheckCircle className="w-5 h-5 mr-2" />
                Changes saved
              </div>
            )}
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </>
  )
}
