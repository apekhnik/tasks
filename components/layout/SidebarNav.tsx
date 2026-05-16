'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/Icon'
import type { Category } from '@/lib/db/schema'

const NAV_ITEMS: { id: string; label: string; icon: IconName; href: string }[] = [
  { id: 'roulette',   label: 'Рулетка',   icon: 'dice',         href: '/dashboard/roulette' },
  { id: 'tasks',      label: 'Задачи',     icon: 'check-square', href: '/dashboard/tasks' },
  { id: 'categories', label: 'Категории',  icon: 'folder',       href: '/dashboard/categories' },
  { id: 'progress',   label: 'Прогресс',   icon: 'bar-chart',    href: '/dashboard/progress' },
]

export function SidebarNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname()

  return (
    <>
      <div>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={`nav-item${pathname.startsWith(item.href) ? ' active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <Icon name={item.icon} size={16} />
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="nav-section-label">Категории</div>
      <div>
        {categories.map(c => (
          <Link
            key={c.id}
            href={`/dashboard/tasks?category=${c.id}`}
            className="nav-cat"
            style={{ textDecoration: 'none' }}
          >
            <span className="dot" style={{ background: c.color }} />
            <span className="nav-label">{c.name}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
