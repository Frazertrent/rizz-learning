"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Download,
  Eye,
  FileText,
  Filter,
  FolderOpen,
  Plus,
  Search,
  Share2,
  Upload,
  Clock,
  Wand2,
  DollarSign,
  Library,
  Trash2,
  Tag,
  BookCopy,
  FileCheck,
  Receipt,
  Hammer,
  FileQuestion,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageIcon } from "lucide-react"

// Sample data
const recentUploads = [
  {
    id: 1,
    name: "Math_Worksheet_Week12.pdf",
    size: "1.2 MB",
    type: "PDF",
    uploadedBy: "You",
    date: "Apr 10, 2024",
    subject: "Mathematics",
    student: "Enoch",
    category: "Curriculum",
    tags: ["Math", "Week 12", "Algebra"],
  },
  {
    id: 2,
    name: "Science_Lab_Report.docx",
    size: "850 KB",
    type: "Word",
    uploadedBy: "Enoch",
    date: "Apr 8, 2024",
    subject: "Science",
    student: "Enoch",
    category: "Assessments",
    tags: ["Science", "Lab", "Biology"],
  },
  {
    id: 3,
    name: "History_Essay_Draft.docx",
    size: "1.5 MB",
    type: "Word",
    uploadedBy: "Sarah",
    date: "Apr 7, 2024",
    subject: "History",
    student: "Sarah",
    category: "Assessments",
    tags: ["History", "Essay", "Civil War"],
  },
  {
    id: 4,
    name: "Art_Project_Photos.zip",
    size: "5.8 MB",
    type: "ZIP",
    uploadedBy: "Benjamin",
    date: "Apr 5, 2024",
    subject: "Art",
    student: "Benjamin",
    category: "Custom Projects",
    tags: ["Art", "Photos", "Project"],
  },
  {
    id: 5,
    name: "Piano_Lesson_Receipt.pdf",
    size: "420 KB",
    type: "PDF",
    uploadedBy: "You",
    date: "Apr 3, 2024",
    subject: "Music",
    student: "Sarah",
    category: "Reimbursements",
    tags: ["Music", "Receipt", "Piano"],
  },
  {
    id: 6,
    name: "Field_Trip_Permission.pdf",
    size: "380 KB",
    type: "PDF",
    uploadedBy: "You",
    date: "Apr 2, 2024",
    subject: "General",
    student: "All",
    category: "Other",
    tags: ["Field Trip", "Permission", "Forms"],
  },
]

const folders = [
  { id: 1, name: "Mathematics", files: 24, size: "45 MB" },
  { id: 2, name: "Science", files: 18, size: "32 MB" },
  { id: 3, name: "English", files: 15, size: "28 MB" },
  { id: 4, name: "History", files: 12, size: "22 MB" },
  { id: 5, name: "Art", files: 8, size: "65 MB" },
]

const sharedFiles = [
  {
    id: 1,
    name: "Weekly_Schedule.pdf",
    size: "2.1 MB",
    type: "PDF",
    sharedWith: "All Students",
    date: "Apr 5, 2024",
  },
  {
    id: 2,
    name: "Science_Curriculum.docx",
    size: "1.5 MB",
    type: "Word",
    sharedWith: "Enoch, Sarah",
    date: "Apr 3, 2024",
  },
  {
    id: 3,
    name: "Math_Practice_Problems.pdf",
    size: "3.2 MB",
    type: "PDF",
    sharedWith: "Benjamin",
    date: "Mar 28, 2024",
  },
]

const students = ["Enoch", "Sarah", "Benjamin"]

const categories = [
  { id: "curriculum", name: "Curriculum", icon: <BookCopy className="h-5 w-5" /> },
  { id: "assessments", name: "Assessments", icon: <FileCheck className="h-5 w-5" /> },
  { id: "reimbursements", name: "Reimbursements", icon: <Receipt className="h-5 w-5" /> },
  { id: "custom-projects", name: "Custom Projects", icon: <Hammer className="h-5 w-5" /> },
  { id: "other", name: "Other", icon: <FileQuestion className="h-5 w-5" /> },
]

