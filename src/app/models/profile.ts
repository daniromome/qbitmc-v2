import { Role } from './role'

export interface Profile {
  id: string
  forename: string
  customer: string
  minecraft: {
    id: string,
    name: string
  }
  application?: {
    createdAt?: string,
    approved?: boolean
  }
  roles: Role[]
  disabled: boolean
}
