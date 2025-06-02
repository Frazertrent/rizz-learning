export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    tables: {
      parent_intake_form: {
        Row: {
          id: string
          parent_id: string
          educational_goals: string[]
          other_goal: string | null
          target_gpa: Json | null
          outcome_level: string | null
          custom_outcome: string | null
          home_percentage: number | null
          subject_locations: Json | null
          hybrid_options: string[] | null
          other_hybrid_option: string | null
          platforms: string[] | null
          other_platform: string | null
          want_recommendations: boolean | null
          school_days: string[] | null
          start_time: string | null
          end_time: string | null
          has_different_times: boolean | null
          day_specific_times: Json | null
          block_length: number | null
          term_structure: string | null
          term_length: number | null
          term_unit: string | null
          courses: Json[] | null
          mentor_personality: string[] | null
          other_personality: string | null
          structure_preference: string | null
          educational_values: string[] | null
          other_value: string | null
          extracurriculars: string[] | null
          other_extracurricular: string | null
          devices: string[] | null
          task_delivery: string | null
          parent_involvement: string | null
          oversight_preferences: string[] | null
          penalty_level: string | null
          custom_penalties: Json | null
          education_budget: string | null
          reward_budget: string | null
          check_for_grants: boolean | null
          household_income: string | null
          dependents: string | null
          parent_education: string | null
          zip_code: string | null
          demographics: Json | null
          parent_info: Json | null
          application_students: Json[] | null
          address: string | null
          district: string | null
          contact_email: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          educational_goals?: string[]
          other_goal?: string | null
          target_gpa?: Json | null
          outcome_level?: string | null
          custom_outcome?: string | null
          home_percentage?: number | null
          subject_locations?: Json | null
          hybrid_options?: string[] | null
          other_hybrid_option?: string | null
          platforms?: string[] | null
          other_platform?: string | null
          want_recommendations?: boolean | null
          school_days?: string[] | null
          start_time?: string | null
          end_time?: string | null
          has_different_times?: boolean | null
          day_specific_times?: Json | null
          block_length?: number | null
          term_structure?: string | null
          term_length?: number | null
          term_unit?: string | null
          courses?: Json[] | null
          mentor_personality?: string[] | null
          other_personality?: string | null
          structure_preference?: string | null
          educational_values?: string[] | null
          other_value?: string | null
          extracurriculars?: string[] | null
          other_extracurricular?: string | null
          devices?: string[] | null
          task_delivery?: string | null
          parent_involvement?: string | null
          oversight_preferences?: string[] | null
          penalty_level?: string | null
          custom_penalties?: Json | null
          education_budget?: string | null
          reward_budget?: string | null
          check_for_grants?: boolean | null
          household_income?: string | null
          dependents?: string | null
          parent_education?: string | null
          zip_code?: string | null
          demographics?: Json | null
          parent_info?: Json | null
          application_students?: Json[] | null
          address?: string | null
          district?: string | null
          contact_email?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          educational_goals?: string[]
          other_goal?: string | null
          target_gpa?: Json | null
          outcome_level?: string | null
          custom_outcome?: string | null
          home_percentage?: number | null
          subject_locations?: Json | null
          hybrid_options?: string[] | null
          other_hybrid_option?: string | null
          platforms?: string[] | null
          other_platform?: string | null
          want_recommendations?: boolean | null
          school_days?: string[] | null
          start_time?: string | null
          end_time?: string | null
          has_different_times?: boolean | null
          day_specific_times?: Json | null
          block_length?: number | null
          term_structure?: string | null
          term_length?: number | null
          term_unit?: string | null
          courses?: Json[] | null
          mentor_personality?: string[] | null
          other_personality?: string | null
          structure_preference?: string | null
          educational_values?: string[] | null
          other_value?: string | null
          extracurriculars?: string[] | null
          other_extracurricular?: string | null
          devices?: string[] | null
          task_delivery?: string | null
          parent_involvement?: string | null
          oversight_preferences?: string[] | null
          penalty_level?: string | null
          custom_penalties?: Json | null
          education_budget?: string | null
          reward_budget?: string | null
          check_for_grants?: boolean | null
          household_income?: string | null
          dependents?: string | null
          parent_education?: string | null
          zip_code?: string | null
          demographics?: Json | null
          parent_info?: Json | null
          application_students?: Json[] | null
          address?: string | null
          district?: string | null
          contact_email?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student: {
        Row: {
          id: string
          parent_id: string
          full_name: string
          first_name: string | null
          last_name: string | null
          username: string | null
          age: number | null
          grade_level: string | null
          schedule_json: Json | null
          expectations: Json | null
          assigned_tools: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          full_name: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          age?: number | null
          grade_level?: string | null
          schedule_json?: Json | null
          expectations?: Json | null
          assigned_tools?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          full_name?: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          age?: number | null
          grade_level?: string | null
          schedule_json?: Json | null
          expectations?: Json | null
          assigned_tools?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      parent_onboarding_assessment: {
        Row: {
          id: string
          parent_id: string | null
          child_age_grade: string | null
          learning_style: string | null
          parent_involvement: string | null
          peer_interaction: string | null
          main_concern: string | null
          session_token: string | null
          assessment_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          child_age_grade?: string | null
          learning_style?: string | null
          parent_involvement?: string | null
          peer_interaction?: string | null
          main_concern?: string | null
          session_token?: string | null
          assessment_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          child_age_grade?: string | null
          learning_style?: string | null
          parent_involvement?: string | null
          peer_interaction?: string | null
          main_concern?: string | null
          session_token?: string | null
          assessment_data?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
