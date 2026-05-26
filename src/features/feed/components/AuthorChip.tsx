import { useAuthStore } from '@/stores/useAuthStore'
import type { FeedAuthor } from '../utils/types'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { formatRelativeDate } from '../utils/dateUtils'

interface AuthorChipProps {
  author: FeedAuthor
  role?: string
  createdAt: string
  size?: 'sm' | 'md' // sm pour les commentaires, md pour les posts
}

export const AuthorChip = ({
  author,
  role,
  createdAt,
  size = 'md',
}: AuthorChipProps) => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const isCurrentUser = user?.id === author.id

  const handleAuthorClick = () => {
    if (isCurrentUser) {
      navigate('/profile')
    } else {
      navigate(`/profile/${author.id}`)
    }
  }

  const initials = author.username.slice(0, 2).toUpperCase()

  return (
    <>
      {/* avatar */}
      <div
        className={`
          ${size === 'md' ? 'w-[42px] h-[42px] text-[0.82rem]' : 'w-[30px] h-[30px] text-[0.65rem]'}
          rounded-full
          bg-[linear-gradient(135deg,hsl(var(--primary)/0.3),hsl(var(--accent)/0.2))]
          border-[1.5px]
          border-[hsl(var(--primary)/0.4)]
          flex items-center justify-center
          font-display font-extrabold
          text-[hsl(var(--primary))]
          shrink-0
          overflow-hidden
        `}
      >
        {author.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={author.username}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* bloc texte */}
      <div className="flex flex-col min-w-0">
        {/* nom + badge */}
        <div className="flex items-center gap-2">
          <span
            onClick={handleAuthorClick}
            className="font-semibold text-[0.9rem] text-[hsl(var(--foreground))] cursor-pointer hover:text-[hsl(var(--primary))] transition-colors"
          >
            {author.username}
          </span>
          {role === 'admin' && (
            <span className="inline-flex items-center gap-1 bg-[hsl(var(--gold)/0.12)] border border-[hsl(var(--gold)/0.3)] text-[hsl(var(--gold))] font-mono text-[0.55rem] uppercase tracking-[0.12em] py-[0.12rem] px-[0.45rem] rounded-full font-semibold">
              <Star className="w-[9px] h-[9px]" />
              Admin
            </span>
          )}
        </div>

        {/* date */}
        <span className="font-mono text-[0.62rem] text-[hsl(var(--foreground-muted))] uppercase tracking-[0.1em]">
          {formatRelativeDate(createdAt)}
        </span>
      </div>
    </>
  )
}
