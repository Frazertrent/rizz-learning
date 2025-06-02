"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { CheckCircle } from "lucide-react"

interface DaySpecificTime {
  startTime: string
  endTime: string
}

interface DaySpecificTimes {
  monday: DaySpecificTime
  tuesday: DaySpecificTime
  wednesday: DaySpecificTime
  thursday: DaySpecificTime
  friday: DaySpecificTime
  saturday: DaySpecificTime
  sunday: DaySpecificTime
}

interface SchedulePreferencesData {
  schoolDays: string[]
  hasDifferentTimes: boolean
  startTime: string
  endTime: string
  daySpecificTimes: DaySpecificTimes
  blockLength: number
  termStructure: "school" | "custom"
  termLength: number
  termUnit: string
}

interface SchedulePreferencesProps {
  formData: Partial<SchedulePreferencesData>
  updateFormData: (data: Partial<SchedulePreferencesData>) => void
}

export function SchedulePreferences({ formData, updateFormData }: SchedulePreferencesProps) {
  const [schoolDays, setSchoolDays] = useState<string[]>(formData.schoolDays || [])
  const [hasDifferentTimes, setHasDifferentTimes] = useState(formData.hasDifferentTimes || false)
  const [startTime, setStartTime] = useState(formData.startTime || "08:00")
  const [endTime, setEndTime] = useState(formData.endTime || "15:00")
  const [daySpecificTimes, setDaySpecificTimes] = useState<DaySpecificTimes>(
    formData.daySpecificTimes || {
      monday: { startTime: "08:00", endTime: "15:00" },
      tuesday: { startTime: "08:00", endTime: "15:00" },
      wednesday: { startTime: "08:00", endTime: "15:00" },
      thursday: { startTime: "08:00", endTime: "15:00" },
      friday: { startTime: "08:00", endTime: "15:00" },
      saturday: { startTime: "08:00", endTime: "15:00" },
      sunday: { startTime: "08:00", endTime: "15:00" },
    },
  )
  const [blockLength, setBlockLength] = useState(formData.blockLength || 45)
  const [termStructure, setTermStructure] = useState<"school" | "custom">(formData.termStructure || "school")
  const [termLength, setTermLength] = useState(formData.termLength || 9)
  const [termUnit, setTermUnit] = useState(formData.termUnit || "weeks")
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sync with incoming formData changes
  useEffect(() => {
    console.log("SchedulePreferences: Incoming formData update", formData)
    if (formData) {
      if (formData.schoolDays) setSchoolDays(formData.schoolDays)
      if (formData.hasDifferentTimes !== undefined) setHasDifferentTimes(formData.hasDifferentTimes)
      if (formData.startTime) setStartTime(formData.startTime)
      if (formData.endTime) setEndTime(formData.endTime)
      if (formData.daySpecificTimes) setDaySpecificTimes(formData.daySpecificTimes)
      if (formData.blockLength) setBlockLength(formData.blockLength)
      if (formData.termStructure) setTermStructure(formData.termStructure)
      if (formData.termLength) setTermLength(formData.termLength)
      if (formData.termUnit) setTermUnit(formData.termUnit)
    }
  }, [formData])

  // Update parent form data when any value changes
  useEffect(() => {
    console.log("SchedulePreferences: Updating parent with new data", {
      schoolDays,
      hasDifferentTimes,
      startTime,
      endTime,
      daySpecificTimes,
      blockLength,
      termStructure,
      termLength,
      termUnit,
    })

    setIsSaving(true)
    const timer = setTimeout(() => {
      updateFormData({
        schoolDays,
        hasDifferentTimes,
        startTime,
        endTime,
        daySpecificTimes,
        blockLength,
        termStructure,
        termLength,
        termUnit,
      })
      setIsSaving(false)
      setShowSaveConfirmation(true)
      setTimeout(() => setShowSaveConfirmation(false), 2000)
    }, 500)

    return () => clearTimeout(timer)
  }, [
    schoolDays,
    hasDifferentTimes,
    startTime,
    endTime,
    daySpecificTimes,
    blockLength,
    termStructure,
    termLength,
    termUnit,
    updateFormData,
  ])

  const handleDayChange = (day: string) => {
    if (schoolDays.includes(day)) {
      setSchoolDays(schoolDays.filter((d) => d !== day))
    } else {
      setSchoolDays([...schoolDays, day])
    }
  }

  const handleDaySpecificTimeChange = (day: keyof DaySpecificTimes, field: keyof DaySpecificTime, value: string) => {
    setDaySpecificTimes({
      ...daySpecificTimes,
      [day]: {
        ...daySpecificTimes[day],
        [field]: value,
      },
    })
  }

  const daysOfWeek = [
    { id: "monday" as keyof DaySpecificTimes, label: "Monday" },
    { id: "tuesday" as keyof DaySpecificTimes, label: "Tuesday" },
    { id: "wednesday" as keyof DaySpecificTimes, label: "Wednesday" },
    { id: "thursday" as keyof DaySpecificTimes, label: "Thursday" },
    { id: "friday" as keyof DaySpecificTimes, label: "Friday" },
    { id: "saturday" as keyof DaySpecificTimes, label: "Saturday" },
    { id: "sunday" as keyof DaySpecificTimes, label: "Sunday" },
  ]

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Schedule Preferences</CardTitle>
        <CardDescription className="text-gray-400">Tell us about your preferred schedule for schooling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Days of the Week Section */}
        <div className="space-y-4">
          <Label className="text-white text-lg">Select days of the week for schooling:</Label>
          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={day.id}
                  checked={schoolDays.includes(day.id)}
                  onCheckedChange={() => handleDayChange(day.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={day.id} className="text-gray-300">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Time Block Preferences Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-white text-lg">Time Block Preferences</Label>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="different-times"
              checked={hasDifferentTimes}
              onCheckedChange={setHasDifferentTimes}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="different-times" className="text-gray-300">
              Do your start/end times vary by day?
            </Label>
          </div>

          {!hasDifferentTimes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start-time" className="text-white">
                  Start Time:
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-white">
                  End Time:
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Label className="text-white">Set start and end times for each selected day:</Label>
              <div className="space-y-4">
                {schoolDays.length > 0 ? (
                  schoolDays.map((day) => {
                    const typedDay = day as keyof DaySpecificTimes
                    return (
                      <div
                        key={day}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 bg-gray-800 rounded-md"
                      >
                        <Label className="text-gray-300 md:col-span-1">
                          {daysOfWeek.find((d) => d.id === typedDay)?.label}:
                        </Label>
                        <div className="space-y-1 md:col-span-1">
                          <Label htmlFor={`${typedDay}-start`} className="text-gray-400 text-xs">
                            Start Time
                          </Label>
                          <Input
                            id={`${typedDay}-start`}
                            type="time"
                            value={daySpecificTimes[typedDay].startTime}
                            onChange={(e) => handleDaySpecificTimeChange(typedDay, "startTime", e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-1">
                          <Label htmlFor={`${typedDay}-end`} className="text-gray-400 text-xs">
                            End Time
                          </Label>
                          <Input
                            id={`${typedDay}-end`}
                            type="time"
                            value={daySpecificTimes[typedDay].endTime}
                            onChange={(e) => handleDaySpecificTimeChange(typedDay, "endTime", e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-gray-400 italic">Please select at least one school day above.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Learning Block Length Section */}
        <div className="space-y-2">
          <Label htmlFor="block-length" className="text-white text-lg">
            Learning Block Length (minutes):
          </Label>
          <Input
            id="block-length"
            type="number"
            min="15"
            max="120"
            step="5"
            value={blockLength}
            onChange={(e) => setBlockLength(Number.parseInt(e.target.value))}
            className="bg-gray-800 border-gray-700 text-white w-24"
          />
        </div>

        {/* Term Structure Section */}
        <div className="space-y-4">
          <Label className="text-white text-lg">Term Structure:</Label>
          <RadioGroup value={termStructure} onValueChange={(value: "school" | "custom") => setTermStructure(value)} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="school" id="school-terms" className="border-gray-600 text-blue-600" />
              <Label htmlFor="school-terms" className="text-gray-300">
                Follow school semesters
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom-terms" className="border-gray-600 text-blue-600" />
              <Label htmlFor="custom-terms" className="text-gray-300">
                Create custom terms
              </Label>
            </div>
          </RadioGroup>

          {termStructure === "custom" && (
            <div className="mt-4 space-y-4 p-4 bg-gray-800 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="term-length" className="text-white">
                  How long is each term?
                </Label>
                <Input
                  id="term-length"
                  type="number"
                  min="1"
                  max="52"
                  placeholder="Enter a number"
                  value={termLength}
                  onChange={(e) => setTermLength(Number.parseInt(e.target.value) || 1)}
                  className="bg-gray-700 border-gray-600 text-white w-24"
                />
                <p className="text-gray-400 text-xs">Accepts values from 1 to 52</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Length is measured in:</Label>
                <RadioGroup value={termUnit} onValueChange={setTermUnit} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="days" id="days-unit" className="border-gray-600 text-blue-600" />
                    <Label htmlFor="days-unit" className="text-gray-300">
                      Days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weeks" id="weeks-unit" className="border-gray-600 text-blue-600" />
                    <Label htmlFor="weeks-unit" className="text-gray-300">
                      Weeks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="months" id="months-unit" className="border-gray-600 text-blue-600" />
                    <Label htmlFor="months-unit" className="text-gray-300">
                      Months
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-4 p-3 bg-gray-700 rounded-md">
                <p className="text-gray-200 flex items-center">
                  <span className="text-blue-400 mr-2">💡</span>
                  Preview: Your terms will be {termLength} {termUnit} long.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {showSaveConfirmation && (
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className="bg-green-800 text-white p-4 rounded-t-lg">
            <p className="text-center">
              <CheckCircle className="inline-block mr-2" size={20} />
              Schedule preferences saved successfully!
            </p>
          </div>
        </div>
      )}
    </>
  )
}
