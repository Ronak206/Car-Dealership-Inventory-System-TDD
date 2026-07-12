import { useToast } from '../../context/ToastContext';
import type { ToastType } from '../../types';

const typeStyles: Record<ToastType, string> = {
  success: 'border-emerald-600/30 bg-emerald-50 text-emerald-800',
  error: 'border-red-600/30 bg-red-50 text-red-800',
  info: 'border-slate-600/30 bg-slate-800 text-slate-100',
};

const typeIcon: Record<ToastType, string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  info: 'M12 8v4M12 16h.01',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-80"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            'px-4 py-3 rounded border text-sm flex items-start gap-2.5',
            'shadow-lg animate-[toastIn_200ms_ease-out]',
            typeStyles[toast.type],
          ].join(' ')}
          role="status"
        >
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={typeIcon[toast.type]} />
          </svg>
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}