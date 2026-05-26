import { useState } from 'react'
import type { FeedPost } from '../utils/types'
import { MessageCircle, Pin, ThumbsUp, X } from 'lucide-react'
import { AuthorChip } from './AuthorChip'
import { CommentSection } from './CommentSection'

interface PostCardProps {
  post: FeedPost
  currentUserId: string
  isAdmin: boolean
  onToggleLike: (post: FeedPost, currentUserId: string) => void
  onDelete: (postId: string) => void
  onTogglePin: (post: FeedPost) => void
}

export const PostCard = ({
  post,
  currentUserId,
  isAdmin,
  onToggleLike,
  onDelete,
  onTogglePin,
}: PostCardProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(post.comments.length > 0) // ouvrir automatiquement si il y a déjà des commentaires
  const isLiked = post.likes.some((l) => l.user_id === currentUserId)
  const likeCount = post.likes.length
  const commentCount = post.comments.length

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.4)] rounded-[var(--radius)] overflow-hidden transition-colors">
      {/* pinned banner — conditionnel */}
      {post.is_pinned && (
        <div className="bg-[hsl(var(--gold)/0.08)] border-b border-b-[hsl(var(--gold)/0.2)] py-2 px-5 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[hsl(var(--gold))]">
          <Pin className="w-[12px] h-[12px]" />
          Épinglé par l'admin
        </div>
      )}

      {/* post header */}
      <div className="flex items-center justify-between gap-3 pt-[1.1rem] px-5 pb-2">
        <div className="flex items-center gap-3">
          <AuthorChip
            author={post.author}
            role={post.author.role}
            createdAt={post.created_at}
            size="md"
          />
        </div>

        {/* admin actions */}
        {isAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            {/* épingler */}
            <button
              onClick={() => onTogglePin(post)}
              className={`w-[28px] h-[28px] rounded-[calc(var(--radius)-2px)] border flex items-center justify-center transition-colors ${
                post.is_pinned
                  ? 'border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.08)]'
                  : 'border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))] hover:border-[hsl(var(--gold)/0.4)] hover:text-[hsl(var(--gold))]'
              }`}
              title={post.is_pinned ? 'Désépingler' : 'Épingler'}
            >
              <Pin className="w-[12px] h-[12px]" />
            </button>

            {/* supprimer */}
            <button
              onClick={() => {
                if (window.confirm('Supprimer cette publication ?')) {
                  onDelete(post.id)
                }
              }}
              className="w-[28px] h-[28px] rounded-[calc(var(--radius)-2px)] border border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))] flex items-center justify-center transition-colors hover:border-[hsl(var(--delete)/0.4)] hover:text-[hsl(var(--delete))]"
              title="Supprimer"
            >
              <X className="w-[12px] h-[12px]" />
            </button>
          </div>
        )}
      </div>

      {/* post body */}
      <div className="pt-1 px-5 pb-4 text-[0.9rem] text-[hsl(var(--foreground-secondary))] leading-[1.6] whitespace-pre-wrap break-words">
        <p>{post.content}</p>
      </div>
      {/* images */}
      {post.images && post.images.length > 0 && (
        <div
          className={`px-5 pb-4 grid gap-2 ${
            post.images.length === 1
              ? 'grid-cols-1'
              : post.images.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-2'
          }`}
        >
          {post.images
            .sort((a, b) => a.position - b.position)
            .map((image, index) => (
              <div
                key={image.id}
                className={`overflow-hidden rounded-[calc(var(--radius)-2px)] ${
                  post.images.length === 3 && index === 0 ? 'col-span-2' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={`image-${index}`}
                  className="w-full h-full object-cover max-h-[320px]"
                />
              </div>
            ))}
        </div>
      )}

      {/* reaction strip */}
      <div className="flex items-center justify-between flex-wrap gap-2 py-[0.6rem] px-5 border-t border-b border-[hsl(var(--border)/0.4)] text-[0.78rem] text-[hsl(var(--foreground-muted))]">
        <div className="flex items-center gap-[0.4rem]">
          <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
            <ThumbsUp className="w-[16px] h-[16px]" />
          </span>
          <span>{likeCount}</span>
        </div>

        <div className="flex items-center gap-[0.4rem]">
          <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
            <MessageCircle className="w-[16px] h-[16px]" />
          </span>
          <span>{commentCount}</span>
        </div>
      </div>

      {/* post actions */}
      <div className="flex gap-1 py-[0.4rem] px-[0.6rem]">
        <button
          className={`flex-1 flex items-center justify-center gap-[0.45rem] bg-transparent border-none py-[0.6rem] px-[0.5rem] rounded-[calc(var(--radius)-4px)] font-sans text-[0.8rem] font-medium cursor-pointer transition-colors ${
            isLiked
              ? 'text-[hsl(var(--primary))]'
              : 'text-[hsl(var(--foreground-muted))]'
          }`}
          onClick={() => onToggleLike(post, currentUserId)}
        >
          <ThumbsUp className="w-[16px] h-[16px]" />
          Like
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-[0.45rem] bg-transparent border-none py-[0.6rem] px-[0.5rem] rounded-[calc(var(--radius)-4px)] font-sans text-[0.8rem] font-medium text-[hsl(var(--foreground-muted))] cursor-pointer transition-colors"
          onClick={() => setIsCommentOpen((prev) => !prev)}
        >
          <MessageCircle className="w-[16px] h-[16px]" />
          Comment
        </button>
      </div>
      {/* comment section */}
      {isCommentOpen && (
        <div className="border-t border-[hsl(var(--border)/0.4)] pt-[0.875rem] px-5 pb-4">
          {/* <CommentSection postId={post.id} /> — on branchera ici */}
          <CommentSection
            postId={post.id}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        </div>
      )}
    </div>
  )
}
