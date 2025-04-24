"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { FlashcardSet } from "./flashcard-study"

interface FlashcardSelectorProps {
  flashcardSets: FlashcardSet[]
  selectedSetId: string | null
  onSelectSet: (id: string) => void
}

export function FlashcardSelector({ flashcardSets, selectedSetId, onSelectSet }: FlashcardSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[300px] justify-between bg-gray-800/50 border-gray-700 text-white"
        >
          {selectedSetId
            ? flashcardSets.find((set) => set.id === selectedSetId)?.name
            : "Choose a flashcard set to begin"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[300px] p-0 bg-gray-800 border-gray-700 text-white">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search flashcard sets..." className="border-gray-700" />
          <CommandList>
            <CommandEmpty>No flashcard set found.</CommandEmpty>
            <CommandGroup>
              {flashcardSets.map((set) => (
                <CommandItem
                  key={set.id}
                  value={set.id}
                  onSelect={() => {
                    onSelectSet(set.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex flex-col items-start py-3 px-4 cursor-pointer hover:bg-gray-700",
                    selectedSetId === set.id && "bg-gray-700/50",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{set.name}</span>
                    {selectedSetId === set.id && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {set.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-gray-700/50 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
