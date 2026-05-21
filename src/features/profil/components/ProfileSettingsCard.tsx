import { useAuth } from '@/hooks/useAuth'

interface ProfileSettingsCardProps {
  onAvatarClick: () => void
  onPasswordClick: () => void
}

export function ProfileSettingsCard({ onAvatarClick, onPasswordClick }: ProfileSettingsCardProps) {
  const { signOut } = useAuth()

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden">
      {/* ... le JSX de la settings card ... */}
    </div>
  )
}