import { supabase } from '@/lib/supabase'
import type { FeedPost } from '../utils/types'
import { toast } from 'sonner'

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
        .from('feed_post_likes')
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

    if (error) {
      console.error('usePostActions: createPost error', error)
      toast.error('Erreur lors de la publication')
      return
    }

    toast.success('Publication envoyée')
  }

  async function deletePost(postId: string) {
    const { error } = await supabase
      .from('feed_posts')
      .delete()
      .eq('id', postId)

    if (error) {
      console.error('usePostActions: deletePost error', error)
      toast.error('Erreur lors de la suppression')
      return
    }

    setPosts((prev) => prev.filter((p) => p.id !== postId))
    toast.success('Publication supprimée')
  }

  async function togglePin(post: FeedPost) {
    const { error } = await supabase
      .from('feed_posts')
      .update({ is_pinned: !post.is_pinned })
      .eq('id', post.id)

    if (error) {
      console.error('usePostActions: togglePin error', error)
      toast.error("Erreur lors de l'épinglage")
      return
    }

    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === post.id) return { ...p, is_pinned: !post.is_pinned }
        return { ...p, is_pinned: false }
      })

      return [
        ...updated.filter((p) => p.is_pinned),
        ...updated.filter((p) => !p.is_pinned),
      ]
    })
    toast.success(
      post.is_pinned ? 'Publication désépinglée' : 'Publication épinglée'
    )
  }
  return { toggleLike, createPost, deletePost, togglePin }
}
