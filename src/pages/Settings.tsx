import { useState } from 'react';
import { Moon, Sun, Bell, User, Database, RotateCcw, Mail, Phone, Building, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { DEMO_USER } from '../data/constants';

export function Settings() {
  const { theme, toggleTheme, resetAllData, showToast, notifications, items } = useApp();
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your profile and application preferences.</p>
      </div>

      {/* Profile */}
      <section className="card p-5 sm:p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Profile</h2>
          <span className="badge bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">Demo User</span>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white text-xl font-bold">
            {DEMO_USER.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{DEMO_USER.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{DEMO_USER.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label="Email" value={DEMO_USER.email} />
          <InfoRow icon={Phone} label="Phone" value={DEMO_USER.phone} />
          <InfoRow icon={Building} label="Department" value={DEMO_USER.department} />
          <InfoRow icon={GraduationCap} label="Year" value={DEMO_USER.year} />
        </div>
      </section>

      {/* Appearance */}
      <section className="card p-5 sm:p-6 mb-4">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Sun className="h-5 w-5 text-lost-500" /> : <Moon className="h-5 w-5 text-brand-400" />}
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Theme</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="relative h-7 w-12 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
            role="switch"
            aria-checked={theme === 'dark'}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </section>

      {/* Notifications info */}
      <section className="card p-5 sm:p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Notifications</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You currently have {notifications.length} notification{notifications.length !== 1 ? 's' : ''} ({notifications.filter((n) => !n.read).length} unread).
          Notifications are generated when items are reported, claimed, or when possible matches are found.
        </p>
      </section>

      {/* Data Management */}
      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Data Management</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Reset Demo Data</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Currently storing {items.length} items. Reset will restore the original demo dataset.
            </p>
          </div>
          <button onClick={() => setShowReset(true)} className="btn-danger btn-sm">
            <RotateCcw className="h-4 w-4" /> Reset Data
          </button>
        </div>
      </section>

      <ConfirmModal
        open={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={() => { resetAllData(); showToast('success', 'Demo data has been reset.'); }}
        title="Reset Demo Data"
        message="This will replace all current items and notifications with the original demo dataset. Your changes will be lost."
        confirmLabel="Reset"
        variant="danger"
      />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 dark:border-slate-800 p-3">
      <Icon className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{value}</p>
      </div>
    </div>
  );
}
