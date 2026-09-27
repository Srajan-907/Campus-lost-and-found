import type { SortValue } from '../types';
import { SORT_OPTIONS } from '../data/constants';
import { ChevronDown, ArrowDownWideNarrow } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SortDropdownProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((s) => s.value === value);

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
        className="btn-secondary btn-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ArrowDownWideNarrow className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Sort:</span>
        {current?.label}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 shadow-lg animate-fade-in">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                value === opt.value
                  ? 'text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-900/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              role="option"
              aria-selected={value === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
