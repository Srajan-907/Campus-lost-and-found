import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Sparkles, CheckCircle2, FileText, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils/dateUtils';
import type { AppNotification } from '../types';

const NOTIF_ICONS = {
  match: Sparkles,
  claimed: CheckCircle2,
  report: FileText,
  new: Bell,
  system: Info,
};

const NOTIF_COLORS = {
  match: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30',
  claimed: 'text-found-600 dark:text-found-400 bg-found-50 dark:bg-found-900/30',
  report: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
  new: 'text-lost-600 dark:text-lost-400 bg-lost-50 dark:bg-lost-900/30',
  system: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
};

export function NotificationDropdown() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lost-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
            <div className="flex gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="rounded p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                  aria-label="Clear all notifications"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" aria-hidden />
                <p className="text-sm text-slate-500 dark:text-slate-400">You're all caught up.</p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notif: AppNotification) => {
                const Icon = NOTIF_ICONS[notif.type];
                return (
                  <Link
                    key={notif.id}
                    to={notif.itemId ? `/items/${notif.itemId}` : '/notifications'}
                    onClick={() => { markNotificationRead(notif.id); setOpen(false); }}
                    className={`flex gap-3 border-b border-slate-100 dark:border-slate-700/50 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notif.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${NOTIF_COLORS[notif.type]}`}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{notif.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
                    </div>
                    {!notif.read && <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0 mt-1" aria-hidden />}
                  </Link>
                );
              })
            )}
          </div>

          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-slate-200 dark:border-slate-700 p-3 text-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
