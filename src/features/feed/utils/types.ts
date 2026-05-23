export interface FeedAuthor {
  id: string
  username: string
  avatar_url: string | null
}

export interface FeedLike {
  id: string
  user_id: string
}

export interface FeedComment {
  id: string
  post_id: string
  content: string
  created_at: string
  author: FeedAuthor
  likes: FeedLike[]
}

export interface FeedPost {
  id: string
  content: string
  created_at: string
  author: FeedAuthor
  likes: FeedLike[]
  comments: FeedComment[]
}

export interface FeedState {
  posts: FeedPost[]
  isLoading: boolean
  hasMore: boolean
  page: number
}