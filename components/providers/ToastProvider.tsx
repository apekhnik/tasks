'use client'
import { useState, useCallback } from 'react'
import { ToastContext, type ToastItem, type ToastKind } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((kind: ToastKind, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(ts => [...ts, { id, kind, message }])
  }, [])

  const dismiss = (id: string) => setToasts(ts => ts.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toasts">
        {toasts.map(t => <Toast key={t.id} {...t} onDone={() => dismiss(t.id)} />)}
      </div>
    </ToastContext.Provider>
  )
}
