import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

// Create a client component wrapper for the search params
function LoginFormWithSearchParams({ searchParams }: { searchParams?: { redirect?: string } }) {
  return <LoginForm searchParams={searchParams} />
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Logo />
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
        </div>
        <Suspense fallback={<div className="p-4 text-center">Loading login form...</div>}>
          <LoginFormWithSearchParams searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  )
}
