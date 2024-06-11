import { Models } from 'appwrite'
import { Profile } from './profile'

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
  profile: string
}

export interface EnrollmentApplicationDocument extends Omit<EnrollmentApplication, 'profile'>, Models.Document {
  status: EnrollmentApplicationStatus
  profile: Profile
}
