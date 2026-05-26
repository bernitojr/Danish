import { useState } from 'react'
import { useComments } from '../hooks/useComments'
import { Send } from 'lucide-react'
import { CommentCard } from './CommentCard'

interface CommentSectionProps {
  postId: string
  currentUserId: string
  isAdmin: boolean
}

export const CommentSection = ({
  postId,
  currentUserId,
  isAdmin,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('')
  const {
    comments,
    isLoading,
    postComment,
    toggleCommentLike,
    editComment,
    deleteComment,
  } = useComments(postId)

  return (
    <div className="px-5 pb-4">
      {/* état loading */}
      {isLoading && (
        <p className="text-[0.75rem] text-[hsl(var(--foreground-muted))] py-2">
          Chargement...
        </p>
      )}

      {/* état vide */}
      {!isLoading && comments.length === 0 && (
        <p className="text-[0.75rem] text-[hsl(var(--foreground-muted))] py-2">
          Aucun commentaire. Soyez le premier !
        </p>
      )}

      {/* liste des commentaires */}
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onToggleLike={toggleCommentLike}
          onEdit={editComment}
          onDelete={deleteComment}
        />
      ))}

      {/* formulaire nouveau commentaire */}
      <div className="flex items-center gap-2 mt-3">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!newComment.trim()) return
              postComment(newComment, currentUserId)
              setNewComment('')
            }
          }}
          placeholder="Écrire un commentaire..."
          className="flex-1 bg-[hsl(var(--background-dark))] border border-[hsl(var(--border))] rounded-full py-2 px-4 font-sans text-[0.8rem] text-[hsl(var(--foreground))] outline-none transition-colors focus:border-[hsl(var(--primary)/0.5)]"
        />
        <button
          onClick={() => {
            if (!newComment.trim()) return
            postComment(newComment, currentUserId)
            setNewComment('')
          }}
          className="w-[34px] h-[34px] bg-[hsl(var(--primary))] rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer border-none transition-opacity disabled:opacity-40"
          disabled={!newComment.trim()}
        >
          <Send className="w-[14px] h-[14px]" />
        </button>
      </div>
    </div>
  )
}
