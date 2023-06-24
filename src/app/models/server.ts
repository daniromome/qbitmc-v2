import { PterodactylServer } from "./pterodactyl";

export interface Server extends Omit<PterodactylServer, 'description'> {
  ip: string
  game: string
  version: string
  staff_only: boolean
}
