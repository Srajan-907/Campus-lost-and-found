export const CATEGORIES = [
  'Electronics',
  'ID Cards',
  'Books',
  'Accessories',
  'Other',
] as const;

export const LOCATIONS = [
  'Library',
  'Cafeteria',
  'Computer Lab',
  'Auditorium',
  'Parking Area',
  'Hostel',
  'Sports Ground',
  'Main Gate',
  'Other',
] as const;

export const STATUS = {
  LOST: 'Lost',
  FOUND: 'Found',
  CLAIMED: 'Claimed',
} as const;

export type StatusType = (typeof STATUS)[keyof typeof STATUS];
export type CategoryType = (typeof CATEGORIES)[number];
export type LocationType = (typeof LOCATIONS)[number];

export const DATE_FILTERS = [
  'Any time',
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'relevant', label: 'Most relevant' },
] as const;

export const DEMO_USER = {
  id: 'demo-user',
  name: 'Campus Admin',
  email: 'admin@campusfind.demo',
  phone: '+91 98765 43210',
  department: 'Computer Science',
  year: '2nd Year',
  preferredContact: 'Email' as const,
};
