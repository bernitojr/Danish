import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'

export type SortBy = 'points' | 'wins' | 'total_games' | 'winRate'

export type LeaderboardEntry = {
  user_id: string
  username: string
  avatar_url: string | null
  points: number
  total_games: number
  wins: number
  p2: number
  p3: number
  p4: number
  winRate: number
  active_title: string | null
}

async function fetchLeaderboard() {
  const { data, error } = await supabase.from('leaderboard').select('*')

  if (error) throw error
  return data
}

export function useLeaderboard(search: string, sortBy: SortBy) {
  const query = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const data = await fetchLeaderboard()
      return data.map((entry) => ({
        ...entry,
        winRate:
          entry.total_games > 0
            ? Math.round((entry.wins / entry.total_games) * 100)
            : 0,
      }))
    },
  })

  const filtered = (query.data ?? [])
    .filter((entry) =>
      entry.username.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b[sortBy] - a[sortBy])

  return { ...query, data: filtered, allData: query.data ?? [] }
}
