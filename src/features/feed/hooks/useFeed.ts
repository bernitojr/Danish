import { supabase } from '@/lib/supabase'
import type { FeedPost } from '../utils/types'
import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'sonner'

const PAGE_SIZE = 5

async function fetchFeedPage(from: number) {
  const { data, error } = await supabase
    .from('feed_posts')
    .select(
      `
      id,
      content,
      created_at,
      is_pinned,
      author:profiles(id, username, avatar_url),
      likes:feed_post_likes(id, user_id),
      comments:feed_comments(id),
        images:feed_post_images(id, url, position)
    `
    )
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  if (error) throw error
  return data as unknown as FeedPost[]
}
export function useFeed() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [from, setFrom] = useState(0)

  async function loadInitial() {
    setIsLoading(true)
    try {
      const data = await fetchFeedPage(0)
      setPosts(data)
      setHasMore(data.length === PAGE_SIZE)
      setFrom(PAGE_SIZE)
    } catch (err) {
      console.error('useFeed: loadInitial error', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchFeedPage(from)
      setPosts((prev) => [...prev, ...data])
      setHasMore(data.length === PAGE_SIZE)
      setFrom((prev) => prev + PAGE_SIZE)
    } catch (err) {
      console.error('useFeed: loadMore error', err)
    } finally {
      setIsLoading(false)
    }
  }, [from])

  // Chargement initial
  useEffect(() => {
    if (!user) return
    loadInitial()
  }, [user])

  // Realtime
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('feed_posts_realtime')

      // nouveau post → l'ajouter en haut du feed
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feed_posts' },
        async (payload) => {
          const { data, error } = await supabase
            .from('feed_posts')
            .select(
              `
          id,
          content,
          created_at,
          is_pinned,
          author:profiles(id, username, avatar_url),
          likes:feed_post_likes(id, user_id),
          comments:feed_comments(id),
          images:feed_post_images(id, url, position)
        `
            )
            .eq('id', payload.new.id)
            .single()

          if (error) toast.error('Erreur lors de la création du post')
          console.error('useFeed realtime post: fetch post error', error)
          if (data) {
            setPosts((prev) => {
              const newPost = data as unknown as FeedPost
              const pinned = prev.filter((p) => p.is_pinned)
              const unpinned = prev.filter((p) => !p.is_pinned)
              return [...pinned, newPost, ...unpinned]
            })
          }
        }
      )

      // nouvelle image → mettre à jour le post concerné
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feed_post_images' },
        async (payload) => {
          const postId = payload.new.post_id

          const { data, error } = await supabase
            .from('feed_posts')
            .select(
              `
          id,
          content,
          created_at,
          is_pinned,
          author:profiles(id, username, avatar_url),
          likes:feed_post_likes(id, user_id),
          comments:feed_comments(id),
          images:feed_post_images(id, url, position)
        `
            )
            .eq('id', postId)
            .single()

          if (error) toast.error("Erreur lors de l'ajout d'une image au post")
          console.error('useFeed realtime image: fetch post error', error)
          if (data) {
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId ? (data as unknown as FeedPost) : p
              )
            )
          }
        }
      )

      // post supprimé → le retirer du feed
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'feed_posts' },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id))
        }
      )

      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return { posts, isLoading, hasMore, loadMore, setPosts }
}
