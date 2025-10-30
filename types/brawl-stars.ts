export interface BrawlerStat {
  id: number
  name: string
  power: number
  rank: number
  trophies: number
  highestTrophies: number
}

export interface PlayerProfile {
  tag: string
  name: string
  trophies: number
  highestTrophies: number
  "3vs3Victories": number
  soloVictories: number
  duoVictories: number
  brawlers: BrawlerStat[]
}

export interface Battle {
  battleTime: string
  event: {
    id: number
    mode: string
    map: string
  }
  battle: {
    mode: string
    type: string
    result?: string
    duration?: number
    trophyChange?: number
    teams?: Array<Array<{ tag: string; name: string; brawler: { name: string } }>>
    players?: Array<{ tag: string; name: string; brawler: { name: string } }>
  }
}

export interface BattleLog {
  items: Battle[]
}

export interface ActiveEvent {
  slot: {
    id: number
    name: string
  }
  startTime: string
  endTime: string
  map: {
    id: number
    name: string
  }
}

export interface EventsResponse {
  active: ActiveEvent[]
}

export interface BrawlerRecommendation {
  name: string
  reason: string
  winRate?: number
  playerPower?: number
  confidence: "high" | "medium" | "low"
}

export interface EventRecommendation {
  event: ActiveEvent
  recommendations: BrawlerRecommendation[]
  rankedAdvice?: string
  matchupInsights?: string[]
}

export interface AnalysisResult {
  player: PlayerProfile
  eventRecommendations: EventRecommendation[]
  timestamp: string
}
