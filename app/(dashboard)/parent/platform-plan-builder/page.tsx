import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { PlatformPlanBuilder } from "@/components/parent/platform-plan-builder"
import { Button } from "@/components/ui/button"

export default function PlatformPlanBuilderPage() {
  return (
    <div className="container max-w-5xl py-6">
      <div className="mb-6">
        <Link href="/parent">
          <Button variant="ghost" className="gap-2 pl-0 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Parent Dashboard
          </Button>
        </Link>
      </div>

      <h1 className="mb-6 text-3xl font-bold tracking-tight">Platform Plan Builder</h1>

      <Suspense
        fallback={
          <div className="flex h-[200px] items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading platform plan...</p>
            </div>
          </div>
        }
      >
        <PlatformPlanBuilder />
      </Suspense>
    </div>
  )
}
