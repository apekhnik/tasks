'use client'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  title: string; body: React.ReactNode
  confirmLabel?: string
  onConfirm: () => void; onCancel: () => void
}

export function ConfirmDialog({ title, body, confirmLabel = 'Удалить', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} confirm
      footer={
        <>
          <div className="spacer" />
          <Button variant="ghost" size="md" onClick={onCancel}>Отмена</Button>
          <Button variant="danger" size="md" icon="trash" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="t-body text-2">{body}</div>
    </Modal>
  )
}
