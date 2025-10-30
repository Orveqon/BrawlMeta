import type { ActiveEvent, PlayerProfile, RankedBrawler } from './api';

export interface ModeStats {
  mode: string;
  games: number;
  wins: number;
  losses: number;
}

export interface BrawlerPerformance {
  name: string;
  games: number;
  wins: number;
  winRate: number; // 0..1
}

export interface PlayerSummary {
  topBrawlers: BrawlerPerformance[];
  modeDistribution: ModeStats[];
  winRate: number; // 0..1 overall
}

export function analyzeBattlelog(battlelog: any): PlayerSummary {
  const items: any[] = battlelog?.items || battlelog || [];
  const modeMap = new Map<string, ModeStats>();
  const brawlerMap = new Map<string, BrawlerPerformance>();
  let wins = 0;
  let games = 0;
  for (const b of items.slice(0, 25)) {
    const mode = b?.event?.mode || b?.battle?.mode || 'unknown';
    const result = (b?.battle?.result || '').toLowerCase();
    const players: any[] = b?.battle?.teams?.flat() || b?.battle?.players || [];
    const mySide = players.filter(p => p?.tag === b?.player?.tag);
    const team = mySide.length ? mySide : players;

    games += 1;
    const win = result === 'victory' || result === 'win' || result === 'won' || result === 'victory';
    if (win) wins += 1;

    const mm = modeMap.get(mode) || { mode, games: 0, wins: 0, losses: 0 };
    mm.games += 1;
    if (win) mm.wins += 1; else mm.losses += 1;
    modeMap.set(mode, mm);

    for (const p of team) {
      const name = p?.brawler?.name || 'Unknown';
      const bp = brawlerMap.get(name) || { name, games: 0, wins: 0, winRate: 0 };
      bp.games += 1;
      if (win) bp.wins += 1;
      brawlerMap.set(name, bp);
    }
  }

  const brawlers = Array.from(brawlerMap.values())
    .map(b => ({ ...b, winRate: b.games ? b.wins / b.games : 0 }))
    .sort((a, b) => b.winRate - a.winRate || b.games - a.games)
    .slice(0, 10);

  const modes = Array.from(modeMap.values())
    .sort((a, b) => b.games - a.games);

  const overall = games ? wins / games : 0;

  return { topBrawlers: brawlers, modeDistribution: modes, winRate: overall };
}

export function tierFromMetrics(rb: RankedBrawler): 'S' | 'A' | 'B' {
  const win = (rb.winRate ?? 0) * 100;
  const use = (rb.usage ?? 0) * 100;
  if (win >= 55 || (win >= 52 && use >= 3)) return 'S';
  if (win >= 50) return 'A';
  return 'B';
}

export function buildTierList(rankings: RankedBrawler[]) {
  const list = { S: [] as RankedBrawler[], A: [] as RankedBrawler[], B: [] as RankedBrawler[] };
  for (const r of rankings) list[tierFromMetrics(r)].push(r);
  return list;
}

export type MapArchetype = 'open' | 'bush-heavy' | 'control' | 'choke';

export function classifyMap(mapName: string): MapArchetype {
  const nm = mapName.toLowerCase();
  if (/cavern|snake|bush|forest|overgrown|double swoosh/.test(nm)) return 'bush-heavy';
  if (/open|dune|long range|dry|shooting range/.test(nm)) return 'open';
  if (/ring|moat|control|siege|zone|hardrock/.test(nm)) return 'control';
  return 'choke';
}

export function recommendByArchetype(archetype: MapArchetype, rankings: RankedBrawler[]) {
  const good: Record<MapArchetype, string[]> = {
    'open': ['Belle', 'Piper', 'Nani', 'Byron', 'Brock'],
    'bush-heavy': ['Bo', 'Tara', 'Leon', 'Sprout', 'Sandy'],
    'control': ['Gene', 'Pam', 'Emz', 'Jessie', '8-Bit'],
    'choke': ['Spike', 'Sprout', 'Barley', 'Rico', 'Poco'],
  };
  const preferred = new Set(good[archetype]);
  const ranked = rankings
    .slice()
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0));
  const picks = ranked.filter(r => preferred.has(r.name)).slice(0, 5);
  return picks.length ? picks : ranked.slice(0, 5);
}

export function summarizePlayer(player: PlayerProfile, battleSummary: PlayerSummary) {
  const favorites = player.brawlers
    .slice()
    .sort((a, b) => b.trophies - a.trophies)
    .slice(0, 5)
    .map(b => b.name);
  return {
    tag: player.tag,
    name: player.name,
    trophies: player.trophies,
    highestTrophies: player.highestTrophies,
    club: player.club?.name ?? null,
    favoriteBrawlers: favorites,
    winRate: battleSummary.winRate,
  };
}

export function adviseRoles(archetype: MapArchetype) {
  switch (archetype) {
    case 'bush-heavy':
      return { preferred: ['control', 'support'], avoid: ['tank'] };
    case 'open':
      return { preferred: ['sniper', 'control'], avoid: ['short-range'] };
    case 'control':
      return { preferred: ['healer', 'control'], avoid: ['assassin'] };
    default:
      return { preferred: ['area-denial', 'control'], avoid: ['melee'] };
  }
}
