'use client'
import { useEffect } from 'react'
import { Icon } from '@/components/ui/Icon'

interface ModalProps {
  title: string; onClose: () => void
  children: React.ReactNode; footer?: React.ReactNode; confirm?: boolean
}

export function Modal({ title, onClose, children, footer, confirm }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal${confirm ? ' confirm' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <span className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></span>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}
