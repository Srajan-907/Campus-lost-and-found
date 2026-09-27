import type { LostFoundItem, AppNotification } from '../types';
import { DEMO_ITEMS, DEMO_NOTIFICATIONS } from '../data/demoData';

const ITEMS_KEY = 'campusfind_items';
const NOTIFS_KEY = 'campusfind_notifications';
const THEME_KEY = 'campusfind_theme';

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadItems(): LostFoundItem[] {
  const items = safeParse<LostFoundItem[] | null>(ITEMS_KEY, null);
  if (!items) {
    safeWrite(ITEMS_KEY, DEMO_ITEMS);
    return DEMO_ITEMS;
  }
  return items;
}

export function saveItems(items: LostFoundItem[]): void {
  safeWrite(ITEMS_KEY, items);
}

export function addItem(item: LostFoundItem): LostFoundItem[] {
  const items = loadItems();
  const updated = [item, ...items];
  saveItems(updated);
  return updated;
}

export function updateItem(updatedItem: LostFoundItem): LostFoundItem[] {
  const items = loadItems();
  const updated = items.map((i) => (i.id === updatedItem.id ? updatedItem : i));
  saveItems(updated);
  return updated;
}

export function deleteItem(id: string): LostFoundItem[] {
  const items = loadItems();
  const updated = items.filter((i) => i.id !== id);
  saveItems(updated);
  return updated;
}

export function getItem(id: string): LostFoundItem | undefined {
  return loadItems().find((i) => i.id === id);
}

export function updateStatus(id: string, status: 'Lost' | 'Found' | 'Claimed', claim?: LostFoundItem['claim']): LostFoundItem[] {
  const items = loadItems();
  const updated = items.map((i) =>
    i.id === id ? { ...i, status, updatedAt: new Date().toISOString(), claim: claim ?? i.claim } : i,
  );
  saveItems(updated);
  return updated;
}

export function loadNotifications(): AppNotification[] {
  const notifs = safeParse<AppNotification[] | null>(NOTIFS_KEY, null);
  if (!notifs) {
    safeWrite(NOTIFS_KEY, DEMO_NOTIFICATIONS);
    return DEMO_NOTIFICATIONS;
  }
  return notifs;
}

export function saveNotifications(notifs: AppNotification[]): void {
  safeWrite(NOTIFS_KEY, notifs);
}

export function addNotification(notif: AppNotification): AppNotification[] {
  const notifs = loadNotifications();
  const updated = [notif, ...notifs];
  saveNotifications(updated);
  return updated;
}

export function markNotificationRead(id: string): AppNotification[] {
  const notifs = loadNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
  return updated;
}

export function markAllNotificationsRead(): AppNotification[] {
  const notifs = loadNotifications();
  const updated = notifs.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
  return updated;
}

export function clearNotifications(): AppNotification[] {
  saveNotifications([]);
  return [];
}

export function loadTheme(): 'light' | 'dark' {
  const theme = safeParse<'light' | 'dark' | null>(THEME_KEY, null);
  if (!theme) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function saveTheme(theme: 'light' | 'dark'): void {
  safeWrite(THEME_KEY, theme);
}

export function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateNotifId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function resetData(): void {
  saveItems(DEMO_ITEMS);
  saveNotifications(DEMO_NOTIFICATIONS);
}
