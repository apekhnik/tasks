'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, type IconName } from '@/components/ui/Icon'

const NAV_ITEMS: { label: string; icon: IconName; href: string }[] = [
  { label: 'Рулетка',   icon: 'dice',         href: '/dashboard/roulette' },
  { label: 'Задачи',    icon: 'check-square', href: '/dashboard/tasks' },
  { label: 'Категории', icon: 'folder',       href: '/dashboard/categories' },
  { label: 'Прогресс',  icon: 'bar-chart',    href: '/dashboard/progress' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`bottom-nav-item${pathname.startsWith(item.href) ? ' active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
