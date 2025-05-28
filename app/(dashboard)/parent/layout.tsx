import type React from "react"
import { ParentHeader } from "@/components/parent-header"

export default function ParentDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ParentHeader />
      <main className="py-2">{children}</main>
    </>
  )
}
