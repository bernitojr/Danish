import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type PublicProfile = {
  user_id: string
  username: string
  avatar_url: string | null
  created_at: string | null
  active_title_id: string | null
  stats:
    | {
        points: number
        total_games: number
        wins: number
        p2: number
        p3: number
        p4: number
        winRate: number
        recentGames: { placement: number; played_at: string }[]
      }
    | null
  unlockedTitles: { title_id: string; name: string; description: string }[]
  allTitles: { id: string; name: string; description: string }[]
}

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at, active_title_id')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

async function fetchLeaderboardEntry(userId: string) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

async function fetchGameResults(userId: string) {
  const { data, error } = await supabase
    .from('game_results')
    .select('placement, played_at')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

async function fetchUnlockedTitles(userId: string) {
  const { data, error } = await supabase
    .from('unlocked_titles')
    .select('title_id, name, description')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

async function fetchAllTitles() {
  const { data, error } = await supabase.from('titles').select('id, name, description')

  if (error) throw error
  return data
}

export function usePublicProfile(userId?: string | null) {
  return useQuery({
    queryKey: ['public-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('userId requis')

      const [profile, entry, results, unlockedTitles, allTitles] = await Promise.all([
        fetchProfile(userId),
        fetchLeaderboardEntry(userId),
        fetchGameResults(userId),
        fetchUnlockedTitles(userId),
        fetchAllTitles(),
      ])

      const stats =
        entry == null
          ? null
          : {
              points: entry.points ?? 0,
              total_games: entry.total_games ?? 0,
              wins: entry.wins ?? 0,
              p2: entry.p2 ?? 0,
              p3: entry.p3 ?? 0,
              p4: entry.p4 ?? 0,
              winRate:
                entry.total_games > 0
                  ? Math.round((entry.wins / entry.total_games) * 100)
                  : 0,
              recentGames: (results ?? []).sort(
                (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
              ),
            }

      return {
        user_id: profile?.id ?? userId,
        username: profile?.username ?? '',
        avatar_url: profile?.avatar_url ?? null,
        created_at: profile?.created_at ?? null,
        active_title_id: profile?.active_title_id ?? null,
        stats,
        unlockedTitles: unlockedTitles ?? [],
        allTitles: allTitles ?? [],
      } as PublicProfile
    },
    enabled: !!userId,
  })
}
