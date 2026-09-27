import type { LostFoundItem } from '../types';

export interface Stats {
  total: number;
  lost: number;
  found: number;
  claimed: number;
  active: number;
  reunitedRate: number;
}

export function computeStats(items: LostFoundItem[]): Stats {
  const total = items.length;
  const lost = items.filter((i) => i.status === 'Lost').length;
  const found = items.filter((i) => i.status === 'Found').length;
  const claimed = items.filter((i) => i.status === 'Claimed').length;
  const active = items.filter((i) => i.status !== 'Claimed').length;
  const reported = lost + claimed;
  const reunitedRate = reported > 0 ? Math.round((claimed / reported) * 100) : 0;

  return { total, lost, found, claimed, active, reunitedRate };
}

export function categoryDistribution(items: LostFoundItem[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.category, (map.get(item.category) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function locationDistribution(items: LostFoundItem[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.location, (map.get(item.location) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function lostVsFound(items: LostFoundItem[]): { name: string; Lost: number; Found: number }[] {
  const locations = [...new Set(items.map((i) => i.location))];
  return locations.map((loc) => ({
    name: loc,
    Lost: items.filter((i) => i.location === loc && (i.status === 'Lost')).length,
    Found: items.filter((i) => i.location === loc && (i.status === 'Found' || i.status === 'Claimed')).length,
  }));
}

export function reportsOverTime(items: LostFoundItem[]): { name: string; reports: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const d = new Date(item.createdAt);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, reports]) => ({ name, reports }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
    .slice(-14);
}

export function recentActivity(items: LostFoundItem[]): { id: string; text: string; time: string; createdAt: string }[] {
  return [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8)
    .map((item) => {
      let text = '';
      if (item.status === 'Claimed') {
        text = `${item.name} marked as claimed.`;
      } else if (item.type === 'Lost') {
        text = `${item.name} reported lost near ${item.location}.`;
      } else {
        text = `${item.name} reported found near ${item.location}.`;
      }
      return { id: item.id, text, time: '', createdAt: item.updatedAt };
    });
}
