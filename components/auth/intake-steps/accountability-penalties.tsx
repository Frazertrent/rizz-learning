"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

interface XpPenalties {
  missedCheckIn: number
  missedSummary: number
  failedQuiz: number
  missedWeeklyGoal: number
}

interface CoinPenalties {
  missedCheckIn: number
  missedSummary: number
  failedQuiz: number
  missedWeeklyGoal: number
}

interface StreakBehavior {
  breakAfterMissedCheckIn: boolean
  removeXpBonus: boolean
  allowTaskRetry: boolean
}

interface CustomPenalties {
  xp: XpPenalties
  coins: CoinPenalties
  streakBehavior: StreakBehavior
}

interface AccountabilityPenaltiesData {
  penaltyLevel: "light" | "moderate" | "strict" | "custom"
  customPenalties: CustomPenalties
}

interface AccountabilityPenaltiesProps {
  formData: Partial<AccountabilityPenaltiesData>
  updateFormData: (data: Partial<AccountabilityPenaltiesData>) => void
}

export function AccountabilityPenalties({ formData, updateFormData }: AccountabilityPenaltiesProps) {
  const [penaltyLevel, setPenaltyLevel] = useState<AccountabilityPenaltiesData["penaltyLevel"]>(formData.penaltyLevel || "moderate")
  const [customPenalties, setCustomPenalties] = useState<CustomPenalties>(
    formData.customPenalties || {
      xp: {
        missedCheckIn: 10,
        missedSummary: 15,
        failedQuiz: 20,
        missedWeeklyGoal: 30,
      },
      coins: {
        missedCheckIn: 5,
        missedSummary: 10,
        failedQuiz: 15,
        missedWeeklyGoal: 25,
      },
      streakBehavior: {
        breakAfterMissedCheckIn: false,
        removeXpBonus: false,
        allowTaskRetry: true,
      },
    },
  )
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sync with incoming formData changes
  useEffect(() => {
    console.log("AccountabilityPenalties: Incoming formData update", formData)
    if (formData) {
      if (formData.penaltyLevel) setPenaltyLevel(formData.penaltyLevel)
      if (formData.customPenalties) setCustomPenalties(formData.customPenalties)
    }
  }, [formData])

  // Update parent form data when any value changes
  useEffect(() => {
    console.log("AccountabilityPenalties: Updating parent with new data", {
      penaltyLevel,
      customPenalties,
    })

    setIsSaving(true)
    const timer = setTimeout(() => {
      updateFormData({
        penaltyLevel,
        customPenalties,
      })
      setIsSaving(false)
      setShowSaveConfirmation(true)
      setTimeout(() => setShowSaveConfirmation(false), 2000)
    }, 500)

    return () => clearTimeout(timer)
  }, [penaltyLevel, customPenalties, updateFormData])

  const handleXpPenaltyChange = (field: keyof XpPenalties, value: string) => {
    console.log("AccountabilityPenalties: Handling XP penalty change", { field, value })
    setCustomPenalties({
      ...customPenalties,
      xp: {
        ...customPenalties.xp,
        [field]: Number(value) || 0,
      },
    })
  }

  const handleCoinPenaltyChange = (field: keyof CoinPenalties, value: string) => {
    console.log("AccountabilityPenalties: Handling coin penalty change", { field, value })
    setCustomPenalties({
      ...customPenalties,
      coins: {
        ...customPenalties.coins,
        [field]: Number(value) || 0,
      },
    })
  }

  const handleStreakBehaviorChange = (field: keyof StreakBehavior, value: boolean) => {
    console.log("AccountabilityPenalties: Handling streak behavior change", { field, value })
    setCustomPenalties({
      ...customPenalties,
      streakBehavior: {
        ...customPenalties.streakBehavior,
        [field]: value,
      },
    })
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Accountability & Point Penalties</CardTitle>
        <CardDescription className="text-gray-400">
          Customize how coins, XP, and streaks are lost when expectations aren't met
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">
            How strict should the system be when your child fails to meet expectations?
          </Label>
          <RadioGroup 
            value={penaltyLevel} 
            onValueChange={(value: AccountabilityPenaltiesData["penaltyLevel"]) => setPenaltyLevel(value)} 
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light-penalty" className="border-gray-600 text-blue-600" />
              <Label htmlFor="light-penalty" className="text-gray-300">
                Light — Minimal penalty (25% of missed reward)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate-penalty" className="border-gray-600 text-blue-600" />
              <Label htmlFor="moderate-penalty" className="text-gray-300">
                Moderate — Balanced penalty (50%)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="strict" id="strict-penalty" className="border-gray-600 text-blue-600" />
              <Label htmlFor="strict-penalty" className="text-gray-300">
                Strict — Full or greater loss (100%+)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom-penalty" className="border-gray-600 text-blue-600" />
              <Label htmlFor="custom-penalty" className="text-gray-300">
                I'll customize manually
              </Label>
            </div>
          </RadioGroup>
        </div>

        {penaltyLevel === "custom" && (
          <div className="space-y-6 mt-4 p-4 bg-gray-800 rounded-md">
            {/* XP Penalty Section */}
            <div className="space-y-4">
              <Label className="text-white text-lg">XP Penalty per Missed Task Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xp-missed-checkin" className="text-gray-300">
                    Missed Check-In:
                  </Label>
                  <Input
                    id="xp-missed-checkin"
                    type="number"
                    min="0"
                    value={customPenalties.xp.missedCheckIn}
                    onChange={(e) => handleXpPenaltyChange("missedCheckIn", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xp-missed-summary" className="text-gray-300">
                    Missed Summary:
                  </Label>
                  <Input
                    id="xp-missed-summary"
                    type="number"
                    min="0"
                    value={customPenalties.xp.missedSummary}
                    onChange={(e) => handleXpPenaltyChange("missedSummary", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xp-failed-quiz" className="text-gray-300">
                    Failed Quiz:
                  </Label>
                  <Input
                    id="xp-failed-quiz"
                    type="number"
                    min="0"
                    value={customPenalties.xp.failedQuiz}
                    onChange={(e) => handleXpPenaltyChange("failedQuiz", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xp-missed-goal" className="text-gray-300">
                    Missed Weekly Goal:
                  </Label>
                  <Input
                    id="xp-missed-goal"
                    type="number"
                    min="0"
                    value={customPenalties.xp.missedWeeklyGoal}
                    onChange={(e) => handleXpPenaltyChange("missedWeeklyGoal", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
              </div>
            </div>

            {/* Coin Penalty Section */}
            <div className="space-y-4">
              <Label className="text-white text-lg">Coin Penalty per Missed Task Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coin-missed-checkin" className="text-gray-300">
                    Missed Check-In:
                  </Label>
                  <Input
                    id="coin-missed-checkin"
                    type="number"
                    min="0"
                    value={customPenalties.coins.missedCheckIn}
                    onChange={(e) => handleCoinPenaltyChange("missedCheckIn", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coin-missed-summary" className="text-gray-300">
                    Missed Summary:
                  </Label>
                  <Input
                    id="coin-missed-summary"
                    type="number"
                    min="0"
                    value={customPenalties.coins.missedSummary}
                    onChange={(e) => handleCoinPenaltyChange("missedSummary", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coin-failed-quiz" className="text-gray-300">
                    Failed Quiz:
                  </Label>
                  <Input
                    id="coin-failed-quiz"
                    type="number"
                    min="0"
                    value={customPenalties.coins.failedQuiz}
                    onChange={(e) => handleCoinPenaltyChange("failedQuiz", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coin-missed-goal" className="text-gray-300">
                    Missed Weekly Goal:
                  </Label>
                  <Input
                    id="coin-missed-goal"
                    type="number"
                    min="0"
                    value={customPenalties.coins.missedWeeklyGoal}
                    onChange={(e) => handleCoinPenaltyChange("missedWeeklyGoal", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-24"
                  />
                </div>
              </div>
            </div>

            {/* Streak Behavior Section */}
            <div className="space-y-4">
              <Label className="text-white text-lg">Streak Behavior</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="break-streak"
                    checked={customPenalties.streakBehavior.breakAfterMissedCheckIn}
                    onCheckedChange={(checked: boolean) => handleStreakBehaviorChange("breakAfterMissedCheckIn", checked)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="break-streak" className="text-gray-300">
                    Break streak after missed check-in
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-xp-bonus"
                    checked={customPenalties.streakBehavior.removeXpBonus}
                    onCheckedChange={(checked: boolean) => handleStreakBehaviorChange("removeXpBonus", checked)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="remove-xp-bonus" className="text-gray-300">
                    Remove XP bonus from streaks if student fails a task
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow-retry"
                    checked={customPenalties.streakBehavior.allowTaskRetry}
                    onCheckedChange={(checked: boolean) => handleStreakBehaviorChange("allowTaskRetry", checked)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="allow-retry" className="text-gray-300">
                    Allow task retry to regain XP/coins
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {showSaveConfirmation && (
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className="bg-green-800 text-white p-4 rounded-t-lg">
            <p className="text-center">
              <CheckCircle className="inline-block mr-2" size={20} />
              Accountability settings saved successfully!
            </p>
          </div>
        </div>
      )}
    </>
  )
}
