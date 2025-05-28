import { HeroSection } from "@/components/how-it-works/hero-section"
import { ParentSection } from "@/components/how-it-works/parent-section"
import { StudentSection } from "@/components/how-it-works/student-section"
import { HowItWorksSection } from "@/components/how-it-works/how-it-works-section"
import { DifferenceSection } from "@/components/how-it-works/difference-section"
import { ToolsSection } from "@/components/how-it-works/tools-section"
import { TestimonialsSection } from "@/components/how-it-works/testimonials-section"
import { SafetySection } from "@/components/how-it-works/safety-section"
import { CTASection } from "@/components/how-it-works/cta-section"
import { PublicNav } from "@/components/public-nav"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <PublicNav />
      <main className="pb-20">
        <HeroSection />
        <ParentSection />
        <StudentSection />
        <HowItWorksSection />
        <DifferenceSection />
        <ToolsSection />
        <TestimonialsSection />
        <SafetySection />
        <CTASection />
      </main>
    </div>
  )
}
