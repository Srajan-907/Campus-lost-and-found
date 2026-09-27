import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, SearchX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { SortDropdown } from '../components/SortDropdown';
import { ItemGrid } from '../components/ItemGrid';
import { EmptyState } from '../components/EmptyState';
import { searchItems, filterItems, sortItems, DEFAULT_FILTERS } from '../utils/filters';
import type { FilterState } from '../types';

export function BrowseItems() {
  const { items } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || 'All',
    type: (searchParams.get('type') as FilterState['type']) || 'All',
    location: searchParams.get('location') || 'All',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setFilters((f) => ({
      ...f,
      category: searchParams.get('category') || 'All',
      type: (searchParams.get('type') as FilterState['type']) || 'All',
      location: searchParams.get('location') || 'All',
    }));
  }, [searchParams]);

  const results = useMemo(() => {
    const searched = searchItems(items, query);
    const filtered = filterItems(searched, filters);
    return sortItems(filtered, filters.sort, query);
  }, [items, query, filters]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) params.set('q', value);
    else params.delete('q');
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    const params = new URLSearchParams(searchParams);
    if (newFilters.category !== 'All') params.set('category', newFilters.category);
    else params.delete('category');
    if (newFilters.type !== 'All') params.set('type', newFilters.type);
    else params.delete('type');
    if (newFilters.location !== 'All') params.set('location', newFilters.location);
    else params.delete('location');
    setSearchParams(params, { replace: true });
  };

  const activeFilterCount =
    (filters.type !== 'All' ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (filters.location !== 'All' ? 1 : 0) +
    (filters.dateFilter !== 'Any time' ? 1 : 0) +
    (filters.status !== 'All' ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Browse Lost &amp; Found Items</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Search and filter through all reported items on campus.
        </p>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          placeholder="Search items, locations, brands..."
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="btn-secondary lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{activeFilterCount}</span>
            )}
          </button>
          <SortDropdown value={filters.sort} onChange={(sort) => setFilters((f) => ({ ...f, sort }))} />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop filters */}
        <div className="hidden lg:block w-64 shrink-0">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            className="sticky top-20"
          />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {results.length} {results.length === 1 ? 'item' : 'items'} found
              {query && <span className="text-slate-400"> for "{query}"</span>}
            </p>
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No items found"
              message={query || activeFilterCount > 0
                ? "No lost or found items match your search. Try adjusting your filters or search terms."
                : "No items have been reported yet. Be the first to report a lost or found item."}
              actionLabel="Report an Item"
              actionTo="/report-lost"
            />
          ) : (
            <ItemGrid items={results} />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowFilters(false)} aria-hidden />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-slate-50 dark:bg-slate-950 shadow-xl animate-slide-in-right" role="dialog" aria-modal="true">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
