import type { FeedComment } from '../utils/types'
import { Heart, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatRelativeDate } from '../utils/dateUtils'

interface CommentCardProps {
  comment: FeedComment
  currentUserId: string
  isAdmin: boolean
  onToggleLike: (comment: FeedComment, currentUserId: string) => void
  onEdit: (comment: FeedComment, newContent: string) => void
  onDelete: (commentId: string) => void
}

export const CommentCard = ({
  comment,
  currentUserId,
  isAdmin,
  onToggleLike,
  onEdit,
  onDelete,
}: CommentCardProps) => {
  const isLiked = comment.likes.some((l) => l.user_id === currentUserId)
  const likeCount = comment.likes.length
  const isOwner = comment.author.id === currentUserId
  const canEdit = isOwner
  const canDelete = isOwner || isAdmin

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [likeAnimating, setLikeAnimating] = useState(false)

  function handleCommentLike() {
    onToggleLike(comment, currentUserId)
    if (!isLiked) {
      setLikeAnimating(true)
      setTimeout(() => setLikeAnimating(false), 600)
    }
  }

  function handleEdit() {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false)
      return
    }
    onEdit(comment, editContent.trim())
    setIsEditing(false)
  }

  return (
    <div className="flex gap-3 py-2">
      {/* avatar */}
      <div className="w-[32px] h-[32px] rounded-full shrink-0 overflow-hidden bg-[linear-gradient(135deg,hsl(var(--primary)/0.3),hsl(var(--accent)/0.2))] border-[1.5px] border-[hsl(var(--primary)/0.4)] flex items-center justify-center font-display font-extrabold text-[0.65rem] text-[hsl(var(--primary))]">
        {comment.author.avatar_url ? (
          <img
            src={comment.author.avatar_url}
            alt={comment.author.username}
            className="w-full h-full object-cover"
          />
        ) : (
          comment.author.username.slice(0, 2).toUpperCase()
        )}
      </div>

      {/* contenu */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          /* mode édition */
          <div className="flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleEdit()
                }
                if (e.key === 'Escape') {
                  setEditContent(comment.content)
                  setIsEditing(false)
                }
              }}
              autoFocus
              className="w-full bg-[hsl(var(--background-dark))] border border-[hsl(var(--primary)/0.4)] rounded-[var(--radius)] py-2 px-3 font-sans text-[0.82rem] text-[hsl(var(--foreground))] outline-none resize-none leading-[1.5]"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="font-display text-[0.58rem] uppercase tracking-[0.08em] text-[hsl(var(--primary))] bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
              >
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setEditContent(comment.content)
                  setIsEditing(false)
                }}
                className="font-display text-[0.58rem] uppercase tracking-[0.08em] text-[hsl(var(--foreground-muted))] bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          /* mode lecture */
          <>
            <div className="flex justify-between items-start gap-2">
              <p className="text-[0.82rem] text-[hsl(var(--foreground-secondary))] leading-[1.5] flex-1">
                <span className="font-semibold text-[hsl(var(--foreground))] mr-1 cursor-pointer hover:underline">
                  {comment.author.username}
                </span>
                {comment.content}
              </p>

              {/* icones à droite */}
              <div className="flex items-center gap-1 shrink-0">
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 bg-transparent border-none cursor-pointer text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    <Pencil className="w-[11px] h-[11px]" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Supprimer ce commentaire ?')) {
                        onDelete(comment.id)
                      }
                    }}
                    className="p-1 bg-transparent border-none cursor-pointer text-[hsl(var(--foreground-muted))] hover:text-[hsl(var(--delete))] transition-colors"
                  >
                    <Trash2 className="w-[11px] h-[11px]" />
                  </button>
                )}
                <button
                  onClick={handleCommentLike}
                  className={`p-1 rounded-full bg-transparent border-none cursor-pointer transition-colors ${
                    isLiked
                      ? 'text-[hsl(var(--delete))]'
                      : 'text-[hsl(var(--foreground-muted))]'
                  } ${likeAnimating ? 'like-bg-flash' : ''}`}
                >
                  <Heart
                    className={`w-[12px] h-[12px] ${isLiked ? 'fill-current' : ''} ${likeAnimating ? 'like-pop' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* infos sous le commentaire */}
            <div className="flex items-center gap-3 mt-[0.25rem]">
              <span className="font-display text-[0.58rem] text-[hsl(var(--foreground-muted))] uppercase tracking-[0.08em]">
                {formatRelativeDate(comment.created_at)}
              </span>
              {likeCount > 0 && (
                <span className="font-display text-[0.58rem] text-[hsl(var(--foreground-muted))] uppercase tracking-[0.08em]">
                  {likeCount} j'aime
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
