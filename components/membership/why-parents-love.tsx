import { CheckCircle } from "lucide-react"

export function WhyParentsLove() {
  return (
    <div className="mt-20 bg-purple-900/20 rounded-xl p-8 border border-purple-800/30">
      <h2 className="text-3xl font-bold flex items-center justify-center gap-2 mb-8">
        <span className="text-yellow-400">⭐</span> Why Parents Love Rizzlearner
      </h2>

      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-lg">Takes the guesswork out of homeschooling</p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-lg">Organizes your week — and your paperwork</p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-lg">Matches you with real programs and funding</p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-lg">
            Built for <span className="italic">your</span> pace, <span className="italic">your</span> goals, and{" "}
            <span className="italic">your</span> child
          </p>
        </div>
      </div>
    </div>
  )
}
