import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PackageX, MapPin, CheckCircle2, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { ItemGrid } from '../components/ItemGrid';
import { StatCard } from '../components/StatCard';
import { computeStats } from '../utils/stats';
import { CATEGORIES } from '../data/constants';
import { getCategoryIcon } from '../utils/icons';

export function Home() {
  const { items } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const stats = useMemo(() => computeStats(items), [items]);
  const recentItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    [items],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-950/20 dark:to-slate-950">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.04)_1px,transparent_0)] [background-size:24px_24px] dark:[background-image:radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.05)_1px,transparent_0)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 badge bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              CSI AITR Campus Lost &amp; Found
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Lost something on campus?
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Find lost belongings or help someone recover what they lost. Report, search, and reunite items across campus.
            </p>

            <form onSubmit={handleSearch} className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search for items, locations, categories..."
                autoFocus={false}
              />
              <button type="submit" className="sr-only">Search</button>
            </form>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/report-lost" className="btn bg-lost-600 hover:bg-lost-700 text-white px-5 py-2.5 shadow-sm">
                <Search className="h-4.5 w-4.5" /> Report Lost Item
              </Link>
              <Link to="/report-found" className="btn bg-found-600 hover:bg-found-700 text-white px-5 py-2.5 shadow-sm">
                <PackageX className="h-4.5 w-4.5" /> Report Found Item
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard label="Items Reported" value={stats.total} icon={TrendingUp} color="brand" />
          <StatCard label="Lost Items" value={stats.lost} icon={Search} color="lost" />
          <StatCard label="Found Items" value={stats.found} icon={MapPin} color="found" />
          <StatCard label="Items Reunited" value={stats.claimed} icon={CheckCircle2} color="claimed" />
          <StatCard label="Active Reports" value={stats.active} icon={TrendingUp} color="neutral" />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
          <Link to="/browse" className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat);
            const count = items.filter((i) => i.category === cat).length;
            return (
              <Link
                key={cat}
                to={`/browse?category=${encodeURIComponent(cat)}`}
                className="card group p-4 sm:p-5 text-center transition-all hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 animate-fade-in"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{cat}</p>
                <p className="text-xs text-slate-400">{count} item{count !== 1 ? 's' : ''}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Items */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recently Reported</h2>
          <Link to="/browse" className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ItemGrid items={recentItems} />
      </section>
    </div>
  );
}
