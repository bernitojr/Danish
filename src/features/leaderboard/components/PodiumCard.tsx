export function PodiumCard({ entry, rank }: PodiumCardProps) {
  const colors = {
    1: 'hsl(var(--gold))',
    2: 'hsl(var(--silver))',
    3: 'hsl(var(--bronze))',
  }
  const color = colors[rank]
  const initials = entry.username.slice(0, 2).toUpperCase()

  return (
    <div className="relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[calc(var(--radius)+4px)] pt-[1.75rem] px-[1.25rem] pb-[1.25rem] text-center transition-transform duration-300 ease-in-out overflow-hidden">
      {/* rank */}
      <div
        className="relative z-[1] inline-flex items-center justify-center w-[36px] h-[36px] rounded-full font-display font-extrabold text-[0.95rem] mb-4"
        style={{ background: `${color}20`, color }}
      >
        {rank}
      </div>

      {/* avatar */}
      <div
        className="relative z-[1] w-[68px] h-[68px] rounded-full flex items-center justify-center font-display font-extrabold text-[1.4rem] mx-auto mb-[0.875rem] border-2 overflow-hidden"
        style={{ background: `${color}20`, color, borderColor: `${color}66` }}
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

      {/* name */}
      <div className="relative z-[1] font-display font-bold text-[1.05rem] tracking-[-0.02em] text-[hsl(var(--foreground))] mb-[0.2rem]">
        {entry.username}
      </div>

      {/* points */}
      <div
        className="relative z-[1] font-display font-extrabold text-[1.75rem] tracking-[-0.03em] leading-[1]"
        style={{ color }}
      >
        {entry.points}
      </div>
      <div className="relative z-[1] font-mono text-[0.6rem] text-[hsl(var(--foreground-muted))] uppercase tracking-[0.14em] mt-[0.3rem]">
        points
      </div>

      {/* stats */}
      <div className="relative z-[1] flex items-center justify-center gap-[0.6rem] mt-4 pt-[0.9rem] border-t border-[hsl(var(--border)/0.45)]">
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
