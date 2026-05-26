import { supabase } from '@/lib/supabase'
import type { FeedComment } from '../utils/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

async function fetchPostComments(postId: string) {
  const { data, error } = await supabase
    .from('feed_comments')
    .select(
      `
      id,
      content,
      created_at,
      author:profiles(id, username, avatar_url),
      likes:feed_comment_likes(id, user_id)
    `
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as unknown as FeedComment[]
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<FeedComment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function postComment(content: string, authorId: string) {
    const { error } = await supabase
      .from('feed_comments')
      .insert({ post_id: postId, author_id: authorId, content })
    if (error) {
      console.error('useComments: postComment error', error)
      toast.error("Erreur lors de l'envoi du commentaire")
    }
  }

  async function editComment(comment: FeedComment, newContent: string) {
    // optimistic update
    setComments((prev) =>
      prev.map((c) => (c.id === comment.id ? { ...c, content: newContent } : c))
    )

    function rollback() {
      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? comment : c))
      )
    }

    const { error } = await supabase
      .from('feed_comments')
      .update({ content: newContent })
      .eq('id', comment.id)

    if (error) {
      console.error('useComments: editComment error', error)
      toast.error('Erreur lors de la modification')
      rollback()
      return
    }

    toast.success('Commentaire modifié')
  }

  async function deleteComment(commentId: string) {
    // optimistic update
    setComments((prev) => prev.filter((c) => c.id !== commentId))

    const { error } = await supabase
      .from('feed_comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('useComments: deleteComment error', error)
      toast.error('Erreur lors de la suppression')
      // rollback — refetch
      fetchPostComments(postId).then(setComments)
      return
    }

    toast.success('Commentaire supprimé')
  }

  async function toggleCommentLike(
    comment: FeedComment,
    currentUserId: string
  ) {
    const existingLike = comment.likes.find((l) => l.user_id === currentUserId)

    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== comment.id) return c
        if (existingLike) {
          return {
            ...c,
            likes: c.likes.filter((l) => l.id !== existingLike.id),
          }
        } else {
          return {
            ...c,
            likes: [...c.likes, { id: 'temp', user_id: currentUserId }],
          }
        }
      })
    )

    function rollback() {
      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? comment : c))
      )
    }

    if (existingLike) {
      const { error } = await supabase
        .from('feed_comment_likes')
        .delete()
        .eq('id', existingLike.id)
      if (error) rollback()
    } else {
      const { error } = await supabase
        .from('feed_comment_likes')
        .insert({ comment_id: comment.id, user_id: currentUserId })
      if (error) rollback()
    }
  }

  useEffect(() => {
    fetchPostComments(postId)
      .then((data) => {
        setComments(data)
        setIsLoading(false)
      })
      .catch((err) => console.error('useComments: fetch error', err))

    const channel = supabase
      .channel(`feed_comments_realtime_${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feed_comments',
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from('feed_comments')
            .select(
              `
              id,
              content,
              created_at,
              author:profiles(id, username, avatar_url),
              likes:feed_comment_likes(id, user_id)
            `
            )
            .eq('id', payload.new.id)
            .single()

          if (data)
            setComments((prev) => [...prev, data as unknown as FeedComment])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'feed_comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prev) => prev.filter((c) => c.id !== payload.old.id))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'feed_comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prev) =>
            prev.map((c) =>
              c.id === payload.new.id
                ? { ...c, content: payload.new.content }
                : c
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId])

  return {
    comments,
    isLoading,
    postComment,
    editComment,
    deleteComment,
    toggleCommentLike,
  }
}
