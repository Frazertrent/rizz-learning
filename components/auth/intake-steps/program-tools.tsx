"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ProgramTools({ formData, updateFormData }) {
  const [platforms, setPlatforms] = useState(formData.platforms || [])
  const [otherPlatform, setOtherPlatform] = useState(formData.otherPlatform || "")
  const [wantRecommendations, setWantRecommendations] = useState(formData.wantRecommendations !== false)
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    updateFormData({
      platforms,
      otherPlatform,
      wantRecommendations,
    })
  }, [platforms, otherPlatform, wantRecommendations, updateFormData, isInitialRender])

  const handlePlatformChange = (platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform))
    } else {
      setPlatforms([...platforms, platform])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Program Tools</CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about the educational platforms and tools you're using
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">Which platforms or tools are you already using?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "kings-peak", label: "Kings Peak" },
              { id: "seats", label: "SEATS" },
              { id: "ignite", label: "Ignite" },
              { id: "study-island", label: "Study Island" },
              { id: "exact-path", label: "Exact Path" },
              { id: "mystery-science", label: "Mystery Science" },
              { id: "khan-academy", label: "Khan Academy" },
              { id: "other", label: "Other" },
            ].map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={platforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformChange(platform.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={platform.id} className="text-gray-300">
                  {platform.label}
                </Label>
              </div>
            ))}
          </div>

          {platforms.includes("other") && (
            <div className="mt-2">
              <Label htmlFor="other-platform" className="text-gray-300">
                Please specify:
              </Label>
              <Input
                id="other-platform"
                value={otherPlatform}
                onChange={(e) => setOtherPlatform(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Enter other platforms you're using"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">
            Would you like us to recommend other platforms that match your needs?
          </Label>
          <RadioGroup
            value={wantRecommendations ? "yes" : "no"}
            onValueChange={(value) => setWantRecommendations(value === "yes")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-recommend" className="border-gray-600 text-blue-600" />
              <Label htmlFor="yes-recommend" className="text-gray-300">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-recommend" className="border-gray-600 text-blue-600" />
              <Label htmlFor="no-recommend" className="text-gray-300">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </>
  )
}
