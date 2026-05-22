import type { LeaderboardEntry } from '../hooks/useLeaderboard'

interface PodiumCardProps {
  entry: LeaderboardEntry
  rank: 1 | 2 | 3
}

export function PodiumCard({ entry, rank }: PodiumCardProps) {
  const rankClass = {
    1: {
      card: 'bg-[hsl(var(--gold)/0.25)] border-[hsl(var(--gold))]',
      badge: 'bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))]',
      avatar:
        'bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))] border-[hsl(var(--gold)/0.4)]',
      text: 'text-[hsl(var(--gold))]',
    },
    2: {
      card: 'bg-[hsl(var(--silver)/0.35)] border-[hsl(var(--silver))]',
      badge: 'bg-[hsl(var(--silver)/0.15)] text-[hsl(var(--silver))]',
      avatar:
        'bg-[hsl(var(--silver)/0.15)] text-[hsl(var(--silver))] border-[hsl(var(--silver)/0.4)]',
      text: 'text-[hsl(var(--silver))]',
    },
    3: {
      card: 'bg-[hsl(var(--bronze)/0.25)] border-[hsl(var(--bronze))]',
      badge: 'bg-[hsl(var(--bronze)/0.15)] text-[hsl(var(--bronze))]',
      avatar:
        'bg-[hsl(var(--bronze)/0.15)] text-[hsl(var(--bronze))] border-[hsl(var(--bronze)/0.4)]',
      text: 'text-[hsl(var(--bronze))]',
    },
  }
  const r = rankClass[rank]
  const initials = entry.username.slice(0, 2).toUpperCase()

  return (
    <div
      className={`relative border rounded-[calc(var(--radius)+4px)] pt-[1.75rem] px-[1.25rem] pb-[1.25rem] text-center overflow-hidden hover:-translate-y-1 transition-transform duration-300 ease-in-out ${r.card}`}
    >
      <div
        className={`relative z-[1] inline-flex items-center justify-center w-[36px] h-[36px] rounded-full font-display font-extrabold text-[0.95rem] mb-4 ${r.badge}`}
      >
        {rank}
      </div>

      <div
        className={`relative z-[1] w-[68px] h-[68px] rounded-full flex items-center justify-center font-display font-extrabold text-[1.4rem] mx-auto mb-[0.875rem] border-2 overflow-hidden ${r.avatar}`}
      >
        {entry.avatar_url ? (
          <img
            src={entry.avatar_url}
            alt={entry.username}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="relative z-[1] font-display font-bold text-[1.05rem] tracking-[-0.02em] text-[hsl(var(--foreground))] mb-[0.2rem]">
        {entry.username}
      </div>

      <div
        className={`relative z-[1] font-display font-extrabold text-[1.75rem] tracking-[-0.03em] leading-[1] ${r.text}`}
      >
        {entry.points}
      </div>
      <div className="relative z-[1] font-mono text-[0.6rem] text-[hsl(var(--foreground-muted))] uppercase tracking-[0.14em] mt-[0.3rem]">
        points
      </div>

      <div className="relative z-[1] flex flex-col md:flex-row items-center justify-center gap-[0.6rem] mt-4 pt-[0.9rem] border-t border-[hsl(var(--border)/0.45)]">
        <div className="flex flex-col items-center gap-[0.15rem] flex-1">
          <span className="font-mono text-[0.78rem] font-semibold text-[hsl(var(--foreground))]">
            {entry.wins}
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))]">
            victoires
          </span>
        </div>
        <div className="flex flex-col items-center gap-[0.15rem] flex-1">
          <span className="font-mono text-[0.78rem] font-semibold text-[hsl(var(--foreground))]">
            {entry.total_games}
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))]">
            parties
          </span>
        </div>
        <div className="flex flex-col items-center gap-[0.15rem] flex-1">
          <span className="font-mono text-[0.78rem] font-semibold text-[hsl(var(--foreground))]">
            {entry.winRate}%
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))]">
            taux
          </span>
        </div>
      </div>
    </div>
  )
}
