import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import type { LostFoundItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatDate, timeAgo } from '../utils/dateUtils';
import { getCategoryIcon } from '../utils/icons';

function CategoryIcon({ category }: { category: string }) {
  const Icon = getCategoryIcon(category);
  return <Icon className="h-3.5 w-3.5" aria-hidden />;
}

export function ItemCard({ item }: { item: LostFoundItem }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="card group flex flex-col overflow-hidden transition-all hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 animate-fade-in"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/600x450/e2e8f0/64748b?text=${encodeURIComponent(item.name)}`;
          }}
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={item.status} />
        </div>
        {item.category && (
          <div className="absolute right-3 top-3 badge bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm">
            <CategoryIcon category={item.category} />
            <span className="hidden sm:inline">{item.category}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {item.name}
        </h3>

        <div className="mt-2 flex flex-col gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">{item.location}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {formatDate(item.date)}
            {item.time && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" aria-hidden />
                {item.time}
              </span>
            )}
          </span>
        </div>

        {item.description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(item.createdAt)}</span>
          <span className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
