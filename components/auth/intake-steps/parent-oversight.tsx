"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

interface ParentOversightProps {
  formData: {
    parentInvolvement?: string;
    oversightPreferences?: string[];
  };
  updateFormData: (data: any) => void;
  editMode?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

export function ParentOversight({ 
  formData, 
  updateFormData,
  editMode,
  onSave,
  isSaving,
  saveSuccess
}: ParentOversightProps) {
  // Add detailed debugging logs
  console.log('📋 ParentOversight detailed debug:');
  console.log('  - formData:', formData);
  console.log('  - parentInvolvement:', formData.parentInvolvement);
  console.log('  - oversightPreferences:', formData.oversightPreferences);

  const [involvement, setInvolvement] = useState(formData.parentInvolvement || "active")
  const [preferences, setPreferences] = useState<string[]>(formData.oversightPreferences || [])
  const [isInitialRender, setIsInitialRender] = useState(true)

  console.log('  - local state:', {
    involvement,
    preferences
  });

  // Add effect to sync with incoming formData changes
  useEffect(() => {
    if (formData) {
      console.log('Updating local state from formData:', formData);
      setInvolvement(formData.parentInvolvement || "active");
      setPreferences(formData.oversightPreferences || []);
    }
  }, [formData]);

  // Effect for updating parent component
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    const updatedData = {
      parentInvolvement: involvement,
      oversightPreferences: preferences,
    };

    console.log('Updating parent formData with:', updatedData);
    updateFormData(updatedData)
  }, [involvement, preferences, updateFormData, isInitialRender])

  const handlePreferenceChange = (preference: string) => {
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter((p) => p !== preference))
    } else {
      setPreferences([...preferences, preference])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Parent Oversight</CardTitle>
        <CardDescription className="text-gray-400">
          Define your involvement preferences in your child's education
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">How involved will you be?</Label>
          <RadioGroup value={involvement} onValueChange={setInvolvement} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" className="border-gray-600 text-blue-600" />
              <Label htmlFor="active" className="text-gray-300">
                Actively engaged daily
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" className="border-gray-600 text-blue-600" />
              <Label htmlFor="weekly" className="text-gray-300">
                Weekly review only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="minimal" className="border-gray-600 text-blue-600" />
              <Label htmlFor="minimal" className="text-gray-300">
                Minimal – delegate to AI
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" className="border-gray-600 text-blue-600" />
              <Label htmlFor="flexible" className="text-gray-300">
                Flexible
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Preferences:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "grade", label: "I want to grade assignments" },
              { id: "enforce", label: "I want GPT to enforce quality and request revisions" },
              { id: "alerts", label: "I want alerts when tasks are missed" },
              { id: "bad-guy", label: "I want GPT to act as the 'bad guy' so I don't have to" },
            ].map((preference) => (
              <div key={preference.id} className="flex items-center space-x-2">
                <Checkbox
                  id={preference.id}
                  checked={preferences.includes(preference.id)}
                  onCheckedChange={() => handlePreferenceChange(preference.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={preference.id} className="text-gray-300">
                  {preference.label}
                </Label>
              </div>
            ))}
          </div>
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
