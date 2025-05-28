"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Plus,
  Receipt,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Pencil,
  Globe,
  Map,
  Save,
  File,
  Search,
  BarChart,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

// Import useTheme at the top of the file if not already there
import { useTheme } from "next-themes"

// Sample data
const expenses = [
  {
    id: 1,
    date: "Apr 10, 2024",
    description: "Science Lab Materials",
    category: "Supplies",
    amount: 75.25,
    status: "Pending",
  },
  {
    id: 2,
    date: "Apr 5, 2024",
    description: "History Textbooks",
    category: "Books",
    amount: 120.0,
    status: "Reimbursed",
  },
  {
    id: 3,
    date: "Mar 28, 2024",
    description: "Art Supplies",
    category: "Supplies",
    amount: 45.5,
    status: "Reimbursed",
  },
  {
    id: 4,
    date: "Mar 15, 2024",
    description: "Online Course Subscription",
    category: "Digital Resources",
    amount: 29.99,
    status: "Paid",
  },
  {
    id: 5,
    date: "Mar 10, 2024",
    description: "Museum Field Trip",
    category: "Field Trips",
    amount: 35.0,
    status: "Reimbursed",
  },
  {
    id: 6,
    date: "Mar 5, 2024",
    description: "Math Workbooks",
    category: "Books",
    amount: 45.75,
    status: "Paid",
  },
  {
    id: 7,
    date: "Feb 28, 2024",
    description: "Science Experiment Kit",
    category: "Supplies",
    amount: 65.5,
    status: "Reimbursed",
  },
  {
    id: 8,
    date: "Feb 20, 2024",
    description: "Language Arts Software",
    category: "Digital Resources",
    amount: 49.99,
    status: "Paid",
  },
]

const budgets = [
  {
    id: 1,
    category: "Books",
    allocated: 500,
    spent: 320,
    remaining: 180,
    icon: <BookOpen className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 2,
    category: "Supplies",
    allocated: 300,
    spent: 210,
    remaining: 90,
    icon: <Pencil className="h-4 w-4 text-green-500" />,
  },
  {
    id: 3,
    category: "Digital Resources",
    allocated: 200,
    spent: 85,
    remaining: 115,
    icon: <Globe className="h-4 w-4 text-purple-500" />,
  },
  {
    id: 4,
    category: "Field Trips",
    allocated: 400,
    spent: 150,
    remaining: 250,
    icon: <Map className="h-4 w-4 text-amber-500" />,
  },
]

const eligibleCategories = [
  { name: "Curriculum", icon: "📚" },
  { name: "Supplies", icon: "✏️" },
  { name: "Field Trips", icon: "🚌" },
  { name: "Tutoring Services", icon: "🧑‍🏫" },
  { name: "Subscriptions", icon: "🔁" },
  { name: "Exams or Testing Fees", icon: "📋" },
  { name: "Digital Resources", icon: "💻" },
  { name: "Other", icon: "📦" },
]

// Replace the FinancialTools function with this updated version that includes all the styling improvements

