import type { LostFoundItem } from '../types';
import { ItemCard } from './ItemCard';

export function ItemGrid({ items }: { items: LostFoundItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
