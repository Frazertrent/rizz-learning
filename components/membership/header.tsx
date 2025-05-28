import { CheckCircle } from "lucide-react"

export function MembershipHeader() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
        Choose the Right Plan for Your Family
      </h1>

      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        All plans include personalized tools, program matching, and access to real education support. You're not just
        subscribing — you're stepping into a system built for <span className="italic">you</span> and your child.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Cancel anytime</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>One plan supports your whole household</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Upgrade or downgrade anytime</span>
        </div>
      </div>
    </div>
  )
}