export function FinancialTools() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [activeTab, setActiveTab] = useState("overview")
  const [showAllExpenses, setShowAllExpenses] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [showManageBudgetModal, setShowManageBudgetModal] = useState(false)
  const [selectedState, setSelectedState] = useState("Utah")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== categoryName))
    } else {
      setSelectedCategories([...selectedCategories, categoryName])
    }
  }

  // Text color classes based on theme - FIXED FOR PROPER CONTRAST
  const textClass = isDark ? "text-white" : "text-gray-800"
  const textMutedClass = isDark ? "text-gray-100" : "text-gray-600"
  const textSecondaryClass = isDark ? "text-gray-100" : "text-gray-600"
  const textDescriptionClass = isDark ? "text-gray-100" : "text-gray-700"
  const textValueClass = isDark ? "text-white font-bold" : "text-gray-800 font-bold"
  const textLinkClass = isDark ? "text-blue-300 hover:underline" : "text-blue-600 hover:underline"

  // Card styling classes
  const cardClass = "rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
  const cardHeaderClass = "flex items-center gap-2 pb-2"
  const cardTitleClass = `text-lg font-semibold ${textClass}`
  const cardDescriptionClass = `text-sm ${textMutedClass}`
  const statCardClass =
    "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
  const gradientHeaderClass =
    "bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 p-6 rounded-xl mb-6"

  // IMPORTANT: Add this style to force white text in dark mode for all cards in the Overview tab
  const darkModeTextFix = isDark ? "!text-white dark:!text-white" : ""
  const darkModeSubtextFix = isDark ? "!text-gray-100 dark:!text-gray-100" : ""

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold tracking-tight ${textClass}`}>💵 Financial Tools</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showAddExpenseModal} onOpenChange={setShowAddExpenseModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add a New Expense</DialogTitle>
                <DialogDescription>Enter the details of your homeschool expense below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-description">Expense Description</Label>
                  <Input id="expense-description" placeholder="Enter expense description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount ($)</Label>
                    <Input id="expense-amount" type="number" placeholder="0.00" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Date</Label>
                    <Input id="expense-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-category">Category</Label>
                  <Select>
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="supplies">Supplies</SelectItem>
                      <SelectItem value="digital">Digital Resources</SelectItem>
                      <SelectItem value="field-trips">Field Trips</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-notes">Notes (Optional)</Label>
                  <Textarea id="expense-notes" placeholder="Add any additional notes" />
                </div>
                <div className="space-y-2">
                  <Label>Receipt Upload</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop receipt image or click to browse</p>
                    <Button variant="outline" size="sm">
                      Upload Receipt
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddExpenseModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddExpenseModal(false)}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Link href="/parent/resources">
          <Button variant="outline" className="rounded-full">
            <FileText className="mr-2 h-4 w-4 text-blue-500" />📂 Resource Library
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="expenses">💸 Expenses</TabsTrigger>
          <TabsTrigger value="budget">📈 Budget</TabsTrigger>
          <TabsTrigger value="financial-aid">💰 Financial Aid</TabsTrigger>
          <TabsTrigger value="reimbursement">🧾 Reimbursement</TabsTrigger>
          <TabsTrigger value="tax-summary">📄 Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overview Tab - Styled with consistent cards and FIXED TEXT COLORS */}
          <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${isDark ? "text-white" : ""}`}>
            <div className={statCardClass}>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Budget</h3>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">$1,400.00</div>
              <p className="text-xs text-gray-600 dark:text-gray-100 mt-1">For current academic year</p>
            </div>

            <div className={statCardClass}>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                  <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Spent</h3>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">$765.00</div>
              <Progress value={(765 / 1400) * 100} className="h-2 mt-2" />
              <p className="text-xs text-gray-600 dark:text-gray-100 mt-1">55% of total budget</p>
            </div>

            <div className={statCardClass}>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Reimbursed</h3>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">$320.50</div>
              <p className="text-xs text-gray-600 dark:text-gray-100 mt-1">42% of total expenses</p>
            </div>

            <div className={statCardClass}>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                  <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Remaining</h3>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">$635.00</div>
              <p className="text-xs text-gray-600 dark:text-gray-100 mt-1">45% of total budget</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className={cardClass}>
              <CardHeader>
                <div className={cardHeaderClass}>
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                    <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                      Recent Expenses
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-100">
                      Your most recent homeschool expenses
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.slice(0, 3).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{expense.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-100">{expense.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800 dark:text-white">${expense.amount.toFixed(2)}</p>
                        <Badge
                          variant={
                            expense.status === "Reimbursed"
                              ? "success"
                              : expense.status === "Pending"
                                ? "outline"
                                : "default"
                          }
                          className="rounded-full text-xs"
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Collapsible className="w-full" open={showAllExpenses} onOpenChange={setShowAllExpenses}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full rounded-full">
                      {showAllExpenses ? (
                        <>
                          Hide All Expenses <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View All Expenses <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    {expenses.slice(3).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{expense.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-100">{expense.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800 dark:text-white">${expense.amount.toFixed(2)}</p>
                          <Badge
                            variant={
                              expense.status === "Reimbursed"
                                ? "success"
                                : expense.status === "Pending"
                                  ? "outline"
                                  : "default"
                            }
                            className="rounded-full text-xs"
                          >
                            {expense.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </CardFooter>
            </Card>

            <Card className={cardClass}>
              <CardHeader>
                <div className={cardHeaderClass}>
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                      Budget Overview
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-100">
                      Track your spending by category
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="font-medium flex items-center gap-2 text-gray-800 dark:text-white">
                          {budget.icon}
                          {budget.category}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-100">
                          ${budget.spent.toFixed(2)} / ${budget.allocated.toFixed(2)}
                        </div>
                      </div>
                      <Progress value={(budget.spent / budget.allocated) * 100} className="h-1.5 rounded-full" />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-100">
                          {Math.round((budget.spent / budget.allocated) * 100)}% used
                        </span>
                        <span className="text-gray-600 dark:text-gray-100">
                          ${budget.remaining.toFixed(2)} remaining
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={showManageBudgetModal} onOpenChange={setShowManageBudgetModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full rounded-full">
                      Manage Budget
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Budget Management</DialogTitle>
                      <DialogDescription>Update your budget categories and allocations</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {budgets.map((budget) => (
                        <div key={budget.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              {budget.icon}
                              <div className="font-medium">{budget.category}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Allocated: ${budget.allocated.toFixed(2)}</span>
                              <span>
                                Spent: ${budget.spent.toFixed(2)} ({Math.round((budget.spent / budget.allocated) * 100)}
                                %)
                              </span>
                            </div>
                            <Progress value={(budget.spent / budget.allocated) * 100} className="h-1.5 rounded-full" />
                            <div className="flex justify-between text-sm">
                              <span>Remaining: ${budget.remaining.toFixed(2)}</span>
                              <span>
                                {Math.round((budget.remaining / budget.allocated) * 100)}% of budget remaining
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowManageBudgetModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowManageBudgetModal(false)}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {/* Expenses Tab - Styled with consistent cards */}
          <Card className={cardClass}>
            <CardHeader>
              <div className={cardHeaderClass}>
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                  <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className={cardTitleClass}>Expense Tracker</CardTitle>
                  <CardDescription className={cardDescriptionClass}>
                    Track and manage your homeschool expenses
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between border-b pb-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Receipt className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className={`font-medium ${textClass}`}>{expense.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-full text-xs">
                            {expense.category}
                          </Badge>
                          <p className={`text-sm ${textMutedClass}`}>{expense.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${textClass}`}>${expense.amount.toFixed(2)}</p>
                      <Badge
                        variant={
                          expense.status === "Reimbursed"
                            ? "success"
                            : expense.status === "Pending"
                              ? "outline"
                              : "default"
                        }
                        className="rounded-full text-xs"
                      >
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="rounded-full">
                <Download className="mr-2 h-4 w-4" />
                Export Expenses
              </Button>
              <Button className="rounded-full">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          {/* Budget Tab - Styled with consistent cards */}
          <Card className={cardClass}>
            <CardHeader>
              <div className={cardHeaderClass}>
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                  <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className={cardTitleClass}>Budget Management</CardTitle>
                  <CardDescription className={cardDescriptionClass}>
                    Set and track your homeschool budget
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className={`font-medium flex items-center gap-2 ${textClass}`}>
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Academic Year 2023-2024
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Change Year
                    </Button>
                    <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="rounded-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Budget Category</DialogTitle>
                          <DialogDescription>Create a new budget category to track your expenses</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="category-name">Category Name</Label>
                            <Input id="category-name" placeholder="Enter category name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="max-budget">Max Budget Amount ($)</Label>
                            <Input id="max-budget" type="number" placeholder="0.00" step="0.01" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category-type">Category Type</Label>
                            <Select>
                              <SelectTrigger id="category-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="books">Books</SelectItem>
                                <SelectItem value="supplies">Supplies</SelectItem>
                                <SelectItem value="digital">Digital Resources</SelectItem>
                                <SelectItem value="field-trips">Field Trips</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowAddCategoryModal(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setShowAddCategoryModal(false)}>✅ Add Category</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">{budget.icon}</div>
                          <div className={`font-medium ${textClass}`}>{budget.category}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-full">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={textSecondaryClass}>Allocated: ${budget.allocated.toFixed(2)}</span>
                          <span className={textSecondaryClass}>
                            Spent: ${budget.spent.toFixed(2)} ({Math.round((budget.spent / budget.allocated) * 100)}%)
                          </span>
                        </div>
                        <Progress value={(budget.spent / budget.allocated) * 100} className="h-1.5 rounded-full" />
                        <div className="flex justify-between text-sm">
                          <span className={textSecondaryClass}>Remaining: ${budget.remaining.toFixed(2)}</span>
                          <span className={textSecondaryClass}>
                            {Math.round((budget.remaining / budget.allocated) * 100)}% of budget remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30">
                  <div className="flex justify-between items-center mb-4">
                    <div className={`font-medium ${textClass}`}>📊 Total Budget</div>
                    <div className={`font-medium ${textClass}`}>
                      ${budgets.reduce((acc, budget) => acc + budget.allocated, 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={textSecondaryClass}>
                        Total Spent: ${budgets.reduce((acc, budget) => acc + budget.spent, 0).toFixed(2)}
                      </span>
                      <span className={textSecondaryClass}>
                        Total Remaining: ${budgets.reduce((acc, budget) => acc + budget.remaining, 0).toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (budgets.reduce((acc, budget) => acc + budget.spent, 0) /
                          budgets.reduce((acc, budget) => acc + budget.allocated, 0)) *
                        100
                      }
                      className="h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="rounded-full">
                <Download className="mr-2 h-4 w-4" />
                Export Budget
              </Button>
              <Button className="rounded-full">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="financial-aid" className="space-y-6">
          {/* Financial Aid Tab - Already well styled, just ensure contrast */}
          <div className={gradientHeaderClass}>
            <h2 className={`text-2xl font-bold mb-2 flex items-center ${isDark ? "text-white" : "text-gray-800"}`}>
              <span className="text-3xl mr-2">💰</span> Discover Financial Aid & Reimbursements
            </h2>
            <p className={isDark ? "text-gray-300" : "text-gray-700"}>
              Find and apply for financial assistance for your homeschool expenses
            </p>
          </div>

          {/* 1. Browse Eligible Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${textClass}`}>
              <span className="mr-2">🗂️</span> Browse Eligible Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {eligibleCategories.map((category) => (
                <div
                  key={category.name}
                  className={`border rounded-xl p-3 transition-all duration-200 cursor-pointer flex items-center ${
                    selectedCategories.includes(category.name)
                      ? "bg-blue-50 border-blue-200 shadow-md dark:bg-blue-900/30 dark:border-blue-700"
                      : "hover:bg-gray-50 hover:shadow-sm dark:hover:bg-gray-700"
                  }`}
                  onClick={() => toggleCategory(category.name)}
                >
                  <input
                    type="checkbox"
                    id={`category-${category.name}`}
                    className="mr-2"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                  />
                  <label
                    htmlFor={`category-${category.name}`}
                    className={`flex items-center cursor-pointer flex-1 ${isDark ? "text-white" : "text-gray-700"}`}
                  >
                    <span className="mr-2 text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Search for Grants or Programs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${textClass}`}>
              <span className="mr-2">🔍</span> Search for Grants or Programs
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state-selector" className={isDark ? "text-white" : "text-gray-700"}>
                  Select your state
                </Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger id="state-selector" className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utah">Utah</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="Florida">Florida</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Other">Other State</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-search" className={isDark ? "text-white" : "text-gray-700"}>
                  Search your state or program to check eligibility
                </Label>
                <div className="relative">
                  <Input
                    id="program-search"
                    placeholder="Search programs, grants, or reimbursements..."
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {selectedState === "Utah" && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mt-3 border border-blue-100 dark:border-blue-700 animate-fade-in">
                  <h4 className="font-medium mb-2 text-gray-800 dark:text-white">Available in Utah:</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Utah Special Needs Opportunity Scholarship
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Utah Homeschool Curriculum Reimbursement Program
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      Utah My529 Education Savings Plan
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 3. Download Request Packet */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${textClass}`}>
              <span className="mr-2">📥</span> Download Request Packet
            </h3>
            <div className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl p-5 text-center mb-4">
              <Button
                size="lg"
                className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-gray-700"
              >
                <File className="mr-2 h-5 w-5" />📄 Generate Reimbursement PDF
              </Button>
              <p className="text-sm mt-3 text-gray-700 dark:text-gray-300">
                Creates a pre-filled PDF with your information and selected expenses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="submission-destination" className={isDark ? "text-white" : "text-gray-700"}>
                  Submission Destination
                </Label>
                <Select defaultValue="email">
                  <SelectTrigger id="submission-destination">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="portal">District Portal</SelectItem>
                    <SelectItem value="mail">Print to Mail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grant-category" className={isDark ? "text-white" : "text-gray-700"}>
                  Grant Category
                </Label>
                <Select defaultValue="curriculum">
                  <SelectTrigger id="grant-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curriculum">Curriculum</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="field-trips">Field Trips</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent-name" className={isDark ? "text-white" : "text-gray-700"}>
                  Parent Name
                </Label>
                <Input id="parent-name" placeholder="Your full name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email" className={isDark ? "text-white" : "text-gray-700"}>
                  Email
                </Label>
                <Input id="contact-email" type="email" placeholder="your.email@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone" className={isDark ? "text-white" : "text-gray-700"}>
                  Phone
                </Label>
                <Input id="contact-phone" placeholder="(555) 123-4567" />
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-700 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2 flex items-center text-gray-800 dark:text-white">
                <span className="mr-2">✍️</span> Manual Submission Notes
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                If you're unsure where to submit, export your packet and attach it to an email or upload through your
                district portal.
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" className="gap-2 rounded-full">
                <Save className="h-4 w-4" />💾 Save Draft for Later
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reimbursement" className="space-y-4">
          {/* Reimbursement Tab - Already well styled, just ensure contrast */}
          <Card className={cardClass}>
            <CardHeader>
              <div className={cardHeaderClass}>
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                  <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className={cardTitleClass}>Reimbursement Requests</CardTitle>
                  <CardDescription className={cardDescriptionClass}>
                    Submit and track reimbursement requests
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30">
                  <h3 className="font-medium mb-2 text-gray-800 dark:text-white">📝 Reimbursement Packet</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    This reimbursement packet will download as a printable or emailable PDF to submit to your district
                    or program authority.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="reimburse-expense" className={isDark ? "text-white" : "text-gray-700"}>
                        Select Expense(s)
                      </Label>
                      <Select>
                        <SelectTrigger id="reimburse-expense">
                          <SelectValue placeholder="Select expense" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenses
                            .filter((expense) => expense.status === "Pending")
                            .map((expense) => (
                              <SelectItem key={expense.id} value={expense.id.toString()}>
                                {expense.description} - ${expense.amount.toFixed(2)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent-name" className={isDark ? "text-white" : "text-gray-700"}>
                        Parent Name
                      </Label>
                      <Input id="parent-name" placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className={isDark ? "text-white" : "text-gray-700"}>
                        Email
                      </Label>
                      <Input id="contact-email" type="email" placeholder="your.email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone" className={isDark ? "text-white" : "text-gray-700"}>
                        Phone
                      </Label>
                      <Input id="contact-phone" placeholder="(555) 123-4567" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="district" className={isDark ? "text-white" : "text-gray-700"}>
                        Destination
                      </Label>
                      <Select>
                        <SelectTrigger id="district">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="district-1">Springfield School District</SelectItem>
                          <SelectItem value="district-2">Oakwood County Education Office</SelectItem>
                          <SelectItem value="district-3">Riverside Homeschool Program</SelectItem>
                          <SelectItem value="manual">Manual Submission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className={isDark ? "text-white" : "text-gray-700"}>Receipt Upload</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop receipt image or click to browse
                        </p>
                        <Button variant="outline" size="sm" className="rounded-full">
                          Upload Receipt
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2 flex items-center gap-2">
                      <input type="checkbox" id="send-email" className="rounded" />
                      <Label htmlFor="send-email" className={isDark ? "text-white" : "text-gray-700"}>
                        Send to My Email
                      </Label>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button className="rounded-full">
                      <File className="mr-2 h-4 w-4" />
                      Download Reimbursement Packet
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={`font-medium flex items-center ${textClass}`}>
                    <span className="mr-2">📋</span> Recent Reimbursement Requests
                  </h3>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className={`font-medium ${textClass}`}>History Textbooks</p>
                        <p className={`text-sm ${textMutedClass}`}>Submitted: Apr 3, 2024</p>
                      </div>
                      <Badge variant="success" className="rounded-full">
                        Approved
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondaryClass}>Amount: $120.00</span>
                      <span className={textSecondaryClass}>Reimbursed: Apr 5, 2024</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className={`font-medium ${textClass}`}>Art Supplies</p>
                        <p className={`text-sm ${textMutedClass}`}>Submitted: Mar 25, 2024</p>
                      </div>
                      <Badge variant="success" className="rounded-full">
                        Approved
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondaryClass}>Amount: $45.50</span>
                      <span className={textSecondaryClass}>Reimbursed: Mar 28, 2024</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className={`font-medium ${textClass}`}>Science Lab Materials</p>
                        <p className={`text-sm ${textMutedClass}`}>Submitted: Apr 10, 2024</p>
                      </div>
                      <Badge className="rounded-full">Pending</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondaryClass}>Amount: $75.25</span>
                      <span className={textSecondaryClass}>Estimated processing time: 3-5 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-summary" className="space-y-6">
          {/* Tax Summary Tab - Styled with consistent cards */}
          <div className={gradientHeaderClass}>
            <h2 className={`text-2xl font-bold mb-2 flex items-center ${isDark ? "text-white" : "text-gray-800"}`}>
              <span className="text-3xl mr-2">📄</span> Tax Summary & Preparation
            </h2>
            <p className={isDark ? "text-gray-300" : "text-gray-700"}>
              Organize your homeschool expenses for tax season
            </p>
          </div>

          {/* Section 1: Annual Tax Report Generator */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${textClass}`}>
              <span className="mr-2">🧾</span> Annual Tax Report Generator
            </h3>

            <div className="space-y-4">
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="tax-year" className={isDark ? "text-white" : "text-gray-700"}>
                  Select Tax Year
                </Label>
                <Select defaultValue="2023">
                  <SelectTrigger id="tax-year">
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="font-medium mb-3 text-gray-800 dark:text-white">Summary for Tax Year 2023</h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Homeschool Expenses</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">$1,400.00</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reimbursed Amount</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">$320.50</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Non-reimbursed Amount</p>
                      <p className="text-xl font-bold text-amber-600 dark:text-amber-400">$1,079.50</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Potential Tax Benefit</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">$215.90</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Breakdown by Category</h5>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Reimbursed
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Net Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                              📚 Books
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $500.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $120.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $380.00
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                              ✏️ Supplies
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $300.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $45.50
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $254.50
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                              💻 Digital Resources
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $200.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $0.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $200.00
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                              🚌 Field Trips
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $400.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $155.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                              $245.00
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th
                              scope="row"
                              className="px-4 py-2 text-left text-sm font-medium text-gray-800 dark:text-white"
                            >
                              Total
                            </th>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white text-right">
                              $1,400.00
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white text-right">
                              $320.50
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white text-right">
                              $1,079.50
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2 rounded-full">
                  <Download className="h-4 w-4" />
                  Download Tax Summary PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2: Tax Tips & Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${textClass}`}>
              <span className="mr-2">🧠</span> Tax Tips & Info
            </h3>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-700 rounded-lg p-4 mb-4">
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                We're not tax professionals, but here's a basic breakdown to help you prep for tax season. Always
                consult your accountant or tax advisor.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className={`font-medium ${textClass}`}>Helpful Resources:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600 dark:text-blue-400">📘</span>
                  <a
                    href="https://www.irs.gov/publications/p970"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={textLinkClass}
                  >
                    IRS Publication 970: Education Tax Benefits
                  </a>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600 dark:text-blue-400">🏛️</span>
                  <a href="#" className={textLinkClass}>
                    State-specific tax deduction resources
                  </a>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600 dark:text-blue-400">📝</span>
                  <a href="#" className={textLinkClass}>
                    Homeschool Tax Deduction Guide
                  </a>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600 dark:text-blue-400">💡</span>
                  <a href="#" className={textLinkClass}>
                    Educational Expense Documentation Tips
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-700 rounded-lg">
              <h4 className="font-medium flex items-center text-gray-800 dark:text-white mb-2">
                <span className="mr-2">💡</span> Did you know?
              </h4>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                Some states offer tax credits or deductions specifically for homeschooling families. Select your state
                below to see what might be available to you.
              </p>
              <div className="mt-3 max-w-xs">
                <Select defaultValue="Utah">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utah">Utah</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="Florida">Florida</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Export Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className={`text-xl font-semibold mb-4 flex items-center ${textClass}`}>
              <span className="mr-2">📤</span> Export Options
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-tax-summary" className="rounded" />
                <Label htmlFor="include-tax-summary" className={isDark ? "text-white" : "text-gray-700"}>
                  Include Tax Summary in Year-End Financial Packet
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-receipts" className="rounded" />
                <Label htmlFor="include-receipts" className={isDark ? "text-white" : "text-gray-700"}>
                  Include Digital Copies of All Receipts
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-category-breakdown" className="rounded" />
                <Label htmlFor="include-category-breakdown" className={isDark ? "text-white" : "text-gray-700"}>
                  Include Detailed Category Breakdown
                </Label>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="gap-2 rounded-full">
                  <FileText className="h-4 w-4" />
                  Generate Combined Report
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
