import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { MobileDrawer } from './MobileDrawer'
import { useAuthStore } from '@/stores/useAuthStore'
import logoDwc from '@/assets/logo-DWCV1.png'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Règles', href: '/rules' },
  { label: 'Jouer', href: '/game' },
  { label: 'Classement', href: '/leaderboard' },
  { label: 'Profil', href: '/profile' },
]

export function Nav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()

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
            href="/Danish/"
            className="flex items-center gap-2.5 no-underline shrink-0"
          >
            <img
              src={logoDwc}
              alt="Logo DWC"
              className="w-[60px] h-[60px] object-contain"
            />
          </a>

          {/* LIENS DESKTOP — cachés sur mobile */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
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
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {!user && (
              <button
                onClick={() => navigate('/auth')}
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
              ml-auto
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
        user={user}
      />
    </>
  )
}
