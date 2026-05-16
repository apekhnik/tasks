import { createContext, useContext } from 'react'

export type ToastKind = 'success' | 'error' | 'info'
export interface ToastItem { id: string; kind: ToastKind; message: string }

export interface ToastContextValue {
  toast: (kind: ToastKind, message: string) => void
}

export const ToastContext = createContext<ToastContextValue>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)
