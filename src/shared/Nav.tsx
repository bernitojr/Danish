import { useState } from 'react'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { MobileDrawer } from './MobileDrawer'
import { useAuthStore } from '@/stores/useAuthStore'
import logoDwc from '@/assets/logo-DWCV1.png'
// import { useAuth } from '@/hooks/useAuth'

const NAV_LINKS = [
  { label: 'Home', href: '/Danish' },
  { label: 'Règles', href: '' },
  { label: 'Jouer', href: '/Danish/game' },
  { label: 'Classement', href: '' },
  { label: 'Profil', href: '/Danish/profile' },
]

interface NavProps {
  onNavigate: (path: string) => void
}

export function Nav({ onNavigate }: NavProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { user } = useAuthStore()
  // const { signOut } = useAuth()

  return (
    <>
      <nav
        className="
          sticky top-0 z-50
          bg-[hsl(var(--background)/0.8)] backdrop-blur-md
          border-b border-[hsl(var(--border)/0.5)]
        "
      >
        <div
          className="
            max-w-[1280px] mx-auto
            flex items-center gap-8
            px-8 py-3.5
          "
        >
          {/* BRAND */}
          <a
            href="/"
            className="flex items-center gap-2.5 no-underline shrink-0"
          >
            <img
              src={logoDwc}
              alt="Logo DWC"
              className="w-[30px] h-[30px] object-contain"
            />
            <span className="font-display font-extrabold text-base tracking-tight text-[hsl(var(--foreground))]">
              DWC
            </span>
          </a>

          {/* LIENS DESKTOP — cachés sur mobile */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  text-sm font-medium
                  text-[hsl(var(--foreground-muted))]
                  hover:text-[hsl(var(--foreground))]
                  hover:bg-[hsl(var(--border)/0.4)]
                  px-3 py-2
                  rounded-md
                  transition-colors
                  no-underline
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {!user && (
              <button
                onClick={() => onNavigate('/auth')}
                className="     bg-[hsl(var(--primary))]
                text-[hsl(var(--primary-foreground))]
                text-sm font-semibold
                px-4 py-2 rounded-md
                hover:opacity-90
                transition-opacity
                no-underline"
              >
                {' '}
                Se connecter
              </button>
            )}
          </div>

          {/* BURGER — visible uniquement sur mobile */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Ouvrir le menu"
            className="
              md:hidden
              p-2 rounded-md
              text-[hsl(var(--foreground))]
              hover:bg-[hsl(var(--border)/0.4)]
              transition-colors
            "
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* DRAWER MOBILE */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        links={NAV_LINKS}
      />
    </>
  )
}
