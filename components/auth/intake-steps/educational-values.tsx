"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

interface EducationalValuesProps {
  formData: {
    structurePreference?: string;
    educationalValues?: string[];
    otherValue?: string;
    religiousAffiliation?: string;
    religiousImportance?: string;
  };
  updateFormData: (data: any) => void;
  editMode?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

export function EducationalValues({ 
  formData, 
  updateFormData, 
  editMode,
  onSave,
  isSaving,
  saveSuccess 
}: EducationalValuesProps) {
  // Add detailed debugging logs
  console.log('📋 EducationalValues detailed debug:');
  console.log('  - formData:', formData);
  console.log('  - structurePreference:', formData.structurePreference);
  console.log('  - educationalValues:', formData.educationalValues);
  console.log('  - religiousAffiliation:', formData.religiousAffiliation);
  console.log('  - religiousImportance:', formData.religiousImportance);

  const [structurePreference, setStructurePreference] = useState(formData.structurePreference || "balance")
  const [values, setValues] = useState<string[]>(formData.educationalValues || [])
  const [otherValue, setOtherValue] = useState(formData.otherValue || "")
  const [religiousAffiliation, setReligiousAffiliation] = useState(formData.religiousAffiliation || "")
  const [religiousImportance, setReligiousImportance] = useState(formData.religiousImportance || "")
  const [isInitialRender, setIsInitialRender] = useState(true)

  console.log('  - local state:', {
    structurePreference,
    values,
    otherValue,
    religiousAffiliation,
    religiousImportance
  });

  // Add effect to sync with incoming formData changes
  useEffect(() => {
    if (formData) {
      console.log('Updating local state from formData:', formData);
      setStructurePreference(formData.structurePreference || "balance");
      setValues(formData.educationalValues || []);
      setOtherValue(formData.otherValue || "");
      setReligiousAffiliation(formData.religiousAffiliation || "");
      setReligiousImportance(formData.religiousImportance || "");
    }
  }, [formData]);

  // Effect for updating parent component
  useEffect(() => {
    console.log('EducationalValues useEffect - values changed');
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    console.log('Updating parent formData with:', {
      structurePreference,
      educationalValues: values,
      otherValue,
      religiousAffiliation,
      religiousImportance,
    });

    updateFormData({
      structurePreference,
      educationalValues: values,
      otherValue,
      religiousAffiliation,
      religiousImportance,
    })
  }, [structurePreference, values, otherValue, religiousAffiliation, religiousImportance, updateFormData, isInitialRender])

  const handleValueChange = (value: string) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value))
    } else {
      setValues([...values, value])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Educational Values</CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about your parenting style and educational values
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">Do you prefer structure or flexibility?</Label>
          <RadioGroup value={structurePreference} onValueChange={setStructurePreference} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="structure" id="structure" className="border-gray-600 text-blue-600" />
              <Label htmlFor="structure" className="text-gray-300">
                Structure
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexibility" id="flexibility" className="border-gray-600 text-blue-600" />
              <Label htmlFor="flexibility" className="text-gray-300">
                Flexibility
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balance" id="balance" className="border-gray-600 text-blue-600" />
              <Label htmlFor="balance" className="text-gray-300">
                Balance
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-sure" id="not-sure" className="border-gray-600 text-blue-600" />
              <Label htmlFor="not-sure" className="text-gray-300">
                Not sure yet
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Select your educational values:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "independence", label: "Independence and self-learning" },
              { id: "parent-led", label: "Parent-led instruction" },
              { id: "project-based", label: "Project-based learning" },
              { id: "memorization", label: "Memorization and mastery" },
              { id: "exploration", label: "Exploration and creativity" },
              { id: "other", label: "Other" },
            ].map((value) => (
              <div key={value.id} className="flex items-center space-x-2">
                <Checkbox
                  id={value.id}
                  checked={values.includes(value.id)}
                  onCheckedChange={() => handleValueChange(value.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={value.id} className="text-gray-300">
                  {value.label}
                </Label>
              </div>
            ))}
          </div>

          {values.includes("other") && (
            <div className="mt-2">
              <Label htmlFor="other-value" className="text-gray-300">
                Please specify:
              </Label>
              <Input
                id="other-value"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Describe your other educational value"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Religious Affiliation Preference</Label>
          <RadioGroup value={religiousAffiliation} onValueChange={setReligiousAffiliation} className="space-y-2">
            {[
              "Secular",
              "Christian",
              "Catholic",
              "Jewish",
              "Islamic",
              "LDS",
              "Other",
              "No Preference"
            ].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.toLowerCase()} 
                  id={`religion-${option.toLowerCase()}`}
                  className="border-gray-600 text-blue-600"
                />
                <Label 
                  htmlFor={`religion-${option.toLowerCase()}`} 
                  className="text-gray-300"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">How important is religious affiliation?</Label>
          <RadioGroup value={religiousImportance} onValueChange={setReligiousImportance} className="space-y-2">
            {[
              "Required",
              "Preferred",
              "Neutral",
              "Avoid"
            ].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.toLowerCase()} 
                  id={`importance-${option.toLowerCase()}`}
                  className="border-gray-600 text-blue-600"
                />
                <Label 
                  htmlFor={`importance-${option.toLowerCase()}`} 
                  className="text-gray-300"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
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
