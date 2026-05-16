'use client'
import { useEffect } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { ToastItem } from '@/hooks/useToast'

interface ToastProps extends ToastItem { onDone: () => void }

export function Toast({ kind, message, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`toast ${kind}`}>
      <span className="t-icon">
        <Icon name={kind === 'error' ? 'alert' : kind === 'info' ? 'info' : 'check'} size={16} />
      </span>
      <div className="t-body">{message}</div>
      <div className="t-progress" />
    </div>
  )
}
