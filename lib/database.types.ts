export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      parent_onboarding_assessment: {
        Row: {
          id: string
          child_age_grade: string
          learning_style: string
          parent_involvement: string
          peer_interaction: string
          main_concern: string
          session_token: string
          created_at: string
        }
        Insert: {
          id?: string
          child_age_grade: string
          learning_style: string
          parent_involvement: string
          peer_interaction: string
          main_concern: string
          session_token: string
          created_at?: string
        }
        Update: {
          id?: string
          child_age_grade?: string
          learning_style?: string
          parent_involvement?: string
          peer_interaction?: string
          main_concern?: string
          session_token?: string
          created_at?: string
        }
      }
      student: {
        Row: {
          id: string
          parent_id: string
          full_name: string
          grade_level: string
          schedule_json?: Json
          expectations?: Json
          assigned_tools?: string[]
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          full_name: string
          grade_level: string
          schedule_json?: Json
          expectations?: Json
          assigned_tools?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          full_name?: string
          grade_level?: string
          schedule_json?: Json
          expectations?: Json
          assigned_tools?: string[]
          created_at?: string
        }
      }
      parent_profile: {
        Row: {
          id: string
          full_name: string
          email: string
          utah_affiliation?: string
          preferences_json?: Json
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          utah_affiliation?: string
          preferences_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          utah_affiliation?: string
          preferences_json?: Json
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
