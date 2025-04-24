"use client"
import { format } from "date-fns"
import { MessageSquare, FileText, ImageIcon, File, Download, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Note } from "./add-note-modal"

type AssignmentNotesProps = {
  notes: Note[]
  onReply?: (noteId: string) => void
  isParentView?: boolean
}

export function AssignmentNotes({ notes, onReply, isParentView = false }: AssignmentNotesProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <MessageSquare className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">No notes yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {isParentView
            ? "Your student hasn't added any notes to this assignment."
            : "Add a note to share updates or ask questions about this assignment."}
        </p>
      </div>
    )
  }

  const getTagColor = (tag?: string) => {
    switch (tag) {
      case "reflection":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "question":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "update":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "excuse":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTagLabel = (tag?: string) => {
    if (!tag) return "Note"
    return tag.charAt(0).toUpperCase() + tag.slice(1)
  }

  const getFileIcon = (type: string) => {
    const fileType = type.split("/")[0]
    switch (fileType) {
      case "image":
        return <Image className="h-5 w-5 text-blue-500" />
      case "application":
        return <FileText className="h-5 w-5 text-red-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="bg-gray-950 border-gray-800 overflow-hidden">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Badge className={`${getTagColor(note.tag)} rounded-full text-xs`}>{getTagLabel(note.tag)}</Badge>
                <span className="text-sm text-gray-400">
                  {isParentView
                    ? `${note.studentName} added a note on ${format(note.createdAt, "MMM d, yyyy 'at' h:mm a")}`
                    : format(note.createdAt, "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              {onReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => onReply(note.id)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              )}
            </div>
            {note.title && <CardTitle className="text-lg font-semibold mt-1">{note.title}</CardTitle>}
          </CardHeader>
          <CardContent className="px-4 py-2">
            <div className="text-gray-200 whitespace-pre-wrap mb-3">{note.body}</div>

            {note.attachment && (
              <div className="mt-3">
                {note.attachment.type.startsWith("image/") ? (
                  <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                    <ImageIcon
                      src={note.attachment.url || "/placeholder.svg"}
                      alt={note.attachment.name}
                      className="max-h-64 w-auto mx-auto object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex justify-between items-center">
                      <span className="text-xs text-gray-300 truncate max-w-[200px]">{note.attachment.name}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Download className="h-4 w-4 text-gray-300" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-gray-900 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 mr-3">
                      {getFileIcon(note.attachment.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{note.attachment.name}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
