import type React from "react"
import { GlobalHeader } from "@/components/global-header"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <GlobalHeader />
      <main>{children}</main>
    </>
  )
}
