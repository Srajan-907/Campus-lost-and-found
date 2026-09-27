import type { LostFoundItem } from '../types';

export interface MatchResult {
  item: LostFoundItem;
  score: number;
  maxScore: number;
  percentage: number;
  label: 'High match' | 'Possible match' | 'Low match';
  reasons: string[];
}

export function findMatches(target: LostFoundItem, items: LostFoundItem[]): MatchResult[] {
  const oppositeType = target.type === 'Lost' ? 'Found' : 'Lost';

  return items
    .filter((i) => i.type === oppositeType && i.id !== target.id && i.status !== 'Claimed')
    .map((item) => {
      let score = 0;
      let maxScore = 0;
      const reasons: string[] = [];

      // Category match (weighted high)
      maxScore += 30;
      if (item.category === target.category) {
        score += 30;
        reasons.push('Same category');
      }

      // Location match
      maxScore += 20;
      if (item.location === target.location) {
        score += 20;
        reasons.push('Same location');
      }

      // Brand match
      maxScore += 20;
      if (item.brand && target.brand && item.brand.toLowerCase() === target.brand.toLowerCase()) {
        score += 20;
        reasons.push('Same brand');
      }

      // Color match
      maxScore += 15;
      if (item.color && target.color && item.color.toLowerCase() === target.color.toLowerCase()) {
        score += 15;
        reasons.push('Same color');
      }

      // Date proximity (within 3 days)
      maxScore += 15;
      const dayDiff = Math.abs(
        (new Date(item.date).getTime() - new Date(target.date).getTime()) / (1000 * 60 * 60 * 24),
      );
      if (dayDiff <= 1) {
        score += 15;
        reasons.push('Same or adjacent day');
      } else if (dayDiff <= 3) {
        score += 10;
        reasons.push('Within 3 days');
      } else if (dayDiff <= 7) {
        score += 5;
        reasons.push('Within a week');
      }

      const percentage = Math.round((score / maxScore) * 100);
      let label: MatchResult['label'] = 'Low match';
      if (percentage >= 70) label = 'High match';
      else if (percentage >= 40) label = 'Possible match';

      return { item, score, maxScore, percentage, label, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
}
