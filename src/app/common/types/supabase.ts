export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string | null
          profile: string
          nickname: string
          age: number
          uuid: string
          reasons: string
          experience: string
          rules: boolean
          approved: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          profile: string
          nickname: string
          age: number
          uuid: string
          reasons: string
          experience: string
          rules: boolean
          approved?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string | null
          profile?: string
          nickname?: string
          age?: number
          uuid?: string
          reasons?: string
          experience?: string
          rules?: boolean
          approved?: boolean | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          picture: string | null
        }
        Insert: {
          id: string
          name?: string | null
          picture?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          picture?: string | null
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          weight: number
        }
        Insert: {
          id?: string
          name: string
          weight: number
        }
        Update: {
          id?: string
          name?: string
          weight?: number
        }
      }
      user_roles: {
        Row: {
          id: string
          profile: string
          role: string
          expires: string | null
        }
        Insert: {
          id?: string
          profile: string
          role: string
          expires?: string | null
        }
        Update: {
          id?: string
          profile?: string
          role?: string
          expires?: string | null
        }
      }
    }
    Views: {
      max_permission_level: {
        Row: {
          profile: string | null
          weight: number | null
        }
      }
      users: {
        Row: {
          id: string | null
          name: string | null
          picture: string | null
          uuid: string | null
          approved: boolean | null
          roles: Json[] | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
