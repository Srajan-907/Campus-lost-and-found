import { Laptop, IdCard, BookOpen, Headphones, Package, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Electronics: Laptop,
  'ID Cards': IdCard,
  Books: BookOpen,
  Accessories: Headphones,
  Other: Package,
};

export function getCategoryIcon(category: string): LucideIcon {
  return ICON_MAP[category] || Package;
}
