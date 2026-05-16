import { Icon } from '@/components/ui/Icon'

interface EmptyStateProps {
  icon?: string; title: string; sub?: string; cta?: React.ReactNode
}

export function EmptyState({ icon = 'dice', title, sub, cta }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="em-icon"><Icon name={icon as any} size={26} /></div>
      <div className="em-title">{title}</div>
      {sub && <div className="em-sub">{sub}</div>}
      {cta}
    </div>
  )
}
