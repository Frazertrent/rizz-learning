"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

interface ExtracurricularsProps {
  formData: {
    extracurriculars?: string[];
    otherExtracurricular?: string;
  };
  updateFormData: (data: any) => void;
  editMode?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

export function Extracurriculars({ 
  formData, 
  updateFormData,
  editMode,
  onSave,
  isSaving,
  saveSuccess
}: ExtracurricularsProps) {
  // Add detailed debugging logs
  console.log('📋 Extracurriculars detailed debug:');
  console.log('  - formData:', formData);
  console.log('  - extracurriculars:', formData.extracurriculars);
  console.log('  - otherExtracurricular:', formData.otherExtracurricular);

  const [extracurriculars, setExtracurriculars] = useState<string[]>(formData.extracurriculars || [])
  const [otherExtracurricular, setOtherExtracurricular] = useState(formData.otherExtracurricular || "")
  const [isInitialRender, setIsInitialRender] = useState(true)

  console.log('  - local state:', {
    extracurriculars,
    otherExtracurricular
  });

  // Add effect to sync with incoming formData changes
  useEffect(() => {
    if (formData) {
      console.log('Updating local state from formData:', formData);
      setExtracurriculars(formData.extracurriculars || []);
      setOtherExtracurricular(formData.otherExtracurricular || "");
    }
  }, [formData]);

  // Effect for updating parent component
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    const updatedData = {
      extracurriculars,
      otherExtracurricular,
    };

    console.log('Updating parent formData with:', updatedData);
    updateFormData(updatedData)
  }, [extracurriculars, otherExtracurricular, updateFormData, isInitialRender])

  const handleExtracurricularChange = (activity: string) => {
    if (extracurriculars.includes(activity)) {
      setExtracurriculars(extracurriculars.filter((e) => e !== activity))
    } else {
      setExtracurriculars([...extracurriculars, activity])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Extracurriculars</CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about your child's activities outside of academics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">Check all that apply:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "sports", label: "Sports" },
              { id: "music", label: "Music" },
              { id: "scouts", label: "Scouts" },
              { id: "church", label: "Church" },
              { id: "volunteerism", label: "Volunteerism" },
              { id: "entrepreneurship", label: "Entrepreneurship" },
              { id: "clubs", label: "Clubs" },
              { id: "other", label: "Other" },
            ].map((activity) => (
              <div key={activity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={activity.id}
                  checked={extracurriculars.includes(activity.id)}
                  onCheckedChange={() => handleExtracurricularChange(activity.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={activity.id} className="text-gray-300">
                  {activity.label}
                </Label>
              </div>
            ))}
          </div>

          {extracurriculars.includes("other") && (
            <div className="mt-2">
              <Label htmlFor="other-extracurricular" className="text-gray-300">
                Please specify:
              </Label>
              <Input
                id="other-extracurricular"
                value={otherExtracurricular}
                onChange={(e) => setOtherExtracurricular(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Describe other extracurricular activities"
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
