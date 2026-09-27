import { Search, MapPin, Package } from 'lucide-react';

export function StatusBadge({ status, size = 'md' }: { status: 'Lost' | 'Found' | 'Claimed'; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'text-[10px] px-2 py-0.5' : '';
  const icon = { Lost: Search, Found: MapPin, Claimed: Package }[status];
  const Icon = icon;

  if (status === 'Lost') {
    return <span className={`badge-lost ${cls}`}><Icon className="h-3 w-3" aria-hidden />Lost</span>;
  }
  if (status === 'Found') {
    return <span className={`badge-found ${cls}`}><Icon className="h-3 w-3" aria-hidden />Found</span>;
  }
  return <span className={`badge-claimed ${cls}`}><Icon className="h-3 w-3" aria-hidden />Claimed</span>;
}

export function TypeBadge({ type, size = 'md' }: { type: 'Lost' | 'Found'; size?: 'sm' | 'md' }) {
  return <StatusBadge status={type} size={size} />;
}
