import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext({
  pushToast: () => {},
});

const TOAST_DURATION_MS = 3200;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timerId = timersRef.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      pushToast(payload) {
        const id = Date.now() + Math.random();
        const toast = { id, type: payload.type || 'success', message: payload.message };
        setToasts((prev) => [...prev, toast]);
        const timerId = setTimeout(() => {
          removeToast(id);
        }, TOAST_DURATION_MS);
        timersRef.current.set(id, timerId);
      },
    }),
    [removeToast],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timerId) => clearTimeout(timerId));
      timersRef.current.clear();
    },
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-[84px] z-[60] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`min-w-[250px] max-w-[320px] rounded-xl border px-3 py-3 text-sm shadow-[0_18px_36px_rgba(70,52,33,0.22)] backdrop-blur ${
              toast.type === 'error'
                ? 'border-red-300 bg-red-50/95 text-red-900'
                : 'border-sand-300 bg-[rgba(255,250,242,0.96)] text-sand-900'
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold ${
                  toast.type === 'error'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-wood-100 text-wood-700'
                }`}
              >
                {toast.type === 'error' ? '!' : '✓'}
              </span>
              <p className="flex-1 leading-5">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded px-1 text-sand-600 transition hover:bg-sand-100 hover:text-sand-900"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

