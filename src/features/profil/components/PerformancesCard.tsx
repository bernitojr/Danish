import { RecentGamesCard } from './RecentGamesCard'

interface PerformancesCardProps {
  p1: number
  p2: number
  p3: number
  p4: number
  total: number
  recentGames: { placement: number; played_at: string }[]
  totalGames: number
}

export function PerformancesCard({
  p1,
  p2,
  p3,
  p4,
  total,
  recentGames,
  totalGames,
}: PerformancesCardProps) {
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
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden">
      <div className="px-6 py-3.5 border-b border-[hsl(var(--border))]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-muted font-mono">
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
                {total > 0 ? `${Math.round((count / total) * 100)}%` : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <RecentGamesCard games={recentGames} totalGames={totalGames} />
    </div>
  )
}
