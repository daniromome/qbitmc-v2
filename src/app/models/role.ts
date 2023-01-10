export type Role = 'qbitor' | 'mod' | 'supporter' | 'admin' | 'guest'

export type Roles = {
  role: Role,
  expires: string
}[]
