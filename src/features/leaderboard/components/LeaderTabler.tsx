import { Search } from 'lucide-react'
import type { LeaderboardEntry, SortBy } from '../hooks/useLeaderboard'

interface LeaderboardTableProps {
  data: LeaderboardEntry[]
  search: string
  sortBy: SortBy
  onSearchChange: (value: string) => void
  onSortChange: (value: SortBy) => void
  rankMap: Map<string, number>
}

export function LeaderboardTable({
  data,
  search,
  sortBy,
  onSearchChange,
  onSortChange,
  rankMap,
}: LeaderboardTableProps) {
  return (
    <div>
      {/* barre recherche + filtres */}
      <div
        className="
    flex
    items-center
    justify-between
    gap-4
    mb-4
    flex-wrap
  "
      >
        {/* gauche  */}
        <div
          className="
    flex
    items-center
    gap-[0.625rem]
    flex-wrap
  "
        >
          {/* searchbar */}
          <div className="relative">
            <Search
              className="
      absolute
      left-3
      top-1/2
      -translate-y-1/2
      w-[14px]
      h-[14px]
      text-[hsl(var(--foreground-muted))]
      pointer-events-none
    "
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search a player"
              className="
    bg-[hsl(var(--card))]
    border
    border-[hsl(var(--border))]
    rounded-[var(--radius)]
    py-2
    pr-[0.875rem]
    pl-[2.25rem]
    font-sans
    text-[0.8125rem]
    text-[hsl(var(--foreground))]
    outline-none
    w-[220px]
    transition-colors
    duration-200

    focus:border-[hsl(var(--primary))]
    focus:outline-none
    focus:ring-0
  "
            />
          </div>
          {/* btn de filtre */}
          <div
            className="
    flex
    items-center
    gap-[0.4rem]
    bg-[hsl(var(--card))]
    border border-[hsl(var(--border))]
    rounded-[var(--radius)]
    p-[3px]
  "
          >
            {/* btn points */}
            <button
              onClick={() => onSortChange('points')}
              className={`
    inline-flex
    items-center
    gap-[0.4rem]
    bg-transparent
    border-none
    rounded-[calc(var(--radius)-4px)]
    py-[0.35rem]
    px-[0.75rem]
    font-mono
    text-[0.65rem]
    uppercase
    tracking-[0.1em]
    text-[hsl(var(--foreground-muted))]
    cursor-pointer
    transition-colors
    duration-150

    hover:bg-[hsl(var(--card)/0.5)]
hover:text-[hsl(var(--foreground))]... ${sortBy === 'points' ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' : ''}`}
            >
              Points
            </button>
            {/* btn victoires */}
            <button
              onClick={() => onSortChange('wins')}
              className={`
    inline-flex
    items-center
    gap-[0.4rem]
    bg-transparent
    border-none
    rounded-[calc(var(--radius)-4px)]
    py-[0.35rem]
    px-[0.75rem]
    font-mono
    text-[0.65rem]
    uppercase
    tracking-[0.1em]
    text-[hsl(var(--foreground-muted))]
    cursor-pointer
    transition-colors
    duration-150

    hover:bg-[hsl(var(--card)/0.5)]
hover:text-[hsl(var(--foreground))]... ${sortBy === 'wins' ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' : ''}`}
            >
              Victoires
            </button>
            {/* btn games */}
            <button
              onClick={() => onSortChange('total_games')}
              className={`
    inline-flex
    items-center
    gap-[0.4rem]
    bg-transparent
    border-none
    rounded-[calc(var(--radius)-4px)]
    py-[0.35rem]
    px-[0.75rem]
    font-mono
    text-[0.65rem]
    uppercase
    tracking-[0.1em]
    text-[hsl(var(--foreground-muted))]
    cursor-pointer
    transition-colors
    duration-150

    hover:bg-[hsl(var(--card)/0.5)]
hover:text-[hsl(var(--foreground))]... ${sortBy === 'total_games' ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' : ''}`}
            >
              Parties
            </button>
            {/* btn win rate */}
            <button
              onClick={() => onSortChange('winRate')}
              className={`
    inline-flex
    items-center
    gap-[0.4rem]
    bg-transparent
    border-none
    rounded-[calc(var(--radius)-4px)]
    py-[0.35rem]
    px-[0.75rem]
    font-mono
    text-[0.65rem]
    uppercase
    tracking-[0.1em]
    text-[hsl(var(--foreground-muted))]
    cursor-pointer
    transition-colors
    duration-150

    hover:bg-[hsl(var(--card)/0.5)]
hover:text-[hsl(var(--foreground))]... ${sortBy === 'winRate' ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' : ''}`}
            >
              taux win
            </button>
          </div>
        </div>{' '}
        {/* fin gauche */}
        {/* compteur résultat  */}
        <div
          className="
    font-mono
    text-[0.7rem]
    text-[hsl(var(--foreground-muted))]
    uppercase
    tracking-[0.1em]
  "
        >
          <span
            className="
    text-[hsl(var(--foreground-secondary))]
    font-semibold
  "
          >
            {data.length}
          </span>
          résultats
        </div>
      </div>{' '}
      {/* tableau */}
      <div className="border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="py-3 px-4 text-left font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))] w-12">
                #
              </th>
              <th className="py-3 px-4 text-left font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))]">
                Joueur
              </th>
              <th className="py-3 px-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--gold))]">
                1er
              </th>
              <th className="py-3 px-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--silver))]">
                2ème
              </th>
              <th className="py-3 px-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--bronze))]">
                3ème
              </th>
              <th className="py-3 px-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))]">
                4ème
              </th>
              <th className="py-3 px-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))]">
                Parties
              </th>
              <th className="py-3 px-4 text-right font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[hsl(var(--primary))]">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => {
              const rank = rankMap.get(entry.user_id) ?? index + 1
              const rankColor =
                rank === 1
                  ? 'hsl(var(--gold))'
                  : rank === 2
                    ? 'hsl(var(--silver))'
                    : rank === 3
                      ? 'hsl(var(--bronze))'
                      : 'hsl(var(--foreground-muted))'
              const initials = entry.username.slice(0, 2).toUpperCase()

              return (
                <tr
                  key={entry.user_id}
                  className="border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--foreground)/0.03)] transition-colors cursor-pointer last:border-0"
                >
                  <td className="py-3 px-4 w-12">
                    <span
                      className="font-mono text-[0.9rem] font-semibold"
                      style={{ color: rankColor }}
                    >
                      {rank}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          borderColor: rankColor,
                          color: rankColor,
                          background: `${rankColor}20`,
                        }}
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
                      <div>
                        <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                          {entry.username}
                        </p>
                        <p className="text-xs text-[hsl(var(--foreground-muted))] font-display">
                          {entry.active_title ??
                            `#DWC-${new Date().getFullYear()}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center font-mono text-sm font-semibold text-[hsl(var(--gold))]">
                    {entry.wins}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-sm text-[hsl(var(--silver))]">
                    {entry.p2}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-sm text-[hsl(var(--bronze))]">
                    {entry.p3}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-sm text-[hsl(var(--foreground-muted))]">
                    {entry.p4}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-sm text-[hsl(var(--foreground-muted))]">
                    {entry.total_games}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 bg-[hsl(var(--primary)/0.12)] border border-[hsl(var(--primary)/0.25)] text-[hsl(var(--primary))] text-xs font-semibold px-2.5 py-1 rounded-full font-mono">
                      ★ {entry.points}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
