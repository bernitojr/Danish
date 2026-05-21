interface PlayerHeaderProps {
  username: string
  avatarUrl: string | null
  activeTitle: string | null
  onAvatarClick?: () => void
}

export function PlayerHeader({
  username,
  avatarUrl,
  activeTitle,
  onAvatarClick,
}: PlayerHeaderProps) {
  const initials = username.slice(0, 2).toUpperCase() || '??'

  return (
    <div className="h-[88px] bg-[linear-gradient(135deg,hsl(var(--primary)/0.55),hsl(var(--accent)/0.35))] flex items-center gap-3 px-4">
      {onAvatarClick ? (
        <button
          onClick={onAvatarClick}
          className="relative shrink-0 group"
          aria-label="Changer la photo de profil"
        >
          <div className="w-[52px] h-[52px] rounded-full  flex items-center justify-center border-2 border-white/30 shadow-md overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display font-extrabold text-lg text-[hsl(var(--foreground))]">
                {initials}
              </span>
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
        <div className="w-[52px] h-[52px] shrink-0 rounded-full bg-[hsl(var(--accent)/0.75)] flex items-center justify-center border-2 border-white/30 shadow-md overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display font-extrabold text-lg text-[hsl(var(--foreground))]">
              {initials}
            </span>
          )}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xl font-display font-bold text-[hsl(var(--foreground))]">
          {username || '—'}
        </p>
        <p className="text-xs text-[hsl(var(--foreground))]/75 truncate drop-shadow-sm">
          {activeTitle ?? null}
        </p>
      </div>
    </div>
  )
}
