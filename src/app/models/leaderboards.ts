export interface LeaderboardRecord { id: string, count: number }
export interface LeaderboardExtendedRecord extends LeaderboardRecord { name: string, avatar: string }
export interface Leaderboards { [k: string]: LeaderboardExtendedRecord[] }
