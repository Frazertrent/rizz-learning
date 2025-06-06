export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    tables: {
      parent_profile: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          username: string | null
          state: string | null
          school_district: string | null
          number_of_students: number | null
          preferences_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          state?: string | null
          school_district?: string | null
          number_of_students?: number | null
          preferences_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          state?: string | null
          school_district?: string | null
          number_of_students?: number | null
          preferences_json?: Json | null
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
      // Add other tables as needed
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
