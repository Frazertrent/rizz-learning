"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ExternalLink,
  Filter,
  FolderOpen,
  Plus,
  Search,
  Star,
  Pencil,
  Trash2,
  BookOpen,
  Video,
  Headphones,
  Globe,
  Smartphone,
  FileText,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"

// Sample data
const resourcesData = [
  {
    id: 1,
    title: "Khan Academy - Mathematics",
    description: "Free online math courses covering arithmetic to calculus",
    type: "Website",
    subjects: ["Mathematics"],
    grades: ["K-12"],
    rating: 5,
    url: "https://www.khanacademy.org/math",
  },
  {
    id: 2,
    title: "National Geographic Kids",
    description: "Educational content about animals, science, history, and geography",
    type: "Website",
    subjects: ["Science", "Geography", "History"],
    grades: ["K-8"],
    rating: 4,
    url: "https://kids.nationalgeographic.com/",
  },
  {
    id: 3,
    title: "Mystery Science",
    description: "Ready-made science lessons with videos and hands-on activities",
    type: "Curriculum",
    subjects: ["Science"],
    grades: ["K-5"],
    rating: 5,
    url: "https://mysteryscience.com/",
  },
  {
    id: 4,
    title: "ReadWorks",
    description: "Reading comprehension materials with thousands of articles",
    type: "Website",
    subjects: ["English", "Reading"],
    grades: ["K-12"],
    rating: 4,
    url: "https://www.readworks.org/",
  },
]

const collectionsData = [
  { id: 1, name: "Math Resources", count: 12, icon: "📐" },
  { id: 2, name: "Science Experiments", count: 8, icon: "🧪" },
  { id: 3, name: "Reading Materials", count: 15, icon: "📚" },
  { id: 4, name: "History & Geography", count: 10, icon: "🌍" },
]

