import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  user_id: string;
}

interface UseStudentsResult {
  students: Student[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudents = (studentIds?: string[]): UseStudentsResult => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Create Supabase client once
  const supabase = createClientComponentClient();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check auth status first
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth error:', authError);
        setError('Authentication error. Please log in again.');
        router.push('/login');
        return;
      }

      if (!session) {
        console.log('No active session');
        setError('Please log in to view students');
        router.push('/login');
        return;
      }

      // If no student IDs provided, return empty array
      if (!studentIds || studentIds.length === 0) {
        setStudents([]);
        return;
      }

      console.log('Fetching students with IDs:', studentIds);

      const { data, error: supabaseError } = await supabase
        .from('students')
        .select('id, first_name, last_name, user_id')
        .in('id', studentIds);

      if (supabaseError) {
        console.error('Error fetching students:', supabaseError);
        // Check for auth-related errors
        if (supabaseError.code === 'PGRST301' || supabaseError.code === '401') {
          setError('Session expired. Please log in again.');
          router.push('/login');
          return;
        }
        setError(supabaseError.message || 'Failed to fetch students');
        return;
      }

      if (!data) {
        console.log('No students found for IDs:', studentIds);
        setStudents([]);
        return;
      }

      console.log('Successfully fetched students:', data.length);
      setStudents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch students';
      console.error('Error in fetchStudents:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [supabase, studentIds, router]);

  useEffect(() => {
    fetchStudents();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setStudents([]);
        setError('Please log in to view students');
        router.push('/login');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchStudents();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchStudents, supabase.auth, router]);

  const refetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    refetch
  };
}; 