/* eslint-disable @typescript-eslint/naming-convention */
export interface Application {
  id?: string
  created_at?: string
  profile: string
  nickname: string
  age: number
  uuid: string
  reasons: string
  experience: string
  rules: boolean
  approved?: boolean | undefined
  ign: string
  discord?: string
  message?: string
}
