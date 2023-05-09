import { Role } from './role'

export interface Profile {
  id: string
  nickname: string
  minecraft: {
    id: string,
    name: string
  }
  application?: {
    createdAt?: string,
    approved?: boolean
  }
  roles: Role[]
}
