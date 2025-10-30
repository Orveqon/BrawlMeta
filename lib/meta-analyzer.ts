import type { Player, Event, BrawlerRecommendation, RankedInsights, AnalysisResult } from "@/types/brawl-stars"

// Meta tier lists by game mode
const META_TIERS = {
  gemGrab: ["Poco", "Gene", "Tara", "Sandy", "Byron", "Emz", "Spike"],
  brawlBall: ["Stu", "Mortis", "Fang", "Max", "Gale", "Bibi", "Frank"],
  bounty: ["Piper", "Brock", "Belle", "Byron", "Nani", "Bea", "Crow"],
  heist: ["Colt", "Bull", "Darryl", "Jessie", "8-Bit", "Brock", "Dynamike"],
  hotZone: ["Poco", "Rosa", "Jacky", "Sandy", "Gene", "Emz", "Grom"],
  knockout: ["Belle", "Piper", "Byron", "Crow", "Brock", "Nani", "Stu"],
  duels: ["Fang", "Edgar", "Mortis", "Buzz", "Stu", "Bibi", "El Primo"],
  wipeout: ["Piper", "Brock", "Belle", "Byron", "Nani", "Crow", "Bea"],
  default: ["Gene", "Byron", "Poco", "Sandy", "Tara", "Spike", "Crow"],
}

// Brawler strengths by category
const BRAWLER_STRENGTHS: Record<string, string[]> = {
  Poco: ["Team healing", "Area control", "Support"],
  Gene: ["Pull mechanic", "Team support", "Versatile"],
  Tara: ["Super synergy", "Area damage", "Vision"],
  Sandy: ["Invisibility", "Area control", "Support"],
  Byron: ["Long range healing", "Poke damage", "Versatile"],
  Emz: ["Area control", "Lane pressure", "Anti-tank"],
  Spike: ["Area control", "Burst damage", "Slowing"],
  Stu: ["High mobility", "Quick super", "Aggressive"],
  Mortis: ["Assassin", "Ball carrier", "High mobility"],
  Fang: ["Chain super", "High damage", "Mobility"],
  Max: ["Speed boost", "Support", "Mobility"],
  Gale: ["Knockback", "Area control", "Support"],
  Bibi: ["Tank counter", "Knockback", "Melee"],
  Frank: ["Stun", "High HP", "Area damage"],
  Piper: ["Long range", "High burst", "Sniper"],
  Brock: ["Long range", "Wall break", "Consistent"],
  Belle: ["Mark mechanic", "Long range", "Support"],
  Nani: ["Long range", "High damage", "Teleport super"],
  Bea: ["Charged shot", "Long range", "Slowing"],
  Crow: ["Poison", "Mobility", "Anti-heal"],
  Colt: ["High DPS", "Wall break", "Range"],
  Bull: ["Tank", "Close range", "Bush control"],
  Darryl: ["Tank", "Mobility", "Shield"],
  Jessie: ["Turret", "Bounce shots", "Pressure"],
  "8-Bit": ["Damage boost", "High DPS", "Turret"],
  Dynamike: ["Wall break", "Area control", "High damage"],
  Rosa: ["Tank", "Shield", "Bush control"],
  Jacky: ["Tank", "Area damage", "Slow"],
  Grom: ["Long range", "Area control", "Wall break"],
  Edgar: ["Lifesteal", "Burst", "Mobility"],
  Buzz: ["Hook", "Tank", "Aggressive"],
  "El Primo": ["Tank", "Mobility", "Melee"],
}

function normalizeModeName(mode: string): string {
  const normalized = mode.toLowerCase().replace(/\s+/g, "")
  const modeMap: Record<string, string> = {
    gemgrab: "gemGrab",
    brawlball: "brawlBall",
    hotzone: "hotZone",
  }
  return modeMap[normalized] || normalized
}

function getMetaBrawlersForMode(mode: string): string[] {
  const normalizedMode = normalizeModeName(mode)
  return META_TIERS[normalizedMode as keyof typeof META_TIERS] || META_TIERS.default
}

function calculateBrawlerScore(brawlerName: string, mode: string, playerBrawler: any): number {
  let score = 0
  const metaBrawlers = getMetaBrawlersForMode(mode)

  // Meta tier bonus (0-50 points)
  const metaIndex = metaBrawlers.indexOf(brawlerName)
  if (metaIndex !== -1) {
    score += 50 - metaIndex * 5
  }

  // Power level bonus (0-20 points)
  if (playerBrawler) {
    score += (playerBrawler.power / 11) * 20
  }

  // Trophy level bonus (0-15 points)
  if (playerBrawler?.trophies) {
    score += Math.min((playerBrawler.trophies / 1000) * 15, 15)
  }

  // Rank bonus (0-15 points)
  if (playerBrawler?.rank) {
    score += Math.min((playerBrawler.rank / 35) * 15, 15)
  }

  return score
}

