interface ProfileIdentityCardProps {
  username: string
  avatarUrl: string | null
  createdAt: string
  points: number
  onAvatarClick: () => void
}

export function ProfileIdentityCard({
  username,
  avatarUrl,
  createdAt,
  points,
  onAvatarClick,
}: ProfileIdentityCardProps) {
  const initials = username.slice(0, 2).toUpperCase() || '??'
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : '—'

  return (
    <div>
      <div className="h-[80px] bg-[linear-gradient(135deg,hsl(var(--primary)/0.55),hsl(var(--accent)/0.35))] relative flex items-start p-3"></div>

      <div className="px-6 pb-6">
        <button
          onClick={onAvatarClick}
          className="relative inline-block mt-[-44px] mb-4 group"
          aria-label="Changer la photo de profil"
        >
          <div className="w-[88px] h-[88px] rounded-full bg-[hsl(var(--accent)/0.75)] flex items-center justify-center border-4 border-[hsl(var(--card))] shadow-lg overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display font-extrabold text-2xl text-[hsl(var(--foreground))]">
                {initials}
              </span>
            )}
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

        <h2 className="font-display font-extrabold text-[1.35rem] tracking-[-0.03em] text-[hsl(var(--foreground))] leading-tight mb-0.5">
          {username || '—'}
        </h2>

        <p className="text-sm text-[hsl(var(--foreground-muted))] mb-4">
          #DWC-{new Date().getFullYear()}
        </p>

        <div className="inline-flex items-center gap-1.5 bg-[hsl(var(--primary)/0.12)] border border-[hsl(var(--primary)/0.25)] text-[hsl(var(--primary))] text-sm font-semibold px-3 py-1 rounded-full mb-5">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{points} pts</span>
        </div>

        <div className="border-t border-[hsl(var(--border))] my-4" />

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
  )
}
