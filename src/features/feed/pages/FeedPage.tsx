import { useState } from 'react'
import { Images, Send, Star, X } from 'lucide-react'
import { useFeed } from '../hooks/useFeed'
import { usePostActions } from '../hooks/usePostActions'
import { useAuthStore } from '@/stores/useAuthStore'
import { PostCard } from '../components/PostCard'
import { useImageUpload } from '../hooks/useImageUpload'

export function FeedPage() {
  const { posts, isLoading, hasMore, loadMore, setPosts } = useFeed()
  const { previews, isUploading, addImages, removeImage, reset, uploadImages } =
    useImageUpload()
  const { toggleLike, createPost, deletePost, togglePin } =
    usePostActions(setPosts)
  const { user, profile } = useAuthStore()
  const isAdmin = profile?.role === 'admin'
  const [composerContent, setComposerContent] = useState('')

  return (
    <div className="max-w-[1280px] mx-auto px-8 relative z-[2] w-full">
      {/* header */}
      <div className="pt-[3.5rem] pb-8 flex items-end justify-between gap-8 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.04em] leading-[1]">
            Feed
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-full px-[0.95rem] py-[0.45rem] font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[hsl(var(--foreground-muted))]">
          <span className="w-[6px] h-[6px] rounded-full bg-[hsl(var(--accent))]" />
          <strong className="text-[hsl(var(--foreground))]">
            {posts.length}
          </strong>{' '}
          publications
        </div>
      </div>

      {/* feed layout */}
      <div className="flex flex-col gap-6 pb-20 max-w-[640px] mx-auto">
        <div className="flex flex-col gap-4 min-w-0">
          {/* admin composer */}
          {isAdmin && (
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] p-5 relative overflow-hidden">
              {/* composer head */}
              <div className="flex items-center gap-3 mb-[0.875rem]">
                <div className="w-[38px] h-[38px] rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)/0.3),hsl(var(--accent)/0.2))] border-[1.5px] border-[hsl(var(--primary)/0.4)] flex items-center justify-center font-display font-extrabold text-[0.78rem] text-[hsl(var(--primary))] shrink-0 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (profile?.username?.slice(0, 2).toUpperCase() ?? 'AD')
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[hsl(var(--foreground))]">
                    {profile?.username ?? 'Admin'}
                    <span className="inline-flex items-center gap-1 bg-[hsl(var(--gold)/0.12)] border border-[hsl(var(--gold)/0.3)] text-[hsl(var(--gold))] font-mono text-[0.55rem] uppercase tracking-[0.12em] py-[0.12rem] px-[0.45rem] rounded-full font-semibold">
                      <Star className="w-[9px] h-[9px]" />
                      Admin
                    </span>
                  </div>
                  <div className="font-mono text-[0.62rem] text-[hsl(var(--foreground-muted))] uppercase tracking-[0.1em] mt-[0.1rem]">
                    Nouvelle publication
                  </div>
                </div>
              </div>

              {/* composer textarea */}
              <textarea
                value={composerContent}
                onChange={(e) => setComposerContent(e.target.value)}
                placeholder="Adressez un message à la commu DWC"
                className="resize-none w-full bg-[hsl(var(--background-dark))] border border-[hsl(var(--border))] rounded-[var(--radius)] py-3 px-[0.875rem] font-sans text-sm text-[hsl(var(--foreground))] min-h-[80px] outline-none transition-colors leading-[1.5]"
              />

              {/* preview images */}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.previewUrl}
                        alt={`preview-${index}`}
                        className="w-[80px] h-[80px] object-cover rounded-[calc(var(--radius)-2px)] border border-[hsl(var(--border))]"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[hsl(var(--delete))] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"
                      >
                        <X className="w-[10px] h-[10px] text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* composer actions */}
              <div className="flex items-center justify-between mt-[0.875rem] gap-2 flex-wrap">
                <div className="flex gap-[0.3rem]">
                  <button
                    onClick={() =>
                      document.getElementById('image-input')?.click()
                    }
                    className="w-[32px] h-[32px] rounded-[calc(var(--radius)-2px)] border border-[hsl(var(--border))] bg-transparent cursor-pointer flex items-center justify-center text-[hsl(var(--foreground-muted))] transition-colors hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground-muted))]"
                  >
                    <Images className="w-[14px] h-[14px]" />
                  </button>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) addImages(e.target.files)
                    }}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!composerContent.trim() && previews.length === 0) return

                    // upload d'abord les images dans un dossier temporaire
                    // createPost crée le post et insère les images
                    await createPost(
                      composerContent,
                      user?.id ?? '',
                      previews,
                      uploadImages
                    )

                    setComposerContent('')
                    reset()
                  }}
                  disabled={!composerContent.trim() || isUploading}
                  className="inline-flex items-center gap-[0.4rem] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-sans text-[0.8125rem] font-semibold py-[0.55rem] px-[1.1rem] rounded-[calc(var(--radius)-2px)] cursor-pointer transition-opacity disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <Send className="w-[18px] h-[18px]" />
                  {isUploading ? 'Upload...' : 'Publier'}
                </button>
              </div>
            </div>
          )}

          {/* état loading initial */}
          {isLoading && posts.length === 0 && (
            <div className="text-center py-12 text-[hsl(var(--foreground-muted))] font-mono text-[0.75rem] uppercase tracking-[0.1em]">
              Chargement...
            </div>
          )}

          {/* état vide */}
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-12 text-[hsl(var(--foreground-muted))] font-mono text-[0.75rem] uppercase tracking-[0.1em]">
              Aucune publication pour le moment.
            </div>
          )}

          {/* liste des posts */}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id ?? ''}
              onToggleLike={toggleLike}
              isAdmin={isAdmin}
              onDelete={deletePost}
              onTogglePin={togglePin}
            />
          ))}

          {/* load more */}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="w-full py-3 font-display font-semibold text-[0.8rem] text-[hsl(var(--foreground-muted))] border border-[hsl(var(--border))] rounded-[var(--radius)] bg-transparent cursor-pointer transition-colors hover:border-[hsl(var(--primary)/0.4)] hover:text-[hsl(var(--primary))] disabled:opacity-40"
            >
              {isLoading ? 'Chargement...' : 'Charger 5 publications de plus'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
