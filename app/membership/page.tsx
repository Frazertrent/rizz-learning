import { PublicNav } from "@/components/public-nav"
import { MembershipHero } from "@/components/membership/hero"
import { MembershipPlans } from "@/components/membership/plans"
import { ComparisonTable } from "@/components/membership/comparison-table"
import { MembershipFAQ } from "@/components/membership/faq"
import { FinalCTA } from "@/components/membership/final-cta"

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <PublicNav />
      <MembershipHero />
      <MembershipPlans />
      <ComparisonTable />
      <MembershipFAQ />
      <FinalCTA />
    </div>
  )
}
