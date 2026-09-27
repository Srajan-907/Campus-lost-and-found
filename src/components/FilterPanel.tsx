import type { FilterState, SortValue } from '../types';
import { CATEGORIES, LOCATIONS, DATE_FILTERS, SORT_OPTIONS } from '../data/constants';
import { Filter, X, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  onClose?: () => void;
  className?: string;
}

const TYPE_OPTIONS: FilterState['type'][] = ['All', 'Lost', 'Found', 'Claimed'];
const STATUS_OPTIONS: FilterState['status'][] = ['All', 'Active', 'Claimed'];

export function FilterPanel({ filters, onChange, onReset, onClose, className = '' }: FilterPanelProps) {
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const isCustomDate = filters.dateFilter === 'Custom date range';
  const activeCount =
    (filters.type !== 'All' ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (filters.location !== 'All' ? 1 : 0) +
    (filters.dateFilter !== 'Any time' ? 1 : 0) +
    (filters.status !== 'All' ? 1 : 0);

  return (
    <aside className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" aria-hidden />
          <h2 className="font-semibold text-slate-900 dark:text-white">Filters</h2>
          {activeCount > 0 && (
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{activeCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close filters">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <fieldset>
          <legend className="label">Type</legend>
          <div className="grid grid-cols-2 gap-2">
            {TYPE_OPTIONS.map((t) => (
              <FilterButton key={t} active={filters.type === t} onClick={() => update({ type: t })}>
                {t}
              </FilterButton>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Category</legend>
          <select className="input" value={filters.category} onChange={(e) => update({ category: e.target.value })}>
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </fieldset>

        <fieldset>
          <legend className="label">Location</legend>
          <select className="input" value={filters.location} onChange={(e) => update({ location: e.target.value })}>
            <option value="All">All locations</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </fieldset>

        <fieldset>
          <legend className="label">Date</legend>
          <select className="input mb-2" value={filters.dateFilter} onChange={(e) => update({ dateFilter: e.target.value })}>
            {DATE_FILTERS.map((d) => <option key={d} value={d}>{d}</option>)}
            <option value="Custom date range">Custom date range</option>
          </select>
          {isCustomDate && (
            <div className="grid grid-cols-2 gap-2 animate-fade-in">
              <div>
                <label className="text-xs text-slate-500">From</label>
                <input type="date" className="input" value={filters.customDateFrom || ''} onChange={(e) => update({ customDateFrom: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-500">To</label>
                <input type="date" className="input" value={filters.customDateTo || ''} onChange={(e) => update({ customDateTo: e.target.value })} />
              </div>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend className="label">Status</legend>
          <div className="grid grid-cols-3 gap-2">
            {STATUS_OPTIONS.map((s) => (
              <FilterButton key={s} active={filters.status === s} onClick={() => update({ status: s })}>
                {s}
              </FilterButton>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Sort by</legend>
          <select className="input" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortValue })}>
            {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </fieldset>
      </div>
    </aside>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}
