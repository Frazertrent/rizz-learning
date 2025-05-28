import { redirect } from "next/navigation"

export default function StudentLoginRedirect() {
  // This page redirects to the main login page
  redirect("/login")
}
