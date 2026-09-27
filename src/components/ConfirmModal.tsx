import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'success';
}

export function ConfirmModal({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'primary',
}: ConfirmModalProps) {
  const btnClass = variant === 'danger' ? 'btn-danger' : variant === 'success' ? 'bg-found-600 text-white hover:bg-found-700 btn' : 'btn-primary';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          {variant === 'danger' && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden />
            </div>
          )}
          <p className="text-sm text-slate-600 dark:text-slate-300 pt-2">{message}</p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">{cancelLabel}</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={btnClass}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
