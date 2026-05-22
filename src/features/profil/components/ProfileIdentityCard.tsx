import { PlayerHeader } from '@/shared/PlayerHeader'
import { TitleSelect } from '@/shared/TitleSelect'

interface ProfileIdentityCardProps {
  username: string
  avatarUrl: string | null
  createdAt: string
  points: number
  activeTitle: string | null
  unlockedTitles: { title_id: string; name: string; description: string }[]
  onAvatarClick?: () => void
  onTitleChange?: (titleId: string | null) => void
  allTitles: { id: string; name: string; description: string }[]
}

export function ProfileIdentityCard({
  username,
  avatarUrl,
  createdAt,
  points,
  activeTitle,
  unlockedTitles,
  onAvatarClick,
  onTitleChange,
  allTitles,
}: ProfileIdentityCardProps) {
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const activeTitleName =
    unlockedTitles.find((t) => t.title_id === activeTitle)?.name ?? null

  return (
    <div>
      <PlayerHeader
        username={username}
        avatarUrl={avatarUrl}
        activeTitle={activeTitleName}
        onAvatarClick={onAvatarClick}
      />

      <div className="px-6 py-4 flex flex-col gap-4">
        {onTitleChange && (
          <TitleSelect
            activeTitle={activeTitle}
            allTitles={allTitles}
            unlockedTitles={unlockedTitles}
            onTitleChange={onTitleChange}
          />
        )}
        {/* Points + tag */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-[hsl(var(--primary)/0.12)] border border-[hsl(var(--primary)/0.25)] text-[hsl(var(--primary))] text-sm font-semibold px-3 py-1 rounded-full">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-mono">{points} pts</span>
          </div>
          <span className="text-sm text-[hsl(var(--foreground-muted))] font-display">
            #DWC-{new Date().getFullYear()}
          </span>
        </div>

        {/* Membre depuis */}
        <div className="border-t border-[hsl(var(--border))] pt-3 flex items-center gap-2.5 text-sm text-[hsl(var(--foreground-muted))]">
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
  )
}
