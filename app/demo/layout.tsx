import type React from "react"
import { FloatingActionButton } from "@/components/floating-action-button"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FloatingActionButton />
    </>
  )
}