export function Uploads() {
  const [activeTab, setActiveTab] = useState("upload")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFileType, setSelectedFileType] = useState("")
  const [shareRecipients, setShareRecipients] = useState([])
  const [uploadSubject, setUploadSubject] = useState("")
  const [uploadStudent, setUploadStudent] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadTags, setUploadTags] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "word":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      case "zip":
        return <FileText className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4 text-primary" />
    }
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId.toLowerCase())
    return category ? category.icon : <FileQuestion className="h-5 w-5" />
  }

  const handleCreateFolder = () => {
    if (!newFolderName) return

    toast({
      title: "Folder created",
      description: `Folder "${newFolderName}" has been created successfully.`,
      variant: "default",
    })

    setNewFolderName("")
  }

  const handleShareFile = () => {
    if (shareRecipients.length === 0) return

    toast({
      title: "File shared",
      description: `File has been shared with ${shareRecipients.join(", ")}.`,
      variant: "default",
    })

    setShareRecipients([])
  }

  const handleUploadFiles = () => {
    if (!uploadSubject || !uploadStudent) {
      toast({
        title: "Missing information",
        description: "Please select a subject and student before uploading.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Files uploaded",
      description: "Files successfully uploaded and assigned to student folder.",
      variant: "default",
    })

    setUploadSubject("")
    setUploadStudent("")
    setUploadDescription("")
    setUploadTags("")
  }

  const handleViewFile = (file) => {
    setSelectedFile(file)
    setSelectedFileType(file.type.toLowerCase())
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop logic here
    toast({
      title: "Files received",
      description: "Your files are ready to be uploaded.",
      variant: "default",
    })
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleDeleteFile = (fileId) => {
    toast({
      title: "File deleted",
      description: "The file has been removed from your uploads.",
      variant: "default",
    })
  }

  const filteredUploads = recentUploads.filter(
    (file) =>
      (activeCategory === "all" || file.category.toLowerCase() === activeCategory.toLowerCase()) &&
      (file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.tags && file.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))),
  )

  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredSharedFiles = sharedFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.sharedWith.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center">
          <span className="text-4xl mr-2">📁</span> Digital Binder
        </h2>
        <div className="flex items-center gap-2">
          <Button
            className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            onClick={() => setActiveTab("upload")}
          >
            <div className="absolute inset-0 w-3 bg-white group-hover:w-full transition-all duration-300 opacity-10"></div>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 transition-all hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white rounded-full px-6 py-2 shadow-sm hover:shadow-md hover:scale-105 border-amber-200 dark:border-amber-800/50"
          asChild
        >
          <a href="/parent/financial">
            <DollarSign className="h-5 w-5" /> Reimbursement Planner
          </a>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 transition-all hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white rounded-full px-6 py-2 shadow-sm hover:shadow-md hover:scale-105 border-blue-200 dark:border-blue-800/50"
          asChild
        >
          <a href="/parent/resources">
            <Library className="h-5 w-5" /> Resource Library
          </a>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 bg-background pt-2 pb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files, tags, or subjects..."
            className="w-full pl-8 sm:w-[300px] transition-all focus:ring-2 focus:ring-primary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="relative overflow-hidden group">
            <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">Size (Largest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="upload" value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 h-auto p-1 rounded-full bg-muted/80 backdrop-blur-sm">
          <TabsTrigger
            value="upload"
            className="py-2 rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Upload className="h-4 w-4" /> 📤 Upload
          </TabsTrigger>
          <TabsTrigger
            value="vault"
            className="py-2 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <FolderOpen className="h-4 w-4" /> 📁 Vault
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="py-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Clock className="h-4 w-4" /> 📄 Recent
          </TabsTrigger>
          <TabsTrigger
            value="shared"
            className="py-2 rounded-full data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Share2 className="h-4 w-4" /> 🔄 Shared
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card className="border-primary/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-100/50 to-transparent dark:from-purple-900/20 rounded-t-lg">
              <CardTitle>Upload a New Document</CardTitle>
              <CardDescription>Add files to your homeschool digital binder</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 
                    ${
                      isDragging
                        ? "border-purple-500 bg-purple-50/80 dark:bg-purple-900/20"
                        : "hover:border-primary/50 hover:bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:hover:bg-gradient-to-r dark:from-blue-900/10 dark:to-purple-900/10"
                    } group`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                >
                  <input type="file" ref={fileInputRef} className="hidden" multiple />
                  <div className="flex justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <Upload
                      className={`h-16 w-16 ${isDragging ? "text-purple-500" : "text-primary/70 group-hover:text-primary"} transition-colors duration-300`}
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Drag and drop files here</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files from your computer</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Accepts PDF, Word, Excel, Images, and ZIP files up to 25MB
                  </p>
                  <Button className="relative overflow-hidden group rounded-full px-6">
                    <div className="absolute inset-0 w-3 bg-gradient-to-r from-blue-500 via-primary to-purple-500 group-hover:w-full transition-all duration-500 opacity-20 rounded-full"></div>
                    <span className="relative z-10 flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Files
                    </span>
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="file-subject">Subject</Label>
                      <Select value={uploadSubject} onValueChange={setUploadSubject}>
                        <SelectTrigger id="file-subject" className="transition-all focus:ring-2 focus:ring-primary/30">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="physical-education">Physical Education</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file-student">Assign to Student</Label>
                      <Select value={uploadStudent} onValueChange={setUploadStudent}>
                        <SelectTrigger id="file-student" className="transition-all focus:ring-2 focus:ring-primary/30">
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Students</SelectItem>
                          <SelectItem value="enoch">Enoch</SelectItem>
                          <SelectItem value="sarah">Sarah</SelectItem>
                          <SelectItem value="benjamin">Benjamin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file-category">Document Category</Label>
                      <Select>
                        <SelectTrigger id="file-category" className="transition-all focus:ring-2 focus:ring-primary/30">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                {category.icon}
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file-tags">Tags (comma separated)</Label>
                      <Input
                        id="file-tags"
                        placeholder="Math, Week 12, Algebra"
                        value={uploadTags}
                        onChange={(e) => setUploadTags(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="file-description">Notes for This Upload</Label>
                      <Textarea
                        id="file-description"
                        placeholder="Add notes about this document"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        className="min-h-[100px] transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button
                onClick={handleUploadFiles}
                disabled={!uploadSubject || !uploadStudent}
                className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <div className="absolute inset-0 w-3 bg-white group-hover:w-full transition-all duration-300 opacity-10"></div>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </CardFooter>
          </Card>

          {/* Auto-Fill Preview section */}
          <Card className="border-primary/20 rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="bg-white/90 dark:bg-black/80 px-6 py-3 rounded-full shadow-lg">
                <span className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Coming Soon
                </span>
              </div>
            </div>
            <CardHeader className="bg-gradient-to-r from-blue-100/50 to-transparent dark:from-blue-900/20 rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Auto-Fill Preview
              </CardTitle>
              <CardDescription>Preview forms that will be auto-filled from your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">Document Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our system will automatically extract information from your uploaded documents to help fill out
                    forms and applications.
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">Available Auto-Fill Forms</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-5 list-disc">
                    <li>Student Registration</li>
                    <li>Curriculum Documentation</li>
                    <li>Progress Reports</li>
                    <li>Attendance Records</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vault" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-amber-100/50 to-transparent dark:from-amber-900/20 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Organized Vault</CardTitle>
                  <CardDescription>Browse your documents by category</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="relative overflow-hidden group">
                      <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                      <Plus className="mr-2 h-4 w-4" />
                      New Folder
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                      <DialogDescription>Create a new folder to organize your files by subject.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-2">
                        <Label htmlFor="folder-name">Folder Name</Label>
                        <Input
                          id="folder-name"
                          placeholder="Enter folder name"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className="transition-all focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        onClick={handleCreateFolder}
                        disabled={!newFolderName}
                        className="relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                        Create Folder
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Category Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={activeCategory === "all" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full transition-all ${
                    activeCategory === "all"
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-300"
                  }`}
                  onClick={() => setActiveCategory("all")}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full transition-all flex items-center gap-1 ${
                      activeCategory === category.id
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-300"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredUploads.length > 0 ? (
                  filteredUploads.map((file) => (
                    <div
                      key={file.id}
                      className="border rounded-xl p-4 transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg group bg-gradient-to-br from-amber-50/30 to-transparent dark:from-amber-900/5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`rounded-full p-3 transition-colors duration-300 ${
                            file.category === "Curriculum"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : file.category === "Assessments"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : file.category === "Reimbursements"
                                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                  : file.category === "Custom Projects"
                                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {getCategoryIcon(file.category.toLowerCase().replace(" ", "-"))}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{file.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {file.size} • {file.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {file.tags &&
                          file.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative overflow-hidden group rounded-full flex-1"
                        >
                          <div className="absolute inset-0 w-3 bg-gradient-to-r from-amber-500 to-amber-300 group-hover:w-full transition-all duration-300 opacity-10 rounded-full"></div>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative overflow-hidden group rounded-full p-0 w-9 h-9"
                        >
                          <div className="absolute inset-0 w-3 bg-red-500 group-hover:w-full transition-all duration-300 opacity-10 rounded-full"></div>
                          <Trash2 className="h-4 w-4 text-red-500" onClick={() => handleDeleteFile(file.id)} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative overflow-hidden group rounded-full p-0 w-9 h-9"
                        >
                          <div className="absolute inset-0 w-3 bg-blue-500 group-hover:w-full transition-all duration-300 opacity-10 rounded-full"></div>
                          <Eye className="h-4 w-4 text-blue-500" onClick={() => handleViewFile(file)} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 col-span-3">
                    <p className="text-muted-foreground">No documents match your search criteria.</p>
                  </div>
                )}

                <div className="border rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">Upload New Document</h3>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Add a new document to your digital binder
                  </p>
                  <Button
                    variant="outline"
                    className="w-full relative overflow-hidden group"
                    onClick={() => setActiveTab("upload")}
                  >
                    <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                    Upload Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-blue-100/50 to-transparent dark:from-blue-900/20 rounded-t-lg">
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Files uploaded in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredUploads.length > 0 ? (
                  filteredUploads.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between border-b pb-4 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 p-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100/80 dark:bg-blue-900/30 p-2">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50"
                            >
                              {file.type}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {file.size} • Uploaded by {file.uploadedBy} • {file.date}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.tags &&
                              file.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-blue-50/50 text-blue-700 border-blue-200/50 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/30"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewFile(file)}
                              className="relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getFileIcon(file.type)} {file.name}
                              </DialogTitle>
                              <DialogDescription>
                                {file.size} • Uploaded by {file.uploadedBy} • {file.date}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-auto p-4 bg-muted/30 rounded-md flex items-center justify-center">
                              {selectedFileType === "pdf" && (
                                <div className="text-center">
                                  <FileText className="h-16 w-16 mx-auto text-red-500 mb-4" />
                                  <p className="text-lg font-medium">PDF Preview</p>
                                  <p className="text-sm text-muted-foreground">PDF viewer would be integrated here</p>
                                </div>
                              )}
                              {selectedFileType === "word" && (
                                <div className="text-center">
                                  <FileText className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                                  <p className="text-lg font-medium">Word Document Preview</p>
                                  <p className="text-sm text-muted-foreground">
                                    Document viewer would be integrated here
                                  </p>
                                </div>
                              )}
                              {selectedFileType === "image" && (
                                <div className="text-center">
                                  <ImageIcon className="h-16 w-16 mx-auto text-green-500 mb-4" />
                                  <p className="text-lg font-medium">Image Preview</p>
                                  <p className="text-sm text-muted-foreground">Image would be displayed here</p>
                                </div>
                              )}
                              {selectedFileType === "zip" && (
                                <div className="text-center">
                                  <FileText className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                                  <p className="text-lg font-medium">ZIP Archive</p>
                                  <p className="text-sm text-muted-foreground">Contents listing would be shown here</p>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" className="relative overflow-hidden group">
                                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="relative overflow-hidden group">
                          <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No files match your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full relative overflow-hidden group"
                onClick={() => setActiveTab("vault")}
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                View All Files
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-green-100/50 to-transparent dark:from-green-900/20 rounded-t-lg">
              <CardTitle>Shared Files</CardTitle>
              <CardDescription>Files shared with students and mentors</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredSharedFiles.length > 0 ? (
                  filteredSharedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between border-b pb-4 hover:bg-green-50/30 dark:hover:bg-green-900/10 p-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-100/80 dark:bg-green-900/30 p-2">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50"
                            >
                              {file.type}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {file.size} • Shared with {file.sharedWith} • {file.date}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewFile(file)}
                              className="relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getFileIcon(file.type)} {file.name}
                              </DialogTitle>
                              <DialogDescription>
                                {file.size} • Shared with {file.sharedWith} • {file.date}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-auto p-4 bg-muted/30 rounded-md flex items-center justify-center">
                              {file.type.toLowerCase() === "pdf" && (
                                <div className="text-center">
                                  <FileText className="h-16 w-16 mx-auto text-red-500 mb-4" />
                                  <p className="text-lg font-medium">PDF Preview</p>
                                  <p className="text-sm text-muted-foreground">PDF viewer would be integrated here</p>
                                </div>
                              )}
                              {file.type.toLowerCase() === "word" && (
                                <div className="text-center">
                                  <FileText className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                                  <p className="text-lg font-medium">Word Document Preview</p>
                                  <p className="text-sm text-muted-foreground">
                                    Document viewer would be integrated here
                                  </p>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" className="relative overflow-hidden group">
                                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="relative overflow-hidden group">
                              <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                              <Share2 className="mr-2 h-4 w-4" />
                              Manage Access
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Manage Access</DialogTitle>
                              <DialogDescription>Control who has access to {file.name}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="space-y-4">
                                <Label>Share with:</Label>
                                <div className="space-y-2">
                                  {students.map((student) => (
                                    <div key={student} className="flex items-center space-x-2">
                                      <Checkbox id={`share-${student}`} checked={file.sharedWith.includes(student)} />
                                      <Label htmlFor={`share-${student}`}>{student}</Label>
                                    </div>
                                  ))}
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="share-all" checked={file.sharedWith === "All Students"} />
                                    <Label htmlFor="share-all">All Students</Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="flex justify-between sm:justify-between">
                              <Button variant="outline">Cancel</Button>
                              <Button className="relative overflow-hidden group">
                                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No shared files match your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full relative overflow-hidden group">
                    <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                    Share New File
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share File</DialogTitle>
                    <DialogDescription>Share a file with students or mentors</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select File</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <div className="flex justify-center mb-4">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Click to browse or drag and drop</p>
                          <Button variant="outline" size="sm" className="relative overflow-hidden group">
                            <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-10"></div>
                            Choose File
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                          placeholder="Add a description"
                          className="transition-all focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Share with:</Label>
                        <div className="space-y-2">
                          {students.map((student) => (
                            <div key={student} className="flex items-center space-x-2">
                              <Checkbox
                                id={`share-new-${student}`}
                                checked={shareRecipients.includes(student)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setShareRecipients([...shareRecipients, student])
                                  } else {
                                    setShareRecipients(shareRecipients.filter((r) => r !== student))
                                  }
                                }}
                              />
                              <Label htmlFor={`share-new-${student}`}>{student}</Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="share-new-all"
                              checked={shareRecipients.length === students.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setShareRecipients([...students])
                                } else {
                                  setShareRecipients([])
                                }
                              }}
                            />
                            <Label htmlFor="share-new-all">All Students</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      onClick={handleShareFile}
                      disabled={shareRecipients.length === 0}
                      className="relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300 opacity-20"></div>
                      Share File
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
