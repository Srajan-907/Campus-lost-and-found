import type { LostFoundItem, FilterState, SortValue } from '../types';

export function searchItems(items: LostFoundItem[], query: string): LostFoundItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    const haystack = [
      item.name,
      item.description,
      item.category,
      item.location,
      item.brand,
      item.color,
      item.features,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}

function withinDateRange(itemDate: string, from?: string, to?: string): boolean {
  const d = new Date(itemDate);
  if (from && d < new Date(from)) return false;
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    if (d > toDate) return false;
  }
  return true;
}

function matchesDateFilter(dateStr: string, filter: string, from?: string, to?: string): boolean {
  if (filter === 'Any time') return true;
  if (filter === 'Custom date range') return withinDateRange(dateStr, from, to);

  const date = new Date(dateStr);
  const today = new Date('2026-09-27T00:00:00');
  today.setHours(0, 0, 0, 0);

  if (filter === 'Today') {
    return date.toDateString() === today.toDateString();
  }
  if (filter === 'Yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }
  if (filter === 'Last 7 Days') {
    const sevenAgo = new Date(today);
    sevenAgo.setDate(sevenAgo.getDate() - 7);
    return date >= sevenAgo && date <= today;
  }
  if (filter === 'Last 30 Days') {
    const thirtyAgo = new Date(today);
    thirtyAgo.setDate(thirtyAgo.getDate() - 30);
    return date >= thirtyAgo && date <= today;
  }
  return true;
}

export function filterItems(items: LostFoundItem[], filters: FilterState): LostFoundItem[] {
  return items.filter((item) => {
    if (filters.type !== 'All' && item.status !== filters.type) return false;
    if (filters.category !== 'All' && item.category !== filters.category) return false;
    if (filters.location !== 'All' && item.location !== filters.location) return false;
    if (filters.status === 'Active' && item.status === 'Claimed') return false;
    if (filters.status === 'Claimed' && item.status !== 'Claimed') return false;
    if (!matchesDateFilter(item.date, filters.dateFilter, filters.customDateFrom, filters.customDateTo)) return false;
    return true;
  });
}

export function sortItems(items: LostFoundItem[], sort: SortValue, query?: string): LostFoundItem[] {
  const sorted = [...items];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'updated':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    case 'alphabetical':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'relevant': {
      if (!query?.trim()) {
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      const q = query.toLowerCase();
      return sorted.sort((a, b) => relevanceScore(b, q) - relevanceScore(a, q));
    }
    default:
      return sorted;
  }
}

function relevanceScore(item: LostFoundItem, q: string): number {
  let score = 0;
  if (item.name.toLowerCase().includes(q)) score += 10;
  if (item.category.toLowerCase().includes(q)) score += 5;
  if (item.location.toLowerCase().includes(q)) score += 5;
  if (item.brand?.toLowerCase().includes(q)) score += 3;
  if (item.description.toLowerCase().includes(q)) score += 2;
  return score;
}

export const DEFAULT_FILTERS: FilterState = {
  type: 'All',
  category: 'All',
  location: 'All',
  dateFilter: 'Any time',
  status: 'All',
  sort: 'newest',
};
