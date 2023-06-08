import { PlayerStatistics } from './player-statistics'
export interface Leaderboards {
  [k: string]: PlayerStatistics[]
}
