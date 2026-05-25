import type { FeedComment } from '../utils/types'
import { Heart } from 'lucide-react'
import { AuthorChip } from './AuthorChip'

interface CommentCardProps {
  comment: FeedComment
  currentUserId: string
  onToggleLike: (comment: FeedComment, currentUserId: string) => void
}

export const CommentCard = ({
  comment,
  currentUserId,
  onToggleLike,
}: CommentCardProps) => {
  const isLiked = comment.likes.some((l) => l.user_id === currentUserId)
  const likeCount = comment.likes.length

  return (
    <div className="flex gap-[0.625rem] py-2">
      {/* author chip size sm */}
      <div className="shrink-0 mt-[2px]">
        <AuthorChip
          author={comment.author}
          role={comment.author.role}
          createdAt={comment.created_at}
          size="sm"
        />
      </div>

      {/* comment bubble */}
      <div className="flex-1 min-w-0">
        <div className="bg-[hsl(var(--background-dark))] border border-[hsl(var(--border)/0.5)] rounded-[14px] py-2 px-3">
          <div className="text-[0.76rem] font-semibold text-[hsl(var(--foreground))] mb-[0.1rem]">
            {comment.author.username}
          </div>
          <div className="text-[0.82rem] text-[hsl(var(--foreground-secondary))] leading-[1.4]">
            {comment.content}
          </div>
        </div>

        {/* comment actions */}
        <div className="mt-1 px-3 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[hsl(var(--foreground-muted))]">
          <button
            onClick={() => onToggleLike(comment, currentUserId)}
            className={`flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
              isLiked
                ? 'text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--foreground-muted))]'
            }`}
          >
            <Heart className="w-[14px] h-[14px]" />
            {likeCount > 0 && <span>{likeCount}</span>}
            Like
          </button>
        </div>
      </div>
    </div>
  )
}
