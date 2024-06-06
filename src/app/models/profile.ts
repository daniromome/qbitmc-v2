import { Models } from 'appwrite'
import { Player } from '@models/player'

export interface Profile extends Models.Document {
  customer: string
  players: Player[]
}
