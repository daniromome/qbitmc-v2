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
          age: number
          approved: boolean | null
          created_at: string | null
          discord: string | null
          experience: string
          id: string
          ign: string
          locale: string
          message: string | null
          nickname: string
          profile: string
          reasons: string
          rules: boolean
          uuid: string
        }
        Insert: {
          age: number
          approved?: boolean | null
          created_at?: string | null
          discord?: string | null
          experience: string
          id?: string
          ign: string
          locale?: string
          message?: string | null
          nickname: string
          profile: string
          reasons: string
          rules: boolean
          uuid: string
        }
        Update: {
          age?: number
          approved?: boolean | null
          created_at?: string | null
          discord?: string | null
          experience?: string
          id?: string
          ign?: string
          locale?: string
          message?: string | null
          nickname?: string
          profile?: string
          reasons?: string
          rules?: boolean
          uuid?: string
        }
      }
      profiles: {
        Row: {
          email: string | null
          id: string
          name: string | null
          picture: string | null
        }
        Insert: {
          email?: string | null
          id: string
          name?: string | null
          picture?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          name?: string | null
          picture?: string | null
        }
      }
      roles: {
        Row: {
          discord: string | null
          id: string
          name: string
          weight: number
        }
        Insert: {
          discord?: string | null
          id?: string
          name: string
          weight: number
        }
        Update: {
          discord?: string | null
          id?: string
          name?: string
          weight?: number
        }
      }
      stripe: {
        Row: {
          customer: string
          id: string
          profile: string
        }
        Insert: {
          customer: string
          id?: string
          profile: string
        }
        Update: {
          customer?: string
          id?: string
          profile?: string
        }
      }
      user_roles: {
        Row: {
          expires: string | null
          id: string
          profile: string
          role: string
        }
        Insert: {
          expires?: string | null
          id?: string
          profile: string
          role: string
        }
        Update: {
          expires?: string | null
          id?: string
          profile?: string
          role?: string
        }
      }
    }
    Views: {
      discord_profiles: {
        Row: {
          id: string | null
          ign: string | null
          name: string | null
        }
      }
      max_permission_level: {
        Row: {
          profile: string | null
          weight: number | null
        }
      }
      minecraft_profiles: {
        Row: {
          id: string | null
          name: string | null
        }
        Insert: {
          id?: string | null
          name?: string | null
        }
        Update: {
          id?: string | null
          name?: string | null
        }
      }
      supporters: {
        Row: {
          id: string | null
          name: string | null
        }
      }
      users: {
        Row: {
          application: Json | null
          discord: Json | null
          id: string | null
          minecraft: Json | null
          nickname: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
