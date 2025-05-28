"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Upload, X, FileText, ImageIcon, File } from "lucide-react"

// Note tag options
const noteTags = [
  { value: "reflection", label: "Reflection" },
  { value: "question", label: "Question" },
  { value: "update", label: "Update" },
  { value: "excuse", label: "Excuse" },
  { value: "other", label: "Other" },
]

export type NoteAttachment = {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export type Note = {
  id: string
  assignmentId: string
  title?: string
  body: string
  tag?: string
  createdAt: Date
  attachment?: NoteAttachment
  studentId: string
  studentName: string
}

type AddNoteModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Omit<Note, "id" | "createdAt" | "studentId" | "studentName">) => void
  assignmentId: string
  assignmentTitle: string
}

export function AddNoteModal({ isOpen, onClose, onSave, assignmentId, assignmentTitle }: AddNoteModalProps) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tag, setTag] = useState<string | undefined>(undefined)
  const [attachment, setAttachment] = useState<NoteAttachment | undefined>(undefined)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to a server here
    // For now, we'll just simulate the upload
    setIsUploading(true)
    setTimeout(() => {
      const fileType = file.type.split("/")[0]
      const fileExtension = file.name.split(".").pop()?.toLowerCase()

      setAttachment({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
      })
      setIsUploading(false)
    }, 1000)
  }

  const removeAttachment = () => {
    if (attachment?.url) {
      URL.revokeObjectURL(attachment.url)
    }
    setAttachment(undefined)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!body.trim()) return

    onSave({
      assignmentId,
      title: title.trim() || undefined,
      body: body.trim(),
      tag,
      attachment,
    })

    // Reset form
    setTitle("")
    setBody("")
    setTag(undefined)
    removeAttachment()
    onClose()
  }

  const getFileIcon = (type: string) => {
    const fileType = type.split("/")[0]
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "application":
        return <FileText className="h-5 w-5 text-red-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-950 border-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add a Note</DialogTitle>
          <DialogDescription className="text-gray-400">
            For assignment: <span className="text-blue-400">{assignmentTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Title (Optional)
            </Label>
            <Input
              id="title"
              placeholder="Add a title for your note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-100 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="text-gray-300">
              Note
            </Label>
            <Textarea
              id="body"
              placeholder="Write your note here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[120px] bg-gray-900 border-gray-700 text-gray-100 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag" className="text-gray-300">
              Tag (Optional)
            </Label>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger id="tag" className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
                {noteTags.map((tag) => (
                  <SelectItem key={tag.value} value={tag.value} className="hover:bg-gray-800">
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment" className="text-gray-300">
              Attachment (Optional)
            </Label>
            {!attachment ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-900 border-gray-700 hover:bg-gray-800"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, or image (max 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 mr-3">
                  {getFileIcon(attachment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(attachment.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-200"
                  onClick={removeAttachment}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <p className="text-xs text-amber-400 flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              All notes are visible to your parent.
            </p>
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!body.trim() || isUploading}
              >
                Save Note
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
