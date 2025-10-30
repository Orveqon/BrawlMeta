import type { Player, Event, BattleLog } from "@/types/brawl-stars"

const API_BASE = "https://proxy.royaleapi.dev/v1"
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDM5NjUsImlhdCI6MTczMDI5NTU0NCwidGlwbyI6InYxIn0.Aq-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu-Vu"

class BrawlStarsAPI {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getPlayerProfile(playerTag: string): Promise<Player> {
    const data = await this.fetch<any>(`/players/%23${playerTag}`)

    return {
      tag: data.tag.replace("#", ""),
      name: data.name,
      trophies: data.trophies,
      highestTrophies: data.highestTrophies,
      brawlers: data.brawlers.map((b: any) => ({
        id: b.id,
        name: b.name,
        power: b.power,
        rank: b.rank,
        trophies: b.trophies,
        highestTrophies: b.highestTrophies,
      })),
    }
  }

  async getBattleLog(playerTag: string): Promise<BattleLog> {
    const data = await this.fetch<any>(`/players/%23${playerTag}/battlelog`)

    return {
      items: data.items.map((item: any) => ({
        battleTime: item.battleTime,
        event: {
          id: item.event.id,
          mode: item.event.mode,
          map: item.event.map,
        },
        battle: {
          mode: item.battle.mode,
          type: item.battle.type,
          result: item.battle.result,
          duration: item.battle.duration,
        },
      })),
    }
  }

  async getActiveEvents(): Promise<Event[]> {
    const data = await this.fetch<any>("/events/rotation")

    // Filter for active events and map to our Event type
    return data
      .filter((event: any) => event.startTime && event.endTime)
      .slice(0, 8) // Limit to 8 events
      .map((event: any) => ({
        id: event.event.id,
        mode: event.event.mode,
        map: event.event.map,
        startTime: event.startTime,
        endTime: event.endTime,
      }))
  }
}

let apiInstance: BrawlStarsAPI | null = null

export function getBrawlStarsAPI(): BrawlStarsAPI {
  if (!apiInstance) {
    apiInstance = new BrawlStarsAPI(API_BASE, API_KEY)
  }
  return apiInstance
}

// Explicit export for better module resolution
export { BrawlStarsAPI }
