export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function percent(n: number, digits = 1): string {
  return (n * 100).toFixed(digits) + '%';
}

export const DEFAULT_PLAYER = '#P2LY8QJ';

export function saveLastTag(tag: string) {
  try { localStorage.setItem('lastTag', tag); } catch {}
}

export function loadLastTag(): string | null {
  try { return localStorage.getItem('lastTag'); } catch { return null; }
}
