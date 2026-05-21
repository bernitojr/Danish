interface ProfileSettingsCardProps {
  onAvatarClick: () => void
  onPasswordClick: () => void
  onSignOutClick: () => void
}

export function ProfileSettingsCard({
  onAvatarClick,
  onPasswordClick,
  onSignOutClick,
}: ProfileSettingsCardProps) {
  return (
    <>
      {/* Settings card */}
      <div>
        <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))] font-mono">
            Paramètres du compte
          </h3>
        </div>

        {/* Photo de profil */}
        <button
          onClick={onAvatarClick}
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
          onClick={onPasswordClick}
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
          onClick={onSignOutClick}
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
    </>
  )
}
