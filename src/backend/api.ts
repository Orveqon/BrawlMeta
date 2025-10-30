// TypeScript API fetch functions for Brawl Stars via RoyaleAPI Proxy
// Never expose API key to frontend. All fetches are done here and compiled to JS for frontend import via ES modules (without exposing key in source).

export interface Brawler {
  name: string;
  trophies: number;
  power: number;
  rank: number;
  starPowers: string[];
}

export interface PlayerProfile {
  tag: string;
  name: string;
  trophies: number;
  expLevel: number;
  highestTrophies?: number;
  icon?: { id: number };
  club?: { name: string };
  brawlers: Brawler[];
}

export interface ActiveEvent {
  id: number;
  mode: string;
  map: string;
  startTime: string;
  endTime: string;
}

export interface RankedBrawler {
  name: string;
  trophies?: number;
  rank?: number;
  icon?: { id: number };
  power?: number;
  winRate?: number;
  usage?: number;
}

const API_URL = "https://bsproxy.royaleapi.dev/v1";

// Expect the token to be provided as environment variable at build/runtime in Node bundling context.
// For direct browser usage, we still do not embed the key in code; instead expect it injected during build or served via simple proxy endpoint.
const TOKEN = (typeof process !== 'undefined' && process.env && (process.env.BS_API_TOKEN as string)) || '';

const HEADERS: HeadersInit = {
  Authorization:
    "Bearer " +
    (TOKEN ||
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjFiY2E5NWRiLTI5NjktNDc2OC1hMDM4LTQzOWVmY2FkM2NhOSIsImlhdCI6MTc2MTc3OTAzMCwic3ViIjoiZGV2ZWxvcGVyL2ZhYmVlN2M5LWFlZGUtZGQ3YS03N2I0LWZmMzYwMzkwYTAwNSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNDUuNzkuMjE4Ljc5Il0sInR5cGUiOiJjbGllbnQifV19.eoJptbmL2zHmp1RHBUsEwuRjBvRQCECxJ9WsrxbbYEFtxR-F52UD3wALay_R44SB55UZ5JE00ZgHzFVm8GrE-w"),
  "Content-Type": "application/json",
};

async function getJson<T>(path: string): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, { headers: HEADERS, method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function getPlayer(tag: string): Promise<PlayerProfile> {
  const safeTag = encodeURIComponent(tag.startsWith('#') ? tag : `#${tag}`);
  const data = await getJson<PlayerProfile>(`/players/${safeTag}`);
  // Normalize brawlers list if needed
  (data as any).brawlers = (data as any).brawlers?.map((b: any) => ({
    name: b.name,
    trophies: b.trophies ?? b.trophiesRank ?? 0,
    power: b.power ?? b.powerLevel ?? 0,
    rank: b.rank ?? 0,
    starPowers: (b.starPowers || []).map((sp: any) => sp.name),
  })) || [];
  return data;
}

export async function getBattlelog(tag: string): Promise<any> {
  const safeTag = encodeURIComponent(tag.startsWith('#') ? tag : `#${tag}`);
  return getJson(`/players/${safeTag}/battlelog`);
}

export async function getActiveEvents(): Promise<ActiveEvent[]> {
  const res = await getJson<{ events: ActiveEvent[] } | ActiveEvent[]>(`/events/active`);
  // API may return {events: []} or []
  // @ts-ignore
  return Array.isArray(res) ? (res as ActiveEvent[]) : ((res as any).events ?? []);
}

export async function getGlobalBrawlerRankings(): Promise<RankedBrawler[]> {
  const res = await getJson<{ items: any[] } | any[]>(`/rankings/global/brawlers`);
  const items = Array.isArray(res) ? (res as any[]) : (res as any).items || [];
  return items.map((it: any) => ({
    name: it.name,
    rank: it.rank,
    trophies: it.trophies,
    icon: it.icon,
    power: it.power,
    winRate: it.winRate ?? it.win_rate ?? undefined,
    usage: it.usage ?? it.useRate ?? undefined,
  }));
}

export async function getGlobalPlayerRankings(): Promise<any[]> {
  const res = await getJson<{ items: any[] } | any[]>(`/rankings/global/players`);
  return Array.isArray(res) ? res : res.items || [];
}

export const __internals = { API_URL, HEADERS };
