import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { LostFoundItem, AppNotification } from '../types';
import {
  loadItems, saveItems, addItem as storeAdd, updateItem as storeUpdate,
  deleteItem as storeDelete, updateStatus as storeUpdateStatus,
  loadNotifications, saveNotifications, addNotification as storeAddNotif,
  markNotificationRead as storeMarkRead, markAllNotificationsRead as storeMarkAllRead,
  clearNotifications as storeClearNotifs, loadTheme, saveTheme,
  generateId, generateNotifId, resetData,
} from '../utils/storage';
import { DEMO_USER } from '../data/constants';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppContextValue {
  items: LostFoundItem[];
  notifications: AppNotification[];
  theme: 'light' | 'dark';
  toasts: Toast[];
  toggleTheme: () => void;
  addItem: (item: Omit<LostFoundItem, 'id' | 'createdAt' | 'updatedAt'>) => LostFoundItem;
  updateItem: (item: LostFoundItem) => void;
  deleteItem: (id: string) => void;
  updateStatus: (id: string, status: 'Lost' | 'Found' | 'Claimed', claim?: LostFoundItem['claim']) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  showToast: (type: Toast['type'], message: string) => void;
  dismissToast: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LostFoundItem[]>(() => loadItems());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addItem = useCallback((item: Omit<LostFoundItem, 'id' | 'createdAt' | 'updatedAt'>): LostFoundItem => {
    const now = new Date().toISOString();
    const newItem: LostFoundItem = { ...item, id: generateId(), createdAt: now, updatedAt: now };
    const updated = storeAdd(newItem);
    setItems(updated);
    return newItem;
  }, []);

  const updateItem = useCallback((item: LostFoundItem) => {
    const updated = storeUpdate({ ...item, updatedAt: new Date().toISOString() });
    setItems(updated);
  }, []);

  const deleteItem = useCallback((id: string) => {
    const updated = storeDelete(id);
    setItems(updated);
  }, []);

  const updateStatus = useCallback((id: string, status: 'Lost' | 'Found' | 'Claimed', claim?: LostFoundItem['claim']) => {
    const updated = storeUpdateStatus(id, status, claim);
    setItems(updated);
  }, []);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: generateNotifId(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = storeAddNotif(newNotif);
    setNotifications(updated);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    const updated = storeMarkRead(id);
    setNotifications(updated);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    const updated = storeMarkAllRead();
    setNotifications(updated);
  }, []);

  const clearNotifications = useCallback(() => {
    const cleared = storeClearNotifs();
    setNotifications(cleared);
  }, []);

  const resetAllData = useCallback(() => {
    resetData();
    setItems(loadItems());
    setNotifications(loadNotifications());
  }, []);

  // Keep localStorage in sync with in-memory state for items
  useEffect(() => {
    saveItems(items);
  }, [items]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Reference DEMO_USER so it's part of the bundle's data surface
  void DEMO_USER;

  return (
    <AppContext.Provider value={{
      items, notifications, theme, toasts,
      toggleTheme, addItem, updateItem, deleteItem, updateStatus,
      addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications,
      showToast, dismissToast, resetAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
