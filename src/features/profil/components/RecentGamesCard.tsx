import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RecentGamesCardProps {
  games: { placement: number; played_at: string }[]
  totalGames: number
}

export function RecentGamesCard({ games, totalGames }: RecentGamesCardProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const ITEMS_PER_PAGE = 3
  const POINTS_BY_PLACEMENT: Record<number, number> = { 1: 3, 2: 2, 3: 1, 4: 0 }
  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE)
  const visibleGames = games.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  )

  return (
    <div className="border-t border-border border-[hsl(var(--border))]">
      <div className="px-6 py-3.5 border-b border-border flex items-center justify-between border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className={`p-1 rounded transition-colors ${
              currentPage === 0
                ? 'opacity-25'
                : 'hover:bg-[hsl(var(--foreground)/0.06)] cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4 text-[hsl(var(--foreground-muted))]" />
          </button>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-muted font-sans">
            Parties récentes
          </h3>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
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
        <span className="text-[10px] font-mono text-foreground-muted">
          {totalGames} partie{totalGames !== 1 ? 's' : ''} jouée
          {totalGames !== 1 ? 's' : ''}
        </span>
      </div>

      {!games.length ? (
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
            const badgeCls = badgeStyles[game.placement] ?? badgeStyles[4]
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
                  <p className="text-[13px] font-medium text-[hsl(var(--foreground))] truncate">
                    vs. Bot · Partie classée
                  </p>
                  <p className="text-[11px] text-[hsl(var(--foreground-muted))] mt-0.5 tracking-wide">
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
  )
}
