'use client'
import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'

const ICONS: IconName[] = [
  'folder', 'briefcase', 'home', 'heart',
  'shopping', 'user', 'book', 'leaf',
  'target', 'wand', 'sparkles', 'flame',
]

const COLORS = [
  '#4aba78', '#5a8df0', '#b48bff', '#e2a341',
  '#e5484d', '#e57eb0', '#5fc4cf', '#f97316',
  '#6b9eff', '#a78bfa', '#94a3b8', '#34d399',
]

interface CategoryModalProps {
  onClose: () => void
  onSave: (data: { name: string; icon: string; color: string }) => Promise<void>
}

export function CategoryModal({ onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<IconName>('folder')
  const [color, setColor] = useState(COLORS[0])
  const [saving, setSaving] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  const canSave = name.trim().length > 0

  const submit = async () => {
    if (!canSave || saving) return
    setSaving(true)
    try {
      await onSave({ name: name.trim(), icon, color })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title="Новая категория"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose}>Отмена</Button>
          <Button variant="primary" size="md" onClick={submit} loading={saving} disabled={!canSave} icon={!saving ? 'check' : undefined}>
            Создать
          </Button>
        </>
      }
    >
      <div className="field">
        <label className="field-label">Название</label>
        <input
          ref={nameRef}
          className="input"
          placeholder="Например: Работа"
          maxLength={40}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
      </div>

      <div className="field">
        <label className="field-label">Иконка</label>
        <div className="icon-picker-grid">
          {ICONS.map(ic => (
            <button
              key={ic}
              type="button"
              className={`icon-picker-btn${icon === ic ? ' selected' : ''}`}
              style={icon === ic ? { borderColor: color, color, background: `${color}18` } : {}}
              onClick={() => setIcon(ic)}
            >
              <Icon name={ic} size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label">Цвет</label>
        <div className="color-picker-row">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              className={`color-swatch${color === c ? ' selected' : ''}`}
              style={{ background: c, boxShadow: color === c ? `0 0 0 2px var(--bg-2), 0 0 0 4px ${c}` : 'none' }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="cat-preview-box">
        <div className="cat-icon" style={{ background: `${color}1a`, border: `1px solid ${color}40`, color, width: 40, height: 40, borderRadius: 10 }}>
          <Icon name={icon} size={20} />
        </div>
        <div>
          <div className="t-body" style={{ color: 'var(--text-1)', fontWeight: 600 }}>{name || 'Название категории'}</div>
          <div className="t-caption text-3">0 задач</div>
        </div>
      </div>
    </Modal>
  )
}
