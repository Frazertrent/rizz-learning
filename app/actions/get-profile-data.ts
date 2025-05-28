"use server"

import { cookies } from "next/headers"

export async function getProfileData() {
  const profileCookie = cookies().get("profile_data")

  if (!profileCookie) {
    return null
  }

  try {
    return JSON.parse(profileCookie.value)
  } catch (error) {
    console.error("Error parsing profile data cookie:", error)
    return null
  }
}
