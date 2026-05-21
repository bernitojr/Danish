import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

type ProfileStats = {
  totalGames: number
  wins: number
  winRate: number
  points: number
  placements: { 1: number; 2: number; 3: number; 4: number }
  lastPlayedAt: string // date last game
  recentGames: { placement: number; played_at: string }[]
}

async function fetchGameResults(userId: string) {
  const { data, error } = await supabase
    .from('game_results')
    .select('placement, played_at')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

async function fetchPlayerPoints(userId: string) {
  const { data, error } = await supabase
    .from('player_points')
    .select('points')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data?.points ?? 0
}

export function useProfileStats() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['profile-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Non connecté')

      const [results, points] = await Promise.all([
        fetchGameResults(user.id),
        fetchPlayerPoints(user.id),
      ])

      // calculer totalGames (combien de lignes ?)
      const totalGames = results.length

      // calculer wins (lignes où placement === 1)
      const wins = results.filter((r) => r.placement === 1).length

      // calculer winRate (wins / totalGames * 100, arrondi)
      //           attention : que retournes-tu si totalGames === 0 ?
      const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

      // calculer placements { 1: N, 2: N, 3: N, 4: N }
      const placements = {
        1: results.filter((r) => r.placement === 1).length,
        2: results.filter((r) => r.placement === 2).length,
        3: results.filter((r) => r.placement === 3).length,
        4: results.filter((r) => r.placement === 4).length,
      }

      // dernier match joué (la date la plus récente), ou chaîne vide
      const lastPlayedAt =
        results && results.length
          ? results
              .map((r) => r.played_at)
              .filter(Boolean)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
          : ''

      return {
        totalGames,
        wins,
        winRate,
        placements,
        lastPlayedAt,
        points,
        recentGames: [...results].sort(
          (a, b) =>
            new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
        ),
      } satisfies ProfileStats
    },
    enabled: !!user?.id,
  })
}
