import { supabase } from '@/lib/supabase'
import type { FeedPost } from '../utils/types'
import { useCallback, useEffect, useState } from 'react'

const PAGE_SIZE = 5

async function fetchFeedPage(from: number) {
  const { data, error } = await supabase
    .from('feed_posts')
    .select(
      `
  id,
  content,
  created_at,
  author:profiles(id, username, avatar_url),
  likes:feed_post_likes(id, user_id),
  comments:feed_comments(id)
  `
    )
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  if (error) throw error
  return data as unknown as FeedPost[]
}

export function useFeed() {
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
      console.error('useFeed : loadMore error', err)
    } finally {
      setIsLoading(false)
    }
  }, [from])

  useEffect(() => {
    loadInitial()
    const channel = supabase
      .channel('feed_posts_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feed_posts' },
        async (payload) => {
          const { data } = await supabase
            .from('feed_posts')
            .select(
              `
                id,
                content,
                created_at,
                author:profiles(id, username, avatar_url),
                likes:feed_post_likes(id, user_id),
                comments:feed_comments(id)
                `
            )
            .eq('id', payload.new.id)
            .single()

          if (data) setPosts((prev) => [data as unknown as FeedPost, ...prev])
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  return { posts, isLoading, hasMore, loadMore }
}
