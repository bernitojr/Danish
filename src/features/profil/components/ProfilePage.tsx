import { useRef, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAuth } from '@/hooks/useAuth'
import { useProfileStats } from '../hooks/useProfileStats'
import { supabase } from '@/lib/supabase'
import { ChangePasswordModal } from './ChangePasswordModal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ProfilePage() {
  const { profile, user, setProfile } = useAuthStore()
  const { data, isLoading, error } = useProfileStats()
  const { signOut } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      console.error('Avatar upload failed:', uploadError)
      return
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    const publicUrl = urlData.publicUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update failed:', updateError)
      return
    }

    if (profile) {
      setProfile({ ...profile, avatar_url: publicUrl })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-[hsl(var(--foreground-muted))]">
        Chargement…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-[hsl(var(--delete))]">
        Erreur : {error.message}
      </div>
    )
  }

  const initials = (profile?.username ?? '?').slice(0, 2).toUpperCase()
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const total = data?.totalGames ?? 0
  const p1 = data?.placements[1] ?? 0
  const p2 = data?.placements[2] ?? 0
  const p3 = data?.placements[3] ?? 0
  const p4 = data?.placements[4] ?? 0

  const placements = [
    {
      label: '1er',
      count: p1,
      color: 'hsl(var(--gold))',
      bg: 'hsl(var(--gold)/0.25)',
      border: 'hsl(var(--gold))',
      sub: 'Victoires',
    },
    {
      label: '2e',
      count: p2,
      color: 'hsl(var(--silver))',
      bg: 'hsl(var(--silver)/0.35)',
      border: 'hsl(var(--silver))',
      sub: '2ièmes places',
    },
    {
      label: '3e',
      count: p3,
      color: 'hsl(var(--bronze))',
      bg: 'hsl(var(--bronze)/0.25)',
      border: 'hsl(var(--bronze))',
      sub: '3ièmes places',
    },
    {
      label: '4e',
      count: p4,
      color: 'hsl(var(--foreground-muted))',
      bg: 'hsl(var(--foreground-muted)/0.15)',
      border: 'hsl(var(--foreground-muted))',
      sub: '4ièmes places',
    },
  ]

  const POINTS_BY_PLACEMENT: Record<number, number> = {
    1: 3,
    2: 2,
    3: 1,
    4: 0,
  }

  const ITEMS_PER_PAGE = 3
  const totalPages = Math.ceil((data?.recentGame.length ?? 0) / ITEMS_PER_PAGE)
  const visibleGames = data?.recentGame.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  )

  return (
    <div className="max-w-[1280px] mx-auto px-8 relative z-[2] w-full">
      {/* Hidden file input — triggered by avatar click or settings row */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-[380px_1fr] gap-6 pb-20 items-start mt-[5vh] max-md:grid-cols-1">
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-4 max-md:max-w-[480px] max-md:w-full">
          {/* Identity card */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden">
            {/* Gradient header */}
            <div className="h-[80px] bg-[linear-gradient(135deg,hsl(var(--primary)/0.55),hsl(var(--accent)/0.35))] relative flex items-start p-3"></div>

            {/* Body */}
            <div className="px-6 pb-6">
              {/* Avatar — overflows the header, clickable to change photo */}
              <button
                onClick={handleAvatarClick}
                className="relative inline-block mt-[-44px] mb-4 group"
                aria-label="Changer la photo de profil"
              >
                <div className="w-[88px] h-[88px] rounded-full bg-[hsl(var(--accent)/0.75)] flex items-center justify-center border-4 border-[hsl(var(--card))] shadow-lg overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display font-extrabold text-2xl text-[hsl(var(--foreground))]">
                      {initials}
                    </span>
                  )}
                  {/* hover overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[hsl(var(--accent))] border-2 border-[hsl(var(--card))]" />
              </button>

              {/* Name */}
              <h2 className="font-display font-extrabold text-[1.35rem] tracking-[-0.03em] text-[hsl(var(--foreground))] leading-tight mb-0.5">
                {profile?.username ?? '—'}
              </h2>

              {/* Tag */}
              <p className="text-sm text-[hsl(var(--foreground-muted))] mb-4">
                #DWC-{new Date().getFullYear()}
              </p>

              {/* Points badge */}
              <div className="inline-flex items-center gap-1.5 bg-[hsl(var(--primary)/0.12)] border border-[hsl(var(--primary)/0.25)] text-[hsl(var(--primary))] text-sm font-semibold px-3 py-1 rounded-full mb-5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{data?.points ?? 0} pts</span>
              </div>

              {/* Divider */}
              <div className="border-t border-[hsl(var(--border))] my-4" />

              {/* Meta */}
              <div className="flex flex-col gap-2.5 text-sm text-[hsl(var(--foreground-muted))]">
                <div className="flex items-center gap-2.5">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Membre depuis {memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings card */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))] font-mono">
                Paramètres du compte
              </h3>
            </div>

            {/* Photo de profil */}
            <button
              onClick={handleAvatarClick}
              className="w-full flex items-center gap-3.5 px-5 py-4 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground)/0.04)] transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-[hsl(var(--primary))]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Photo de profil
                </p>
                <p className="text-xs text-[hsl(var(--foreground-muted))] mt-0.5">
                  JPG, PNG — MAX 5 MB
                </p>
              </div>
              <svg
                className="w-4 h-4 text-[hsl(var(--foreground-muted))] shrink-0 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 18l6-6-6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Mot de passe */}
            <button
              className="w-full flex items-center gap-3.5 px-5 py-4 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground)/0.04)] transition-colors text-left group"
              onClick={() => setIsModalPasswordOpen(true)}
            >
              <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-[hsl(var(--primary))]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Mot de passe
                </p>
                <p className="text-xs text-[hsl(var(--foreground-muted))] mt-0.5">
                  Modifier le mot de passe
                </p>
              </div>
              <svg
                className="w-4 h-4 text-[hsl(var(--foreground-muted))] shrink-0 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 18l6-6-6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Se déconnecter */}
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-[hsl(var(--delete)/0.06)] transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-[hsl(var(--delete)/0.1)] flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-[hsl(var(--delete))]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="16 17 21 12 16 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="21"
                    y1="12"
                    x2="9"
                    y2="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--delete))]">
                  Se déconnecter
                </p>
                <p className="text-xs text-[hsl(var(--foreground-muted))] mt-0.5">
                  Fermer la session
                </p>
              </div>
              <svg
                className="w-4 h-4 text-[hsl(var(--delete)/0.6)] shrink-0 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 18l6-6-6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4">
          {/* Performances card */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden">
            <div className="px-6 py-3.5 border-b border-[hsl(var(--border))]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))] font-mono">
                Performances · Saison {new Date().getFullYear()}
              </h3>
            </div>

            <div className="p-6">
              {/* 4 stat boxes */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {placements.map(({ label, count, color, bg, border, sub }) => (
                  <div
                    key={label}
                    className="rounded-[var(--radius)] p-4 text-center"
                    style={{
                      backgroundColor: bg,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color }}
                    >
                      {label}
                    </p>
                    <p className="font-display font-extrabold text-[2rem] leading-none text-[hsl(var(--foreground))] mb-2">
                      {count}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-[hsl(var(--foreground-muted))]">
                      {sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <div className="flex flex-col gap-3">
                {placements.map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[11px] text-[hsl(var(--foreground-muted))] w-5 shrink-0 font-medium">
                      {label}
                    </span>
                    <div className="flex-1 h-1.5 bg-[hsl(var(--background-dark))] rounded-full overflow-hidden border border-[hsl(var(--background-dark))]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: total > 0 ? `${(count / total) * 100}%` : '0%',
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-[hsl(var(--foreground-muted))] w-8 text-right shrink-0">
                      {total > 0
                        ? `${Math.round((count / total) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Séparateur → border-t remplace la deuxième card */}
            {/* ── Section Parties récentes ── */}
            <div className="border-t border-border border-[hsl(var(--border))]">
              <div className="px-6 py-3.5 border-b border-border flex items-center justify-between border-[hsl(var(--border))]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentPage === 0}
                    className={`p-1 rounded transition-colors ${
                      currentPage === 0
                        ? 'opacity-25'
                        : 'hover:bg-[hsl(var(--foreground)/0.06)] cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 text-[hsl(var(--foreground-muted))]" />
                  </button>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-muted font-mono">
                    Parties récentes
                  </h3>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages - 1, prev + 1)
                      )
                    }
                    disabled={currentPage === totalPages - 1}
                    className={`p-1 rounded transition-colors ${
                      currentPage === totalPages - 1
                        ? 'opacity-25'
                        : 'hover:bg-[hsl(var(--foreground)/0.06)] cursor-pointer'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4 text-[hsl(var(--foreground-muted))]" />
                  </button>
                </div>
                <span className="text-[11px] text-foreground-muted">
                  {total} partie{total !== 1 ? 's' : ''} jouée
                  {total !== 1 ? 's' : ''}
                </span>
              </div>

              {!data?.recentGame?.length ? (
                <div className="px-6 py-12 flex items-center justify-center text-sm text-foreground-muted">
                  Aucune partie jouée pour l'instant.
                </div>
              ) : (
                <div className="divide-y divide-border border-[hsl(var(--border))]">
                  {visibleGames?.map((game, index) => {
                    const pts = POINTS_BY_PLACEMENT[game.placement] ?? 0
                    const badgeStyles: Record<number, string> = {
                      1: 'bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))] border border-[hsl(var(--gold))]',
                      2: 'bg-[hsl(var(--silver)/0.15)] text-[hsl(var(--silver))] border border-[hsl(var(--silver))]',
                      3: 'bg-[hsl(var(--bronze)/0.15)] text-[hsl(var(--bronze))] border border-[hsl(var(--bronze))]',
                      4: 'bg-background-dark text-foreground-muted border border-[hsl(var(--border))]',
                    }
                    const badgeCls =
                      badgeStyles[game.placement] ?? badgeStyles[4]
                    const placementLabel =
                      game.placement === 1
                        ? '1er'
                        : game.placement === 2
                          ? '2e'
                          : game.placement === 3
                            ? '3e'
                            : '4e'
                    const dateStr = new Date(game.played_at)
                      .toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                      .toUpperCase()

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-background-dark transition-colors border-[hsl(var(--border))]"
                      >
                        {/* Badge placement */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${badgeCls}`}
                        >
                          {placementLabel}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-foreground truncate">
                            vs. Bot · Partie classée
                          </p>
                          <p className="text-[11px] text-foreground-muted mt-0.5 tracking-wide">
                            {dateStr}
                          </p>
                        </div>

                        {/* Points */}
                        <span
                          className={`text-[13px] font-semibold shrink-0 ${pts === 0 ? 'text-foreground-muted' : 'text-primary'}`}
                        >
                          +{pts} pts
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isModalPasswordOpen}
        onClose={() => setIsModalPasswordOpen(false)}
      />
    </div>
  )
}
