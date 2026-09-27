import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-found-50 dark:bg-found-900/30 border-found-200 dark:border-found-800 text-found-800 dark:text-found-200',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning: 'bg-lost-50 dark:bg-lost-900/30 border-lost-200 dark:border-lost-800 text-lost-800 dark:text-lost-200',
  info: 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-200',
};

const ICON_STYLES = {
  success: 'text-found-600 dark:text-found-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-lost-600 dark:text-lost-400',
  info: 'text-brand-600 dark:text-brand-400',
};

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-[calc(100vw-2rem)] w-full sm:w-auto sm:max-w-sm">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg animate-slide-in-right ${STYLES[toast.type]}`}
          >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${ICON_STYLES[toast.type]}`} aria-hidden />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
