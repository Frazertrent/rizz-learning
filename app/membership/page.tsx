import { MembershipHeader } from "@/components/membership/header"
import { PlanOptions } from "@/components/membership/plan-options"
import { FeatureComparison } from "@/components/membership/feature-comparison"
import { MembershipFAQ } from "@/components/membership/faq"
import { WhyParentsLove } from "@/components/membership/why-parents-love"
import { FinalCTA } from "@/components/membership/final-cta"

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12 space-y-20">
        <MembershipHeader />
        <PlanOptions />
        <FeatureComparison />
        <MembershipFAQ />
        <WhyParentsLove />
        <FinalCTA />
      </div>
    </div>
  )
}
