import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Logo size="sm" />
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Lost something? Found something? Let's reunite it with its owner.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex gap-4 text-sm">
              <Link to="/browse" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400">Browse</Link>
              <Link to="/report-lost" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400">Report Lost</Link>
              <Link to="/report-found" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400">Report Found</Link>
              <Link to="/dashboard" className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400">Dashboard</Link>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-lost-500 fill-current" /> for CSI AITR
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
