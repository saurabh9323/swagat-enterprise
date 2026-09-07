import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
const icons = {
  error: CircleAlert,
  success: CircleCheck,
  info: Info,
};

function normalizeToast(input, fallbackType = 'info') {
  if (typeof input === 'string') {
    return { type: fallbackType, title: fallbackType === 'error' ? 'Action failed' : 'Update', message: input };
  }

  return {
    type: input?.type || fallbackType,
    title: input?.title || (fallbackType === 'error' ? 'Action failed' : 'Update'),
    message: input?.message || 'Something changed.',
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((input, fallbackType) => {
    const toast = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...normalizeToast(input, fallbackType),
    };

    setToasts((current) => [toast, ...current].slice(0, 4));
    window.setTimeout(() => dismissToast(toast.id), 4800);
    return toast.id;
  }, [dismissToast]);

  const value = useMemo(() => ({
    showToast,
    success: (message, title = 'Saved') => showToast({ type: 'success', title, message }),
    error: (error, title = 'Action failed') => showToast({
      type: 'error',
      title,
      message: error?.message || String(error || 'Something went wrong.'),
    }),
    info: (message, title = 'Notice') => showToast({ type: 'info', title, message }),
    dismissToast,
  }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <article className={`toast toast-${toast.type}`} key={toast.id}>
              <Icon size={20} />
              <div>
                <strong>{toast.title}</strong>
                <p>{toast.message}</p>
              </div>
              <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
                <X size={16} />
              </button>
            </article>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