export function ResourceLibrary() {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false)
  const [showAddFavoriteModal, setShowAddFavoriteModal] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [resources, setResources] = useState(resourcesData)
  const [collections, setCollections] = useState(collectionsData)
  const [favorites, setFavorites] = useState([1, 3]) // IDs of favorited resources
  const [showCreateMiniCollectionModal, setShowCreateMiniCollectionModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("📚")
  const [resourceCollections, setResourceCollections] = useState({}) // Maps resource IDs to arrays of collection IDs

  // Initialize resourceCollections with sample data
  useEffect(() => {
    const initialResourceCollections = {}
    resources.forEach((resource) => {
      initialResourceCollections[resource.id] = []
    })
    // Add some sample mappings
    initialResourceCollections[1] = [1] // Khan Academy in Math Resources
    initialResourceCollections[3] = [2] // Mystery Science in Science Experiments
    setResourceCollections(initialResourceCollections)
  }, [])

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case "Website":
        return <Globe className="h-4 w-4" />
      case "Video":
        return <Video className="h-4 w-4" />
      case "Book":
        return <BookOpen className="h-4 w-4" />
      case "Curriculum":
        return <FileText className="h-4 w-4" />
      case "Podcast":
        return <Headphones className="h-4 w-4" />
      case "App":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const toggleFavorite = (resourceId) => {
    if (favorites.includes(resourceId)) {
      setFavorites(favorites.filter((id) => id !== resourceId))
      toast({
        title: "Removed from favorites",
        description: "Resource has been removed from your favorites",
      })
    } else {
      setFavorites([...favorites, resourceId])
      toast({
        title: "Added to favorites",
        description: "Resource has been added to your favorites",
      })
    }
  }

  const toggleResourceInCollection = (resourceId, collectionId) => {
    const currentCollections = resourceCollections[resourceId] || []

    if (currentCollections.includes(collectionId)) {
      // Remove from collection
      const updatedCollectionsResource = currentCollections.filter((id) => id !== collectionId)
      setResourceCollections({
        ...resourceCollections,
        [resourceId]: updatedCollectionsResource,
      })

      // Update collection count
      const updatedCollectionsCount = collections.map((collection) => {
        if (collection.id === collectionId) {
          return { ...collection, count: collection.count - 1 }
        }
        return collection
      })
      setCollections(updatedCollectionsCount)

      toast({
        title: "Removed from collection",
        description: `Resource removed from ${collections.find((c) => c.id === collectionId)?.name}`,
      })
    } else {
      // Add to collection
      setResourceCollections({
        ...resourceCollections,
        [resourceId]: [...currentCollections, collectionId],
      })

      // Update collection count
      const updatedCollectionsCount = collections.map((collection) => {
        if (collection.id === collectionId) {
          return { ...collection, count: collection.count + 1 }
        }
        return collection
      })
      setCollections(updatedCollectionsCount)

      toast({
        title: "Added to collection",
        description: `Resource added to ${collections.find((c) => c.id === collectionId)?.name}`,
      })
    }
  }

  const createNewCollection = () => {
    if (!newCollectionName.trim()) return

    const newCollection = {
      id: collections.length + 1,
      name: newCollectionName,
      count: 0,
      icon: selectedIcon,
    }

    setCollections([...collections, newCollection])
    setNewCollectionName("")
    setSelectedIcon("📚")
    setShowCreateMiniCollectionModal(false)

    toast({
      title: "Collection created",
      description: `${newCollectionName} has been created`,
    })
  }

  const getFavoriteResources = () => {
    return resources.filter((resource) => favorites.includes(resource.id))
  }

  const getCollectionResources = (collectionId) => {
    return resources.filter((resource) => {
      const resourceCollectionIds = resourceCollections[resource.id] || []
      return resourceCollectionIds.includes(collectionId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Resource Library</h2>
        <Dialog open={showAddResourceModal} onOpenChange={setShowAddResourceModal}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-xl border-gradient">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />📚 Add New Resource
              </DialogTitle>
              <DialogDescription>Share educational resources with the homeschool community</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resource-title">Resource Title</Label>
                <Input id="resource-title" placeholder="Enter resource title" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-url">URL</Label>
                <Input id="resource-url" placeholder="https://example.com" className="rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-type">Resource Type</Label>
                  <Select>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="curriculum">Curriculum</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="app">App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-rating">Rating (1-5)</Label>
                  <Select>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">⭐</SelectItem>
                      <SelectItem value="2">⭐⭐</SelectItem>
                      <SelectItem value="3">⭐⭐⭐</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Grade Levels</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["K-2", "3-5", "6-8", "9-12"].map((grade) => (
                    <div key={grade} className="flex items-center space-x-2">
                      <Checkbox id={`grade-${grade}`} />
                      <Label htmlFor={`grade-${grade}`}>{grade}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Math", "Science", "History", "Language Arts", "Art", "Music"].map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox id={`subject-${subject}`} />
                      <Label htmlFor={`subject-${subject}`}>{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-tags">Tags (comma separated)</Label>
                <Input id="resource-tags" placeholder="homeschool, free, interactive" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-description">Description</Label>
                <Textarea id="resource-description" placeholder="Describe this resource" className="rounded-lg" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddResourceModal(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button
                onClick={() => setShowAddResourceModal(false)}
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                ✅ Save Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="w-full pl-8 sm:w-[300px] rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="rounded-full p-1 bg-muted/50">
          <TabsTrigger value="browse" className="rounded-full">
            Browse Resources
          </TabsTrigger>
          <TabsTrigger value="collections" className="rounded-full">
            My Collections
          </TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-full">
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Card className="rounded-xl border-gradient">
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>Browse curated educational resources for homeschooling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-indigo-100 p-2 flex-shrink-0">
                          {getResourceTypeIcon(resource.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < resource.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1 rounded-full">
                        {getResourceTypeIcon(resource.type)}
                        {resource.type}
                      </Badge>
                      {resource.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="rounded-full">
                          {subject}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="rounded-full">
                        Grades: {resource.grades.join(", ")}
                      </Badge>
                    </div>
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={favorites.includes(resource.id) ? "default" : "outline"}
                              size="sm"
                              className={`rounded-full transition-all duration-300 ${
                                favorites.includes(resource.id)
                                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
                                  : ""
                              }`}
                              onClick={() => toggleFavorite(resource.id)}
                            >
                              <Star
                                className={`mr-2 h-4 w-4 transition-all duration-300 ${
                                  favorites.includes(resource.id) ? "text-white fill-white animate-star-bounce" : ""
                                }`}
                              />
                              {favorites.includes(resource.id) ? "Favorited" : "Favorite"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {favorites.includes(resource.id) ? "Click to unfavorite" : "Click to favorite"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full">
                            <FolderOpen className="mr-2 h-4 w-4" />
                            Add to Collection
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3 rounded-xl">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Add to Collection</h4>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                              {collections.map((collection) => {
                                const isInCollection = (resourceCollections[resource.id] || []).includes(collection.id)
                                return (
                                  <div key={collection.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`collection-${collection.id}-resource-${resource.id}`}
                                      checked={isInCollection}
                                      onCheckedChange={() => toggleResourceInCollection(resource.id, collection.id)}
                                    />
                                    <Label
                                      htmlFor={`collection-${collection.id}-resource-${resource.id}`}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <span className="mr-2">{collection.icon}</span>
                                      {collection.name}
                                    </Label>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="pt-2 border-t mt-2">
                              <Dialog
                                open={showCreateMiniCollectionModal}
                                onOpenChange={setShowCreateMiniCollectionModal}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="w-full justify-start rounded-lg">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Collection
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[400px] rounded-xl">
                                  <DialogHeader>
                                    <DialogTitle>Create New Collection</DialogTitle>
                                    <DialogDescription>
                                      Create a new collection to organize your resources
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="mini-collection-name">Collection Name</Label>
                                      <Input
                                        id="mini-collection-name"
                                        placeholder="e.g., Science Experiments"
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        className="rounded-lg"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Choose Icon</Label>
                                      <div className="grid grid-cols-6 gap-2">
                                        {["📚", "🧪", "🌍", "🔢", "🎨", "🎵", "🧠", "📝", "🏛️", "🧩"].map((icon) => (
                                          <Button
                                            key={icon}
                                            variant={selectedIcon === icon ? "default" : "outline"}
                                            className={`h-10 w-10 p-0 text-lg rounded-lg ${
                                              selectedIcon === icon
                                                ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                                                : ""
                                            }`}
                                            onClick={() => setSelectedIcon(icon)}
                                          >
                                            {icon}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowCreateMiniCollectionModal(false)}
                                      className="rounded-lg"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={createNewCollection}
                                      className="rounded-lg"
                                      disabled={!newCollectionName.trim()}
                                    >
                                      Create
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Button size="sm" asChild className="rounded-full">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full rounded-lg">
                Load More Resources
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card className="rounded-xl border-gradient">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Collections</CardTitle>
                  <CardDescription>Organize resources into collections</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-full bg-primary/10 p-2 text-xl">{collection.icon}</div>
                      <div>
                        <h3 className="font-medium">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground">{collection.count} resources</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full rounded-lg"
                      onClick={() => setSelectedCollection(collection)}
                    >
                      View Collection
                    </Button>
                  </div>
                ))}

                <Dialog open={showCreateCollectionModal} onOpenChange={setShowCreateCollectionModal}>
                  <DialogTrigger asChild>
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 border-gradient">
                      <div className="rounded-full bg-muted p-3 mb-3 text-xl">📁</div>
                      <h3 className="font-medium">Create New Collection</h3>
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        Organize your resources by creating a new collection
                      </p>
                      <Button variant="outline" className="w-full rounded-lg">
                        Create Collection
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-xl border-gradient">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-xl">
                        <FolderOpen className="mr-2 h-5 w-5 text-indigo-500" />
                        🗃️ Create a New Collection
                      </DialogTitle>
                      <DialogDescription>Organize your resources into a themed collection</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="collection-name">Collection Name</Label>
                        <Input id="collection-name" placeholder="e.g., Science Experiments" className="rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collection-description">Description (optional)</Label>
                        <Textarea
                          id="collection-description"
                          placeholder="Describe this collection"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collection-icon">Cover Icon</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {["📚", "🧪", "🌍", "🔢", "🎨", "🎵", "🧠", "📝", "🏛️", "🧩"].map((icon) => (
                            <Button key={icon} variant="outline" className="h-10 w-10 p-0 text-lg rounded-lg">
                              {icon}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="initial-resources">Initial Resources</Label>
                        <Select>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select resources to add" />
                          </SelectTrigger>
                          <SelectContent>
                            {resources.map((resource) => (
                              <SelectItem key={resource.id} value={resource.id.toString()}>
                                {resource.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateCollectionModal(false)}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setShowCreateCollectionModal(false)}
                        className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      >
                        📁 Create Collection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card className="rounded-xl border-gradient">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Favorite Resources</CardTitle>
                  <CardDescription>Quick access to your favorite educational resources</CardDescription>
                </div>
                <Dialog open={showAddFavoriteModal} onOpenChange={setShowAddFavoriteModal}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Favorite
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px] rounded-xl border-gradient">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                        Add to Favorites
                      </DialogTitle>
                      <DialogDescription>Select a resource to add to your favorites</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select a resource" />
                        </SelectTrigger>
                        <SelectContent>
                          {resources.map((resource) => (
                            <SelectItem key={resource.id} value={resource.id.toString()}>
                              {resource.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddFavoriteModal(false)} className="rounded-lg">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setShowAddFavoriteModal(false)}
                        className="rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
                      >
                        Add to Favorites
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFavoriteResources().map((resource) => (
                  <div
                    key={resource.id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-indigo-100 p-2 flex-shrink-0">
                          {getResourceTypeIcon(resource.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-red-500"
                          onClick={() => toggleFavorite(resource.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1 rounded-full">
                        {getResourceTypeIcon(resource.type)}
                        {resource.type}
                      </Badge>
                      {resource.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="rounded-full">
                          {subject}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="rounded-full">
                        Grades: {resource.grades.join(", ")}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <Button size="sm" asChild className="rounded-full">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collection View Modal */}
        <Dialog
          open={!!selectedCollection}
          onOpenChange={(open) => !open && setSelectedCollection(null)}
          className="max-w-4xl"
        >
          <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto rounded-xl border-gradient">
            {selectedCollection && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center text-2xl">
                    <div className="rounded-full bg-primary/10 p-2 text-xl mr-2">{selectedCollection.icon}</div>📁{" "}
                    {selectedCollection.name}
                  </DialogTitle>
                  <DialogDescription>Manage resources in this collection</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  {/* Collection Overview Section */}
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">📘 Collection Overview</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Collection Name</p>
                        <p className="text-muted-foreground">{selectedCollection.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Description</p>
                        <p className="text-muted-foreground">
                          A curated collection of {selectedCollection.name.toLowerCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Resources</p>
                        <p className="text-muted-foreground">{selectedCollection.count} resources</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Pencil className="mr-2 h-4 w-4" />
                        ✏️ Edit Collection Info
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" />
                        🗑️ Delete Collection
                      </Button>
                    </div>
                  </div>

                  {/* Add Resource to Collection */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">📚 Resources in Collection</h3>
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Resource to Collection
                    </Button>
                  </div>

                  {/* Resource List */}
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    {getCollectionResources(selectedCollection.id).map((resource) => (
                      <div
                        key={resource.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-indigo-100 p-2 flex-shrink-0">
                              {getResourceTypeIcon(resource.type)}
                            </div>
                            <div>
                              <h3 className="font-medium">{resource.title}</h3>
                              <p className="text-sm text-muted-foreground">{resource.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-red-500"
                              onClick={() => toggleResourceInCollection(resource.id, selectedCollection.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="flex items-center gap-1 rounded-full">
                            {getResourceTypeIcon(resource.type)}
                            {resource.type}
                          </Badge>
                          {resource.subjects.map((subject) => (
                            <Badge key={subject} variant="secondary" className="rounded-full">
                              {subject}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="rounded-full">
                            Grades: {resource.grades.join(", ")}
                          </Badge>
                        </div>
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={favorites.includes(resource.id) ? "default" : "outline"}
                                  size="sm"
                                  className={`rounded-full transition-all duration-300 ${
                                    favorites.includes(resource.id)
                                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
                                      : ""
                                  }`}
                                  onClick={() => toggleFavorite(resource.id)}
                                >
                                  <Star
                                    className={`mr-2 h-4 w-4 transition-all duration-300 ${
                                      favorites.includes(resource.id) ? "text-white fill-white" : ""
                                    }`}
                                  />
                                  ⭐ {favorites.includes(resource.id) ? "Favorited" : "Favorite"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {favorites.includes(resource.id) ? "Click to unfavorite" : "Click to favorite"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button size="sm" asChild className="rounded-full">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              ↗️ Visit
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Tabs>

      {/* Add CSS for star animation */}
      <style jsx global>{`
        @keyframes star-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .animate-star-bounce {
          animation: star-bounce 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