function getBrawlerStrengths(brawlerName: string): string[] {
  return BRAWLER_STRENGTHS[brawlerName] || ["Versatile", "Balanced", "Adaptable"]
}

function getBrawlerWeaknesses(brawlerName: string, mode: string): string[] {
  // Generic weaknesses based on brawler type
  const weaknessMap: Record<string, string[]> = {
    Poco: ["Low damage", "Vulnerable alone"],
    Gene: ["Skill dependent", "Reload speed"],
    Tara: ["Needs super", "Medium range"],
    Sandy: ["Low damage", "Reload speed"],
    Byron: ["Squishy", "Close range"],
    Emz: ["Close range", "Mobility"],
    Spike: ["Reload speed", "Squishy"],
    Stu: ["Low HP", "Requires aim"],
    Mortis: ["Tanks", "Sharpshooters"],
    Fang: ["Range", "Needs super"],
    Max: ["Low damage", "Squishy"],
    Gale: ["Damage output", "Reload"],
    Bibi: ["Range", "Sharpshooters"],
    Frank: ["Slow", "Vulnerable during attack"],
    Piper: ["Close range", "Assassins"],
    Brock: ["Close range", "Mobility"],
    Belle: ["Close range", "Flankers"],
    Nani: ["Requires aim", "Close range"],
    Bea: ["Close range", "Reload"],
    Crow: ["Tanks", "Healing"],
    Colt: ["Requires aim", "Squishy"],
    Bull: ["Range", "Kiting"],
    Darryl: ["Range", "Stuns"],
    Jessie: ["Mobility", "Spread out enemies"],
    "8-Bit": ["Mobility", "Assassins"],
    Dynamike: ["Mobility", "Assassins"],
    Rosa: ["Range", "Kiting"],
    Jacky: ["Range", "Kiting"],
    Grom: ["Close range", "Mobility"],
    Edgar: ["Range", "Knockback"],
    Buzz: ["Range", "Kiting"],
    "El Primo": ["Range", "Kiting"],
  }

  return weaknessMap[brawlerName] || ["Situational", "Matchup dependent"]
}

export function analyzePlayerForEvents(player: Player, events: Event[]): AnalysisResult {
  const recommendations: BrawlerRecommendation[] = []

  for (const event of events) {
    const mode = event.mode
    const metaBrawlers = getMetaBrawlersForMode(mode)

    // Score all player's brawlers for this mode
    const scoredBrawlers = player.brawlers
      .map((brawler) => ({
        brawler,
        score: calculateBrawlerScore(brawler.name, mode, brawler),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Top 3

    const topPicks = scoredBrawlers.map(({ brawler }) => ({
      name: brawler.name,
      powerLevel: brawler.power,
      trophies: brawler.trophies,
      rank: brawler.rank,
      strengths: getBrawlerStrengths(brawler.name),
      weaknesses: getBrawlerWeaknesses(brawler.name, mode),
      reasoning: `Strong in ${mode}. ${
        metaBrawlers.includes(brawler.name) ? "Top meta pick." : "Good alternative."
      } Power ${brawler.power}/11.`,
    }))

    recommendations.push({
      event: {
        map: event.map,
        mode: event.mode,
      },
      topPicks,
    })
  }

  return {
    playerTag: player.tag,
    playerName: player.name,
    trophies: player.trophies,
    recommendations,
    rankedInsights: generateRankedInsights(player),
  }
}

function generateRankedInsights(player: Player): RankedInsights {
  // Find player's best brawlers
  const topBrawlers = [...player.brawlers].sort((a, b) => b.trophies - a.trophies).slice(0, 5)

  const avgTrophies = player.trophies / player.brawlers.length

  return {
    bestBrawlers: topBrawlers.map((b) => b.name),
    suggestedModes: ["Gem Grab", "Brawl Ball", "Knockout"],
    strategyTips: [
      "Focus on your highest trophy brawlers for consistent wins",
      "Learn 2-3 brawlers per game mode for flexibility",
      "Communicate with teammates for better coordination",
      avgTrophies > 600
        ? "You have strong fundamentals - work on advanced positioning"
        : "Focus on learning brawler mechanics and map control",
    ],
    matchupAdvice: {
      strongAgainst: ["Tanks", "Close-range brawlers"],
      weakAgainst: ["Long-range brawlers", "High mobility"],
      banSuggestions: ["Edgar", "Mortis", "Fang"],
    },
  }
}
