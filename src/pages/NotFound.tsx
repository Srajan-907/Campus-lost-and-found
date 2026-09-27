import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-900/30 mb-6">
        <Compass className="h-10 w-10 text-brand-600 dark:text-brand-400" aria-hidden />
      </div>
      <p className="text-6xl font-bold text-brand-600 dark:text-brand-400">404</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4" /> Go Home
        </Link>
        <Link to="/browse" className="btn-secondary">
          <Search className="h-4 w-4" /> Browse Items
        </Link>
      </div>
    </div>
  );
}
