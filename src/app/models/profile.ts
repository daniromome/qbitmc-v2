import { Role } from './role'

export interface Profile {
  id: string
  forename: string
  customer: string
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
  disabled: boolean
}

export interface DiscordProfile {
  id: string
  username: string
}

export interface KeycloakToken {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: string
  'not-before-policy': number
  session_state: string
  scope: string
}
