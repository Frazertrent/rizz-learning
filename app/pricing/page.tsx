import { PublicNav } from "@/components/public-nav"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#141416] text-white">
      <PublicNav />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-orange-400 text-center">
          Pricing Plans
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto text-center">
          Choose the plan that works best for your family.
        </p>

        {/* Pricing content would go here */}
        <div className="text-center text-gray-400">Pricing page content coming soon.</div>
      </main>
    </div>
  )
}
