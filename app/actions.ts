"use server"

import { getBrawlStarsAPI } from "@/lib/brawl-stars-api"
import { analyzePlayerForEvents } from "@/lib/meta-analyzer"
import type { AnalysisResult } from "@/types/brawl-stars"

export async function analyzePlayer(
  playerTag: string,
): Promise<{ success: true; data: AnalysisResult } | { success: false; error: string }> {
  try {
    const api = getBrawlStarsAPI()

    // Normalize player tag
    const normalizedTag = playerTag.toUpperCase().replace(/^#/, "")

    // Fetch data in parallel
    const [player, events] = await Promise.all([api.getPlayerProfile(normalizedTag), api.getActiveEvents()])

    // Analyze and generate recommendations
    const analysis = analyzePlayerForEvents(player, events)

    return {
      success: true,
      data: analysis,
    }
  } catch (error) {
    console.error("[v0] Error analyzing player:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze player",
    }
  }
}
