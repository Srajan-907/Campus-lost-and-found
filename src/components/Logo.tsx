import { Search, MapPin, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-9 w-9';
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="CampusFind home">
      <div className={`${dim} relative rounded-xl bg-brand-600 flex items-center justify-center shadow-sm`}>
        <Package className="h-1/2 w-1/2 text-white" strokeWidth={2.2} />
        <Search className="absolute bottom-0 right-0 h-1/3 w-1/3 text-found-400" strokeWidth={3} />
        <MapPin className="absolute top-0 left-0 h-1/3 w-1/3 text-brand-200" strokeWidth={3} />
      </div>
      <span className={`${text} font-bold tracking-tight text-slate-900 dark:text-white`}>
        Campus<span className="text-brand-600 dark:text-brand-400">Find</span>
      </span>
    </Link>
  );
}
