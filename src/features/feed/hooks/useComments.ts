import { supabase } from '@/lib/supabase'
import type { FeedComment } from '../utils/types'
import { useEffect, useState } from 'react'

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

  // poster un commentaire
  async function postComment(content: string, authorId: string) {
    const { error } = await supabase
      .from('feed_comments')
      .insert({ post_id: postId, author_id: authorId, content })
    if (error) console.error('useComments: postComment error', error)
  }
  // liker un commentaire
  async function toggleCommentLike(
    comment: FeedComment,
    currentUserId: string
  ) {
    // 1. est ce que j'ai déjà liké ce commentaire?
    const existingLike = comment.likes.find((l) => l.user_id === currentUserId)
    // 2. Optimiste update
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
    // 3. rollback si erreur
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
  // fetch initial + realtime
  useEffect(() => {
    fetchPostComments(postId)
      .then((data) => {
        setComments(data)
        setIsLoading(false)
      })
      .catch((err) => console.error('useComments: fetch error', err))
    const channel = supabase
      .channel('feed_comments_realtime')
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
              ` id,
      content,
      created_at,
      author:profiles(id, username, avatar_url),
      likes:feed_comment_likes(id, user_id)
                `
            )
            .eq('id', payload.new.id)
            .single()

          if (data)
            setComments((prev) => [data as unknown as FeedComment, ...prev])
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId])

  return { comments, isLoading, postComment, toggleCommentLike }
}
