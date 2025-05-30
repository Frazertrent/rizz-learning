import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CoursePlatform {
  id: string;
  course: string;
  subject: string;
  platform_url?: string;
  platform_name?: string;
  platform_help?: 'needs_help' | 'no_help_needed' | null;
  student_id?: string;
  student_term_plan_id: string;
}

interface UseCoursePlatformsResult {
  platforms: CoursePlatform[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setPlatforms: (platforms: CoursePlatform[] | ((prev: CoursePlatform[]) => CoursePlatform[])) => void;
}

export const useCoursePlatforms = (termPlanId: string, studentId?: string): UseCoursePlatformsResult => {
  const [platforms, setPlatforms] = useState<CoursePlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatforms = async () => {
    if (!termPlanId) {
      console.log('No termPlanId provided to useCoursePlatforms');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching course platforms for termPlanId:', termPlanId, 'and studentId:', studentId);

      // First get the student_term_plans for this term plan
      let query = supabase
        .from('student_term_plans')
        .select('id, student_id')
        .eq('term_plan_id', termPlanId);

      // If studentId is provided, filter by student_id
      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data: studentTermPlans, error: studentTermPlansError } = await query;

      if (studentTermPlansError) {
        console.error('Error fetching student term plans:', studentTermPlansError);
        setError('Failed to fetch student term plans');
        return;
      }

      if (!studentTermPlans || studentTermPlans.length === 0) {
        console.log('No student term plans found for termPlanId:', termPlanId);
        setPlatforms([]);
        return;
      }

      const studentTermPlanIds = studentTermPlans.map(stp => stp.id);
      console.log('Found student term plan IDs:', studentTermPlanIds);

      // Query the student_course_platforms table for all student term plans
      const { data, error: supabaseError } = await supabase
        .from('student_course_platforms')
        .select('*')
        .in('student_term_plan_id', studentTermPlanIds);

      if (supabaseError) {
        console.error('Error fetching course platforms:', supabaseError);
        setError(supabaseError.message);
        return;
      }

      console.log('Successfully fetched course platforms:', data?.length || 0, 'platforms');
      setPlatforms(data || []);
    } catch (err) {
      console.error('Error in fetchPlatforms:', err);
      setError('Failed to fetch course platforms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, [termPlanId, studentId]);

  const refetch = () => {
    fetchPlatforms();
  };

  return {
    platforms,
    loading,
    error,
    refetch,
    setPlatforms
  };
};

// Helper function to get platform URL for a specific course
export const getPlatformUrlForCourse = (
  platforms: CoursePlatform[], 
  subject: string, 
  course: string
): string | null => {
  const platform = platforms.find(
    p => p.subject === subject && p.course === course
  );
  return platform?.platform_url || null;
};

// Helper function to get all platforms for a subject
export const getPlatformsForSubject = (
  platforms: CoursePlatform[], 
  subject: string
): CoursePlatform[] => {
  return platforms.filter(p => p.subject === subject);
};
