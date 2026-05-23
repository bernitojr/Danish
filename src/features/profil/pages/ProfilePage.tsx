import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAuth } from '@/hooks/useAuth'
import { useProfileStats } from '../hooks/useProfileStats'
import { supabase } from '@/lib/supabase'
import { ChangePasswordModal } from '../components/ChangePasswordModal'
import { ProfileIdentityCard } from '../components/ProfileIdentityCard'
import { ProfileSettingsCard } from '../components/ProfileSettingsCard'
import { PerformancesCard } from '../components/PerformancesCard'

export function ProfilePage() {
  const { profile, user, setProfile } = useAuthStore()
  const { data, isLoading, error } = useProfileStats()
  const { signOut } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) return
    const timer = setTimeout(() => setShowLoading(true), 300)
    return () => clearTimeout(timer)
  }, [isLoading])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleTitleChange = async (titleId: string | null) => {
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ active_title_id: titleId })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile title update failed:', updateError)
      return
    }

    if (profile) {
      setProfile({ ...profile, active_title_id: titleId })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      console.error('Avatar upload failed:', uploadError)
      return
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    const publicUrl = urlData.publicUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update failed:', updateError)
      return
    }

    if (profile) {
      setProfile({ ...profile, avatar_url: publicUrl })
    }
  }
  if (isLoading) {
    return showLoading ? (
      <div className="flex items-center justify-center h-full text-[hsl(var(--foreground-muted))]">
        Chargement…
      </div>
    ) : null
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-[hsl(var(--delete))]">
        Erreur : {error.message}
      </div>
    )
  }

  const total = data?.totalGames ?? 0

  return (
    <div className="max-w-[1280px] mx-auto px-8 relative z-[2] w-full">
      {/* Hidden file input — triggered by avatar click or settings row */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-[380px_1fr] gap-6 pb-20 items-start mt-[5vh] max-md:grid-cols-1">
        {/* ── LEFT COLUMN ── */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden self-start max-md:max-w-[480px] max-md:w-full">
          <ProfileIdentityCard
            username={profile?.username ?? '—'}
            avatarUrl={profile?.avatar_url ?? null}
            createdAt={profile?.created_at ?? ''}
            points={data?.points ?? 0}
            activeTitle={profile?.active_title_id ?? null}
            unlockedTitles={data?.unlockedTitles ?? []}
            onAvatarClick={handleAvatarClick}
            onTitleChange={handleTitleChange}
            allTitles={data?.allTitles ?? []}
          />
          <div className="border-t border-[hsl(var(--border))]">
            <ProfileSettingsCard
              onAvatarClick={handleAvatarClick}
              onPasswordClick={() => setIsModalPasswordOpen(true)}
              onSignOutClick={signOut}
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4">
          <PerformancesCard
            // placements={placements}
            total={total}
            recentGames={data?.recentGames ?? []}
            totalGames={total}
            p1={data?.placements[1] ?? 0}
            p2={data?.placements[2] ?? 0}
            p3={data?.placements[3] ?? 0}
            p4={data?.placements[4] ?? 0}
          />
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isModalPasswordOpen}
        onClose={() => setIsModalPasswordOpen(false)}
      />
    </div>
  )
}
