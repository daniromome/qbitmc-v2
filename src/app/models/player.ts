import { Models } from 'appwrite'

export interface Player extends Models.Document {
  uuid: string
  ign: string
  qbits: number
}
