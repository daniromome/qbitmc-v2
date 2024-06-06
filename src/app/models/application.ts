import { Models } from 'appwrite'

export interface EnrollmentApplicationStatus extends Models.Document {
  status: boolean
  application: string
}

export interface EnrollmentApplication {
  age: number
  reasons: string
  experience: string
  rules: boolean
}

export interface EnrollmentApplicationDocument extends EnrollmentApplication, Models.Document {
  status: EnrollmentApplicationStatus
}
