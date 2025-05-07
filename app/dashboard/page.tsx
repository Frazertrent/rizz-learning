import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, User, Users, BookOpen, Calendar, Award } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Homeschool Dashboard</h1>
      <p className="text-gray-500 text-center mb-8">Welcome to your personalized homeschool dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Profile
            </CardTitle>
            <CardDescription>Manage your parent profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Update your personal information, preferences, and account settings.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Students
            </CardTitle>
            <CardDescription>Manage student profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Add, edit, or view your student profiles and their progress.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Students
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Curriculum
            </CardTitle>
            <CardDescription>Manage your curriculum</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Create, edit, or view your curriculum plans and materials.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Curriculum
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-500" />
              Schedule
            </CardTitle>
            <CardDescription>Manage your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Create, edit, or view your daily, weekly, and monthly schedules.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Schedule
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Rewards
            </CardTitle>
            <CardDescription>Manage student rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Create, edit, or view rewards for your students.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Rewards
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              Database Test
            </CardTitle>
            <CardDescription>Test your Supabase connection</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Verify that your application is properly connected to your Supabase database.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/supabase-test" className="w-full">
              <Button variant="outline" className="w-full">
                Test Connection
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
