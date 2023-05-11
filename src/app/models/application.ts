/* eslint-disable @typescript-eslint/naming-convention */
export interface EnrollmentApplication {
  id?: string
  created_at?: string
  forename: string
  age: number
  reasons: string
  experience: string
  rules: boolean
  approved?: boolean | undefined
}
