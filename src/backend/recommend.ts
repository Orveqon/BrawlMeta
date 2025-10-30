import type { ActiveEvent, PlayerProfile, RankedBrawler } from './api';
import { analyzeBattlelog, classifyMap, recommendByArchetype, adviseRoles } from './analytics';

export interface Recommendation {
  name: string;
  reason: string;
}

export interface RankedAdvice {
  recommendations: Recommendation[];
  mapInsight: {
    type: ReturnType<typeof classifyMap>;
    preferred_roles: string[];
    avoid_roles: string[];
  };
}

export function buildRecommendations(
  player: PlayerProfile,
  battlelog: any,
  rankings: RankedBrawler[],
  events: ActiveEvent[]
): RankedAdvice {
  const summary = analyzeBattlelog(battlelog);
  const current = events[0];
  const archetype = classifyMap(current?.map || 'Unknown');
  const picks = recommendByArchetype(archetype, rankings);

  const reasons: Record<string, string> = {
    Bo: "Vision and control through mines and totem",
    Leon: "Assassin with invisibility for flanks in bushes",
    Sprout: "Wall control and zone denial for chokepoints",
    Belle: "Long-range pressure on open lanes",
    Piper: "Sniper dominance on open maps",
    Gene: "Pull for swing plays and control",
    Pam: "Area sustain and turret control",
    Spike: "High DPS and area control",
  };

  const recs: Recommendation[] = picks.slice(0, 3).map(p => ({
    name: p.name,
    reason: reasons[p.name] || 'Strong win-rate and usage in current meta',
  }));

  const roles = adviseRoles(archetype);

  return {
    recommendations: recs,
    mapInsight: {
      type: archetype,
      preferred_roles: roles.preferred,
      avoid_roles: roles.avoid,
    },
  };
}
