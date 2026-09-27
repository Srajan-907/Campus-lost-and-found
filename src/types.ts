export interface ItemContact {
  name: string;
  email: string;
  phone: string;
  preferredContact: 'Email' | 'Phone';
  department?: string;
  year?: string;
}

export interface ClaimInfo {
  claimedBy: string;
  claimContact: string;
  claimProof: string;
  claimedAt: string;
}

export interface LostFoundItem {
  id: string;
  type: 'Lost' | 'Found';
  status: 'Lost' | 'Found' | 'Claimed';
  name: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time?: string;
  color?: string;
  brand?: string;
  features?: string;
  image: string;
  contact: ItemContact;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  claim?: ClaimInfo | null;
}

export interface NotificationItem {
  id: string;
  type: 'match' | 'claimed' | 'report' | 'system' | 'new';
  title: string;
  message: string;
  itemId?: string;
  read: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'match' | 'claimed' | 'report' | 'system' | 'new';
  title: string;
  message: string;
  itemId?: string;
  read: boolean;
  createdAt: string;
}

export type SortValue = 'newest' | 'oldest' | 'updated' | 'alphabetical' | 'relevant';

export interface FilterState {
  type: 'All' | 'Lost' | 'Found' | 'Claimed';
  category: string;
  location: string;
  dateFilter: string;
  status: 'All' | 'Active' | 'Claimed';
  customDateFrom?: string;
  customDateTo?: string;
  sort: SortValue;
}
