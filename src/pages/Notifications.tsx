import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Sparkles, CheckCircle2, FileText, Info, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
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

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {unread > 0 ? `You have ${unread} unread notification${unread !== 1 ? 's' : ''}.` : "You're all caught up."}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unread > 0 && (
              <button onClick={markAllNotificationsRead} className="btn-secondary btn-sm">
                <CheckCheck className="h-4 w-4" /> Mark all read
              </button>
            )}
            <button onClick={clearNotifications} className="btn-secondary btn-sm text-red-600 dark:text-red-400">
              <Trash2 className="h-4 w-4" /> Clear
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          message="You're all caught up. New notifications about matches, claims, and reports will appear here."
          actionLabel="Browse Items"
          actionTo="/browse"
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif: AppNotification) => {
            const Icon = NOTIF_ICONS[notif.type];
            return (
              <Link
                key={notif.id}
                to={notif.itemId ? `/items/${notif.itemId}` : '/browse'}
                onClick={() => markNotificationRead(notif.id)}
                className={`card group flex items-center gap-4 p-4 transition-all hover:shadow-card-hover ${
                  !notif.read ? 'border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-900/10' : ''
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${NOTIF_COLORS[notif.type]}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{notif.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
                </div>
                {!notif.read && <span className="h-2.5 w-2.5 rounded-full bg-brand-500 shrink-0" aria-label="Unread" />}
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
