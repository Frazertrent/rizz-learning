"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface EducationalVisionProps {
  formData: {
    educationalGoals?: string[];
    otherGoal?: string;
    targetGpa?: {
      hasPreference: boolean;
      value: number;
    };
    outcomeLevel?: string;
    customOutcome?: string;
  };
  updateFormData: (data: any) => void;
  editMode?: boolean;
}

export function EducationalVision({ formData, updateFormData, editMode }: EducationalVisionProps) {
  // Add detailed debugging logs
  console.log('📋 EducationalVision detailed debug:');
  console.log('  - formData:', formData);
  console.log('  - educationalGoals:', formData.educationalGoals);
  console.log('  - targetGpa:', formData.targetGpa);
  console.log('  - outcomeLevel:', formData.outcomeLevel);

  const [goals, setGoals] = useState(formData.educationalGoals || [])
  const [otherGoal, setOtherGoal] = useState(formData.otherGoal || "")
  const [hasGpaPreference, setHasGpaPreference] = useState(formData.targetGpa?.hasPreference || false)
  const [gpaValue, setGpaValue] = useState(formData.targetGpa?.value || 3.5)
  const [outcomeLevel, setOutcomeLevel] = useState(formData.outcomeLevel || "proficient")
  const [customOutcome, setCustomOutcome] = useState(formData.customOutcome || "")
  const [isInitialRender, setIsInitialRender] = useState(true)

  console.log('  - local state:', {
    goals,
    otherGoal,
    hasGpaPreference,
    gpaValue,
    outcomeLevel,
    customOutcome
  });

  // Add effect to sync with incoming formData changes
  useEffect(() => {
    if (formData) {
      console.log('Updating local state from formData:', formData);
      setGoals(formData.educationalGoals || []);
      setOtherGoal(formData.otherGoal || "");
      setHasGpaPreference(formData.targetGpa?.hasPreference || false);
      setGpaValue(formData.targetGpa?.value || 3.5);
      setOutcomeLevel(formData.outcomeLevel || "proficient");
      setCustomOutcome(formData.customOutcome || "");
    }
  }, [formData]);

  // Effect for updating parent component
  useEffect(() => {
    console.log('EducationalVision useEffect - values changed');
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    const updatedData = {
      educationalGoals: goals,
      otherGoal,
      targetGpa: { hasPreference: hasGpaPreference, value: gpaValue },
      outcomeLevel,
      customOutcome,
    };

    console.log('Updating parent formData with:', updatedData);
    updateFormData(updatedData);
  }, [goals, otherGoal, hasGpaPreference, gpaValue, outcomeLevel, customOutcome, updateFormData, isInitialRender]);

  const handleGoalChange = (goal: string) => {
    const newGoals = goals.includes(goal) ? goals.filter((g) => g !== goal) : [...goals, goal];
    setGoals(newGoals);
  }

  const handleOtherGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherGoal(e.target.value);
  }

  const handleGpaPreferenceChange = (value: string) => {
    setHasGpaPreference(value === "yes");
  }

  const handleGpaValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGpaValue(Number.parseFloat(e.target.value));
  }

  const handleOutcomeLevelChange = (value: string) => {
    setOutcomeLevel(value);
  }

  const handleCustomOutcomeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomOutcome(e.target.value);
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Educational Vision & Goals</CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about your educational goals and expectations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">Select your educational goals:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "graduate-early", label: "Graduate early" },
              { id: "accelerate-core", label: "Accelerate core learning" },
              { id: "supplement-public", label: "Supplement public school learning" },
              { id: "associates-degree", label: "Earn associate's degree by graduation" },
              { id: "certifications", label: "Complete extracurricular certifications" },
              { id: "traditional", label: "Take a traditional route" },
              { id: "other", label: "Other" },
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={goals.includes(item.id)}
                  onCheckedChange={() => handleGoalChange(item.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={item.id} className="text-gray-300">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          {goals.includes("other") && (
            <div className="mt-2">
              <Label htmlFor="other-goal" className="text-gray-300">
                Please specify:
              </Label>
              <Input
                id="other-goal"
                value={otherGoal}
                onChange={handleOtherGoalChange}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Enter your other educational goal"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Do you have a target GPA for your student?</Label>
          <RadioGroup
            value={hasGpaPreference ? "yes" : "no"}
            onValueChange={handleGpaPreferenceChange}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-gpa" className="border-gray-600 text-blue-600" />
              <Label htmlFor="no-gpa" className="text-gray-300">
                No preference
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-gpa" className="border-gray-600 text-blue-600" />
              <Label htmlFor="yes-gpa" className="text-gray-300">
                Yes
              </Label>
            </div>
          </RadioGroup>

          {hasGpaPreference && (
            <div className="mt-2">
              <Label htmlFor="gpa-value" className="text-gray-300">
                Target GPA:
              </Label>
              <Input
                id="gpa-value"
                type="number"
                min="0"
                max="4.0"
                step="0.1"
                value={gpaValue}
                onChange={handleGpaValueChange}
                className="bg-gray-800 border-gray-700 text-white mt-1 w-24"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">What level of outcome do you expect?</Label>
          <RadioGroup value={outcomeLevel} onValueChange={handleOutcomeLevelChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mastery" id="mastery" className="border-gray-600 text-blue-600" />
              <Label htmlFor="mastery" className="text-gray-300">
                Mastery
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="proficient" id="proficient" className="border-gray-600 text-blue-600" />
              <Label htmlFor="proficient" className="text-gray-300">
                Proficient
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passing" id="passing" className="border-gray-600 text-blue-600" />
              <Label htmlFor="passing" className="text-gray-300">
                Passing
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" className="border-gray-600 text-blue-600" />
              <Label htmlFor="custom" className="text-gray-300">
                Custom
              </Label>
            </div>
          </RadioGroup>

          {outcomeLevel === "custom" && (
            <div className="mt-2">
              <Label htmlFor="custom-outcome" className="text-gray-300">
                Describe your custom outcome:
              </Label>
              <Textarea
                id="custom-outcome"
                value={customOutcome}
                onChange={handleCustomOutcomeChange}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Describe your expected outcome"
                rows={3}
              />
            </div>
          )}
        </div>
      </CardContent>
    </>
  )
}
