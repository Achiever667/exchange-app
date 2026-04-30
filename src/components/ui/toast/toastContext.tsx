"use client";

import { createContext, useCallback, useState, useRef } from "react";
import { Toast, ToastOptions, ToastContextValue } from "./types";

const DEFAULT_DURATION = 3000;

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = crypto.randomUUID();
      const duration = options.duration ?? DEFAULT_DURATION;

      const toast: Toast = {
        id,
        type: options.type,
        message: options.message,
        duration,
      };

      setToasts((prev) => [...prev, toast]);

      const timer = setTimeout(() => {
        removeToast(id);
        timersRef.current.delete(id);
      }, duration);

      timersRef.current.set(id, timer);

      return id;
    },
    [removeToast]
  );

  const clearAllToasts = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
}
