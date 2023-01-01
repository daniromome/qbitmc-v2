import { Roles } from './role'
export interface Profile {
  id?: string
  name: string
  picture: string
  uuid?: string
  roles: Roles
  approved?: boolean
}
