interface PlayerHeaderProps {
  username: string
  avatarUrl: string | null
  activeTitle: string | null
  onAvatarClick?: () => void
  compact?: boolean
}

export function PlayerHeader({
  username,
  avatarUrl,
  activeTitle,
  onAvatarClick,
  compact = false,
}: PlayerHeaderProps) {
  const initials = username.slice(0, 2).toUpperCase() || '??'
  const rootClass = compact
    ? 'flex items-center gap-2 px-2 py-1'
    : 'flex items-center gap-3 px-2 py-1'
  const avatarSize = compact ? 'w-7 h-7' : 'w-[52px] h-[52px]'
  const initialsClass = compact
    ? 'text-[10px] font-bold text-[hsl(var(--foreground))]'
    : 'font-display font-extrabold text-lg text-[hsl(var(--foreground))]'

  return (
    <div className={rootClass}>
      {onAvatarClick ? (
        <button
          onClick={onAvatarClick}
          className="relative shrink-0 group"
          aria-label="Changer la photo de profil"
        >
          <div
            className={`${avatarSize} rounded-full flex items-center justify-center border-2 border-white/30 shadow-md overflow-hidden`}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <span className={initialsClass}>{initials}</span>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[hsl(var(--foreground))]"
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
        </button>
      ) : (
        <div
          className={`${avatarSize} shrink-0 rounded-full bg-[hsl(var(--accent)/0.75)] flex items-center justify-center border-2 border-white/30 shadow-md overflow-hidden`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
          ) : (
            <span className={initialsClass}>{initials}</span>
          )}
        </div>
      )}

      <div className="min-w-0">
        {compact ? (
          <p
            className="text-xs font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'hsl(var(--foreground))' }}
          >
            {username || '—'}
          </p>
        ) : (
          <p className="text-xl font-display font-bold text-[hsl(var(--foreground))]">
            {username || '—'}
          </p>
        )}
        {compact ? (
          <p className="text-[9px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
            {activeTitle ?? null}
          </p>
        ) : (
          <p className="text-xs text-[hsl(var(--foreground))]/75 truncate drop-shadow-sm">
            {activeTitle ?? null}
          </p>
        )}
      </div>
    </div>
  )
}
