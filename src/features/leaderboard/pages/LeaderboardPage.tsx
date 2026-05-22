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
          {/* page eyebrow  */}
          <div
            className="
    flex
    items-center
    gap-3
    font-mono
    text-[0.7rem]
    text-[hsl(var(--accent))]
    uppercase
    tracking-[0.2em]
    mb-3
  "
          >
            Saison {new Date().getFullYear()}
          </div>
          <h1
            className="
    font-display
    font-extrabold
    text-[clamp(2rem,4vw,3.25rem)]
    tracking-[-0.04em]
    leading-[1]
  "
          >
            Classement{' '}
            <span
              className="
    bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--primary)))]
    bg-clip-text
    text-transparent
  "
            >
              général
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
          {/* bille verte */}
          <span
            className="
    w-[6px]
    h-[6px]
    rounded-full
    bg-[hsl(var(--accent))]
    animate-[blink_2s_ease-in-out_infinite]
  "
          ></span>

          <span
            className="
    text-[hsl(var(--foreground))]
    font-semibold
  "
          >
            <strong>{data.reduce((acc, e) => acc + e.total_games, 0)}</strong>{' '}
            parties · <strong>{data.length}</strong> joueurs
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
              <div key={entry.user_id} className={i === 1 ? 'mb-4' : ''}>
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
