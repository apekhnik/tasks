'use client'
import { usePathname } from 'next/navigation'

export function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const withRight = pathname.includes('/roulette') || pathname.includes('/categories')
  return <div className={`main${withRight ? ' with-right' : ''}`}>{children}</div>
}
