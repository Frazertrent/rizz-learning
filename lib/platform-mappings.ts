// Map of subjects and courses to their respective platform URLs
// This could be expanded to be user-configurable in the future

import { createClient } from "@supabase/supabase-js"

type PlatformMapping = {
  url: string
  title: string
  description?: string
  logoUrl?: string
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Get platform information for a subject and course
 * @param subject The subject name
 * @param course The course name (optional)
 * @returns Platform mapping with URL and title
 */
export async function getPlatformForCourse(subject: string, course?: string): Promise<PlatformMapping> {
  try {
    // First try to find a specific platform for the course if provided
    if (course) {
      const { data: coursePlatform, error: courseError } = await supabase
        .from('course_platforms')
        .select('*')
        .eq('subject_name', subject)
        .eq('course_name', course)
        .single()

      if (!courseError && coursePlatform) {
    return {
          url: coursePlatform.url,
          title: coursePlatform.title,
          description: coursePlatform.description,
          logoUrl: coursePlatform.logo_url
        }
    }
  }

    // If no course-specific platform found, try to find a default platform for the subject
    const { data: subjectPlatform, error: subjectError } = await supabase
      .from('subject_platforms')
      .select('*')
      .eq('subject_name', subject)
      .single()

    if (!subjectError && subjectPlatform) {
      return {
        url: subjectPlatform.url,
        title: subjectPlatform.title,
        description: subjectPlatform.description,
        logoUrl: subjectPlatform.logo_url
      }
    }

    // Try to get any default platform from the default_platforms table
    const { data: defaultPlatform, error: defaultError } = await supabase
      .from('default_platforms')
      .select('*')
      .eq('is_active', true)
      .single()

    if (!defaultError && defaultPlatform) {
      return {
        url: defaultPlatform.url,
        title: defaultPlatform.title,
        description: defaultPlatform.description,
        logoUrl: defaultPlatform.logo_url
      }
    }

    // If no platforms are configured, return an error state
    return {
      url: '#',
      title: 'No Platform Configured',
      description: 'Please configure learning platforms in your settings'
    }
  } catch (error) {
    console.error('Error in getPlatformForCourse:', error)
    return {
      url: '#',
      title: 'Error Loading Platform',
      description: 'There was an error loading the learning platform'
    }
  }
}

/**
 * Get all available platforms for a subject
 * @param subject The subject name
 * @returns Array of platform mappings
 */
export async function getAllPlatformsForSubject(subject: string): Promise<PlatformMapping[]> {
  try {
    // Get all platforms for the subject
    const { data: platforms, error } = await supabase
      .from('course_platforms')
      .select('*')
      .eq('subject_name', subject)
      .order('title')

    if (error) {
      console.error('Error fetching platforms:', error)
      return []
  }

    if (!platforms || platforms.length === 0) {
      // Try to get default platforms if no subject-specific platforms found
      const { data: defaultPlatforms, error: defaultError } = await supabase
        .from('default_platforms')
        .select('*')
        .eq('is_active', true)
        .order('title')

      if (!defaultError && defaultPlatforms && defaultPlatforms.length > 0) {
        return defaultPlatforms.map(platform => ({
          url: platform.url,
          title: platform.title,
          description: platform.description,
          logoUrl: platform.logo_url
        }))
      }

      return []
    }

    return platforms.map(platform => ({
      url: platform.url,
      title: platform.title,
      description: platform.description,
      logoUrl: platform.logo_url
    }))
  } catch (error) {
    console.error('Error in getAllPlatformsForSubject:', error)
    return []
  }
}

/**
 * Get all available subjects
 * @returns Array of subject names
 */
export async function getAllSubjects(): Promise<string[]> {
  try {
    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('name')
      .order('name')

    if (error || !subjects) {
      console.error('Error fetching subjects:', error)
      return []
    }

    return subjects.map(s => s.name)
  } catch (error) {
    console.error('Error in getAllSubjects:', error)
    return []
  }
}
