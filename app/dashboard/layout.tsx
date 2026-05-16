import { ensureUser } from '@/lib/ensure-user'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Icon } from '@/components/ui/Icon'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { MainContainer } from '@/components/layout/MainContainer'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const clerkUser = await ensureUser()
  if (!clerkUser) return null

  const userCategories = await db.select().from(categories).where(eq(categories.userId, clerkUser.id))

  const displayName = clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Пользователь'
  const initials = (clerkUser.firstName?.[0] ?? '') + (clerkUser.lastName?.[0] ?? displayName[1] ?? '')

  return (
    <ToastProvider>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="mark"><Icon name="dice" size={14} /></div>
            <div className="name">Taskroulette <span>· beta</span></div>
          </div>

          <SidebarNav categories={userCategories} />

          <div className="sidebar-footer">
            <div className="avatar">{initials.toUpperCase()}</div>
            <div className="who">
              {displayName}
              <small>личный профиль</small>
            </div>
            <span className="icon-btn" title="Настройки"><Icon name="settings" size={14} /></span>
          </div>
        </aside>

        <MainContainer>{children}</MainContainer>
      </div>
    </ToastProvider>
  )
}
