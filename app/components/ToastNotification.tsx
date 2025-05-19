'use client';

import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: Toast['type']) => void;
  hideToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      hideToast(id);
    }, 3000);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} hideToast={hideToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ 
  toasts, 
  hideToast 
}: { 
  toasts: Toast[]; 
  hideToast: (id: string) => void 
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${
            toast.type === 'success' 
              ? 'bg-green-500' 
              : toast.type === 'error' 
              ? 'bg-red-500' 
              : 'bg-blue-500'
          } text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] transform transition-transform duration-300 hover:scale-105`}
        >
          <div className="flex-1">{toast.message}</div>
          <button
            onClick={() => hideToast(toast.id)}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}; 