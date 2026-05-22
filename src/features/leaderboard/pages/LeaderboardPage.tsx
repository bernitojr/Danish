import { useState } from 'react'
import { useLeaderboard, type SortBy } from '../hooks/useLeaderboard'
import { PodiumCard } from '../components/PodiumCard'
import { LeaderboardTable } from '../components/LeaderTabler'

export function LeaderboardPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('points')
  const { data, allData, isLoading, error } = useLeaderboard(search, sortBy)

  if (isLoading) return null
  if (error) return <div>Erreur: {error.message}</div>

  const top3 = data.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]]

  const rankMap = new Map(
    [...allData]
      .sort((a, b) => b[sortBy] - a[sortBy])
      .map((entry, index) => [entry.user_id, index + 1])
  )
  const margins = ['mb-4', 'mb-8', 'mb-2']
  return (
    // container
    <div className="max-w-[1280px] mx-auto px-8 w-full">
      {/* header */}
      <div
        className="
    flex
    items-end
    justify-between
    gap-8
    flex-wrap
    pt-[3.5rem]
    pb-[1.5rem]
  "
      >
        {/* left  */}
        <div
          className="
    block
  "
        >
          <h1
            className="
    font-display
    font-extrabold
    text-[clamp(2rem,4vw,3.25rem)]
    text-[hsl(var(--foreground))]
    tracking-[-0.04em]
   
  "
          >
            Hall of fame
            <span
              className="
       bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--primary)))]
    bg-clip-text
    text-transparent"
            >
              {' '}
              {new Date().getFullYear()}
            </span>
          </h1>

          {/* droite */}
        </div>{' '}
        {/* season pill  */}
        <div
          className="
    inline-flex
    items-center
    gap-2
    bg-[hsl(var(--card))]
    border
    border-[hsl(var(--border))]
    rounded-full
    px-[0.95rem]
    py-[0.45rem]
    font-mono
    text-[0.7rem]
    uppercase
    tracking-[0.12em]
    text-[hsl(var(--foreground-muted))]
  "
        >
          <span
            className="
    text-[hsl(var(--foreground))]
    font-semibold
  "
          >
            <strong>
              {allData.reduce((acc, e) => acc + e.total_games, 0)}
            </strong>{' '}
            parties · <strong>{allData.length}</strong> joueurs
          </span>
        </div>
      </div>

      {/* podium section  */}
      <div
        className="
    relative
    my-4
    mb-12
    max-w-[900px]
    mx-auto
  "
      >
        <div className="grid grid-cols-3 gap-4 items-end mb-12">
          {podiumOrder.map((entry, i) => {
            if (!entry) return <div key={i} />
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3
            return (
              <div key={entry.user_id} className={margins[i] ?? ''}>
                <PodiumCard entry={entry} rank={rank as 1 | 2 | 3} />
              </div>
            )
          })}
        </div>
      </div>

      <LeaderboardTable
        data={data}
        search={search}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onSortChange={setSortBy}
        rankMap={rankMap}
      />
    </div>
  )
}
