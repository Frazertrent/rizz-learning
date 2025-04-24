import { Skeleton } from "@/components/ui/skeleton"

export default function GradesLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[240px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
      </div>

      <div>
        <Skeleton className="h-10 w-[400px] mb-4" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    </div>
  )
}
