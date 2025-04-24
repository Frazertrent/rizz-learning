"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function DeviceAccess({ formData, updateFormData }) {
  const [devices, setDevices] = useState(formData.devices || [])
  const [taskDelivery, setTaskDelivery] = useState(formData.taskDelivery || "device")
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid the infinite loop
    if (isInitialRender) {
      setIsInitialRender(false)
      return
    }

    updateFormData({
      devices,
      taskDelivery,
    })
  }, [devices, taskDelivery, updateFormData, isInitialRender])

  const handleDeviceChange = (device) => {
    if (devices.includes(device)) {
      setDevices(devices.filter((d) => d !== device))
    } else {
      setDevices([...devices, device])
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-white">Device Access</CardTitle>
        <CardDescription className="text-gray-400">
          Tell us about the devices and technology available for learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-white text-lg">Select available devices:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "laptop", label: "Laptop" },
              { id: "tablet", label: "Tablet" },
              { id: "phone", label: "Phone" },
              { id: "shared", label: "Shared device" },
              { id: "printer", label: "Printer" },
              { id: "internet", label: "Reliable Internet" },
            ].map((device) => (
              <div key={device.id} className="flex items-center space-x-2">
                <Checkbox
                  id={device.id}
                  checked={devices.includes(device.id)}
                  onCheckedChange={() => handleDeviceChange(device.id)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={device.id} className="text-gray-300">
                  {device.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">How should tasks be delivered?</Label>
          <RadioGroup value={taskDelivery} onValueChange={setTaskDelivery} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="device" id="device-delivery" className="border-gray-600 text-blue-600" />
              <Label htmlFor="device-delivery" className="text-gray-300">
                On a device
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="printed" id="printed-delivery" className="border-gray-600 text-blue-600" />
              <Label htmlFor="printed-delivery" className="text-gray-300">
                Printed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both-delivery" className="border-gray-600 text-blue-600" />
              <Label htmlFor="both-delivery" className="text-gray-300">
                Both
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </>
  )
}
