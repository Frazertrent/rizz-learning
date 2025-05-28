"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Option = {
  value: string
  label: string
}

interface CreatableSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  createMessage?: string
}

export function CreatableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  emptyMessage = "No options found.",
  className,
  createMessage = "Create",
}: CreatableSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Find the selected option or create a custom one
  const selectedOption = options.find((option) => option.value.toLowerCase() === value.toLowerCase())
  const displayValue = selectedOption ? selectedOption.label : value

  // Filter options based on input value
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))

  // Check if the input value is a new option
  const isNewOption =
    inputValue !== "" && !options.some((option) => option.label.toLowerCase() === inputValue.toLowerCase())

  // Handle selection of an option
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setOpen(false)
    setInputValue("")
  }

  // Handle creation of a new option
  const handleCreate = () => {
    onChange(inputValue)
    setOpen(false)
    setInputValue("")
  }

  // Clear the selected value
  const handleClear = () => {
    onChange("")
    inputRef.current?.focus()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value ? (
            <Badge variant="secondary" className="mr-2 px-2 py-0">
              {displayValue}
            </Badge>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Search or create..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {emptyMessage}
              {isNewOption && (
                <Button variant="outline" size="sm" className="mt-2 w-full justify-start" onClick={handleCreate}>
                  <Check className="mr-2 h-4 w-4" />
                  {createMessage} "{inputValue}"
                </Button>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
              {isNewOption && (
                <CommandItem onSelect={handleCreate}>
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  {createMessage} "{inputValue}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
