import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

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
  };

  useEffect(() => {
    fetchStudents();
  }, [JSON.stringify(studentIds)]);

  const refetch = () => {
    fetchStudents();
  };

  return {
    students,
    loading,
    error,
    refetch
  };
}; 