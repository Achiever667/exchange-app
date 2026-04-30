"use client";

import { useContext } from "react";
import { ToastContext } from "./toastContext";
import { ToastContextValue } from "./types";

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext) as ToastContextValue;
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

export function useToast_addToast() {
  const context = useContext(ToastContext) as ToastContextValue;
  
  if (!context) {
    throw new Error("useToast_addToast must be used within a ToastProvider");
  }
  
  const { addToast } = context;
  
  const success = (message: string, duration?: number) => 
    addToast({ type: "success", message, duration });
  
  const error = (message: string, duration?: number) => 
    addToast({ type: "error", message, duration });
  
  const info = (message: string, duration?: number) => 
    addToast({ type: "info", message, duration });
  
  const warning = (message: string, duration?: number) => 
    addToast({ type: "warning", message, duration });
  
  return { success, error, info, warning };
}
