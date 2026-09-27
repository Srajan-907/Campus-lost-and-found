import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'brand' | 'lost' | 'found' | 'claimed' | 'neutral';
  suffix?: string;
  trend?: number;
}

const COLORS = {
  brand: { bg: 'bg-brand-50 dark:bg-brand-900/30', icon: 'text-brand-600 dark:text-brand-400' },
  lost: { bg: 'bg-lost-50 dark:bg-lost-900/30', icon: 'text-lost-600 dark:text-lost-400' },
  found: { bg: 'bg-found-50 dark:bg-found-900/30', icon: 'text-found-600 dark:text-found-400' },
  claimed: { bg: 'bg-claimed-100 dark:bg-claimed-700/30', icon: 'text-claimed-600 dark:text-claimed-300' },
  neutral: { bg: 'bg-slate-100 dark:bg-slate-800', icon: 'text-slate-600 dark:text-slate-400' },
};

export function StatCard({ label, value, icon: Icon, color, suffix, trend }: StatCardProps) {
  const c = COLORS[color];
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon className={`h-5 w-5 ${c.icon}`} aria-hidden />
        </div>
        {typeof trend === 'number' && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-found-600' : 'text-lost-600'}`}>
            {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}{suffix && <span className="text-base font-normal text-slate-400 ml-0.5">{suffix}</span>}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
