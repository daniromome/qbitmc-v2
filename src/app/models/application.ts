import { Models } from 'appwrite'

export interface EnrollmentApplicationStatus extends Models.Document {
  status: boolean
  application: string
  channel: string
}

export interface EnrollmentApplication {
  age: number
  reasons: string
  experience: string
  rules: boolean
  media: string[]
}

export interface EnrollmentApplicationDocument extends EnrollmentApplication, Models.Document {
  status: EnrollmentApplicationStatus
}
