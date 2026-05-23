import { supabase } from '@/lib/supabase'
import type { FeedPost } from '../utils/types'

export function usePostActions(
  setPosts: React.Dispatch<React.SetStateAction<FeedPost[]>>
) {
  async function toggleLike(post: FeedPost, currentUserId: string) {
    // 1. chercher si like existe déjà
    const existingLike = post.likes.find(
      (like) => like.user_id === currentUserId
    )
    // 2. optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== post.id) return p
        if (existingLike) {
          return {
            ...p,
            likes: p.likes.filter((l) => l.id !== existingLike.id),
          }
        } else {
          return {
            ...p,
            likes: [...p.likes, { id: 'temp', user_id: currentUserId }],
          }
        }
      })
    )

    // rollback si erreur
    function rollback() {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)))
    }

    // 3. requête Supabase INSERT ou DELETE
    if (existingLike) {
      const { error } = await supabase
        .from('feed_posts_likes')
        .delete()
        .eq('id', existingLike.id)
      if (error) rollback()
    } else {
      const { error } = await supabase
        .from('feed_post_likes')
        .insert({ post_id: post.id, user_id: currentUserId })
      if (error) rollback()
    }
  }

  async function createPost(content: string, authorId: string) {
    const { error } = await supabase
      .from('feed_posts')
      .insert({ content, author_id: authorId })
    if (error) console.error('usePostActop,s = createPost error', error)
  }

  return { toggleLike, createPost }
}
