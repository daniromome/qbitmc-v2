/* eslint-disable @typescript-eslint/naming-convention */
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
      profiles: {
        Row: {
          id: string
          name: string | null
          picture: string | null
          uuid: string | null
        }
        Insert: {
          id: string
          name?: string | null
          picture?: string | null
          uuid?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          picture?: string | null
          uuid?: string | null
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
