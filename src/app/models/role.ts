export type Role = 'qbitor' | 'mod' | 'qbitor+' | 'admin'

export type Roles = {
  role: Role,
  expires: string
}[]
