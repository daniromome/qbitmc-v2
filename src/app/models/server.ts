import { Visibility } from './visibility'

export interface Server {
  id: string
  name: string
  description: string
  game: string
  images: string[]
  ip: string
  loader: string
  version: string
  visibility: Visibility
}
