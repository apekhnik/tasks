'use client'
import { Icon, type IconName } from '@/components/ui/Icon'

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: IconName
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  title?: string
  trailing?: React.ReactNode
}

export function Button({
  variant = 'ghost', size = 'md', icon, children,
  onClick, disabled, loading, type, title, trailing
}: ButtonProps) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size}${!children ? ' btn-icon' : ''}`}
    >
      {loading ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : icon ? (
        <Icon name={icon} size={14} />
      ) : null}
      {children && <span>{children}</span>}
      {trailing}
    </button>
  )
}
