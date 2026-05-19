import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

type ProfileStats = {
  totalGames: number
  wins: number
  winRate: number
  placements: { 1: number; 2: number; 3: number; 4: number }
}

async function fetchGameResults(userId: string) {
  const { data, error } = await supabase
    .from('game_results')
    .select('placement')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

export function useProfileStats() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['profile-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Non connecté')

      const results = await fetchGameResults(user.id)

      // TODO 1 : calculer totalGames (combien de lignes ?)
      const totalGames = results.length

      // TODO 2 : calculer wins (lignes où placement === 1)
      const wins = results.filter((r) => r.placement === 1).length

      // TODO 3 : calculer winRate (wins / totalGames * 100, arrondi)
      //           attention : que retournes-tu si totalGames === 0 ?
      const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

      // TODO 4 : calculer placements { 1: N, 2: N, 3: N, 4: N }
      //           indice : tu peux utiliser reduce() ou filter() pour chaque valeur
      const placements = {
        1: results.filter((r) => r.placement === 1).length,
        2: results.filter((r) => r.placement === 2).length,
        3: results.filter((r) => r.placement === 3).length,
        4: results.filter((r) => r.placement === 4).length,
      }

      return { totalGames, wins, winRate, placements } satisfies ProfileStats
    },
    enabled: !!user?.id,
  })
}
