import { useParams } from 'react-router-dom'
import { usePublicProfile } from '../hooks/usePublicProfile'
import { ProfileIdentityCard } from '../components/ProfileIdentityCard'
import { PerformancesCard } from '../components/PerformancesCard'

export function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { data, isLoading, error } = usePublicProfile(userId)

  if (isLoading) return null
  if (error) return <div>Erreur : {error.message}</div>
  if (!data) return <div>Profil introuvable</div>

  return (
    <div className="max-w-[1280px] mx-auto px-8 relative z-[2] w-full">
      <div className="grid grid-cols-[380px_1fr] gap-6 pb-20 items-start mt-[5vh] max-md:grid-cols-1">
        {/* LEFT COLUMN */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden self-start max-md:max-w-[480px] max-md:w-full">
          <ProfileIdentityCard
            username={data.username}
            avatarUrl={data.avatar_url}
            createdAt={data.created_at ?? ''}
            points={data.stats?.points ?? 0}
            activeTitle={data.active_title_id}
            unlockedTitles={data.unlockedTitles}
            allTitles={data.allTitles}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          <PerformancesCard
            p1={data.stats?.wins ?? 0}
            p2={data.stats?.p2 ?? 0}
            p3={data.stats?.p3 ?? 0}
            p4={data.stats?.p4 ?? 0}
            total={data.stats?.total_games ?? 0}
            recentGames={data.stats?.recentGames ?? []}
            totalGames={data.stats?.total_games ?? 0}
          />
        </div>
      </div>
    </div>
  )
}
