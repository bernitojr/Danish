import { Heart, MessageCircle, Pin, Send, Star, ThumbsUp } from 'lucide-react'
import { AuthorChip } from '../components/AuthorChip'

const fakeAuthor = {
  id: '1',
  username: 'Admin DWC',
  avatar_url: null,
}

export function FeedPage() {
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
          Compteur publication
        </div>
      </div>

      {/* feed layout */}
      <div className="flex flex-col gap-6 pb-20 max-w-[640px] mx-auto">
        {/* feed colonne */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* admin composer */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] p-5 relative overflow-hidden">
            {/* composer head */}
            <div className="flex items-center gap-3 mb-[0.875rem]">
              <div className="w-[38px] h-[38px] rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)/0.3),hsl(var(--accent)/0.2))] border-[1.5px] border-[hsl(var(--primary)/0.4)] flex items-center justify-center font-display font-extrabold text-[0.78rem] text-[hsl(var(--primary))] shrink-0">
                AD
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold text-sm text-[hsl(var(--foreground))]">
                  Admin
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
              placeholder="Adressez un message à la commu DWC"
              className="resize-none w-full bg-[hsl(var(--background-dark))] border border-[hsl(var(--border))] rounded-[var(--radius)] py-3 px-[0.875rem] font-sans text-sm text-[hsl(var(--foreground))] min-h-[80px] outline-none transition-colors leading-[1.5]"
            />

            {/* composer actions */}
            <div className="flex items-center justify-between mt-[0.875rem] gap-2 flex-wrap">
              <div className="flex gap-[0.3rem]">
                <button className="w-[32px] h-[32px] rounded-[calc(var(--radius)-2px)] border border-[hsl(var(--border))] bg-transparent cursor-pointer flex items-center justify-center text-[hsl(var(--foreground-muted))] transition-colors">
                  IMG
                </button>
              </div>
              <button className="inline-flex items-center gap-[0.4rem] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-sans text-[0.8125rem] font-semibold py-[0.55rem] px-[1.1rem] rounded-[calc(var(--radius)-2px)] cursor-pointer transition-opacity disabled:opacity-45 disabled:cursor-not-allowed">
                <Send className="w-[18px] h-[18px]" />
                Publier
              </button>
            </div>
          </div>

          {/* post épinglé */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--gold)/0.35)] rounded-[var(--radius)] overflow-hidden transition-colors">
            {/* pinned banner */}
            <div className="bg-[hsl(var(--gold)/0.08)] border-b border-b-[hsl(var(--gold)/0.2)] py-2 px-5 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[hsl(var(--gold))]">
              <Pin className="w-[12px] h-[12px]" />
              Épinglé par l'admin
            </div>

            {/* post header */}
            <div className="flex items-center gap-3 pt-[1.1rem] px-5 pb-2">
              <AuthorChip
                author={fakeAuthor}
                role="admin"
                createdAt={new Date().toISOString()}
                size="md"
              />
            </div>

            {/* post body */}
            <div className="pt-1 px-5 pb-4 text-[0.9rem] text-[hsl(var(--foreground-secondary))] leading-[1.6] whitespace-pre-wrap break-words">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
            </div>

            {/* reaction strip */}
            <div className="flex items-center justify-between flex-wrap gap-2 py-[0.6rem] px-5 border-t border-b border-[hsl(var(--border)/0.4)] text-[0.78rem] text-[hsl(var(--foreground-muted))]">
              <div className="flex items-center gap-[0.4rem]">
                <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                  <ThumbsUp className="w-[16px] h-[16px]" />
                </span>
                <span>compteur like</span>
              </div>
              <div className="flex items-center gap-[0.4rem]">
                <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                  <MessageCircle className="w-[16px] h-[16px]" />
                </span>
                <span>compteur commentaire</span>
              </div>
            </div>

            {/* post actions */}
            <div className="flex gap-1 py-[0.4rem] px-[0.6rem]">
              <button className="flex-1 flex items-center justify-center gap-[0.45rem] bg-transparent border-none py-[0.6rem] px-[0.5rem] rounded-[calc(var(--radius)-4px)] font-sans text-[0.8rem] font-medium text-[hsl(var(--foreground-muted))] cursor-pointer transition-colors">
                <ThumbsUp className="w-[16px] h-[16px]" />
                Like
              </button>
              <button className="flex-1 flex items-center justify-center gap-[0.45rem] bg-transparent border-none py-[0.6rem] px-[0.5rem] rounded-[calc(var(--radius)-4px)] font-sans text-[0.8rem] font-medium text-[hsl(var(--foreground-muted))] cursor-pointer transition-colors">
                <MessageCircle className="w-[16px] h-[16px]" />
                Commenter
              </button>
            </div>

            {/* comment section */}
            <div className="hidden border-t border-[hsl(var(--border)/0.4)] pt-[0.875rem] px-5 pb-4">
              <div className="flex gap-[0.625rem] py-2">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-display font-extrabold text-[0.65rem] shrink-0">
                  VB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-[hsl(var(--background-dark))] border border-[hsl(var(--border)/0.5)] rounded-[14px] py-2 px-3">
                    <div className="text-[0.76rem] font-semibold text-[hsl(var(--foreground))] mb-[0.1rem]">
                      David Becane
                    </div>
                    <div className="text-[0.82rem] text-[hsl(var(--foreground-secondary))] leading-[1.4]">
                      chaud bouillant
                    </div>
                  </div>
                  <div className="mt-1 px-3 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[hsl(var(--foreground-muted))]">
                    <button className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-[hsl(var(--foreground-muted))] transition-colors">
                      <Heart className="w-[14px] h-[14px]" />
                      Like
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* second post */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] overflow-hidden transition-colors">
            {/* post header */}
            <div className="flex items-center gap-3 pt-[1.1rem] px-5 pb-2">
              <AuthorChip
                author={fakeAuthor}
                role="admin"
                createdAt={new Date().toISOString()}
                size="md"
              />
            </div>

            {/* post body */}
            <div className="pt-1 px-5 pb-4 text-[0.9rem] text-[hsl(var(--foreground-secondary))] leading-[1.6] whitespace-pre-wrap break-words">
              <p>
                Voici un post classique non épinglé. Il suit la même structure
                générale que le post principal, mais sans la bannière d'épingle.
              </p>
            </div>

            {/* reaction strip */}
            <div className="flex items-center justify-between flex-wrap gap-2 py-[0.6rem] px-5 border-t border-b border-[hsl(var(--border)/0.4)] text-[0.78rem] text-[hsl(var(--foreground-muted))]">
              <div className="flex items-center gap-[0.4rem]">
                <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                  <ThumbsUp className="w-[16px] h-[16px]" />
                </span>
                <span>compteur like</span>
              </div>
              <div className="flex items-center gap-[0.4rem]">
                <span className="p-1 hover:bg-[hsl(var(--foreground)/0.1)] rounded-full">
                  <MessageCircle className="w-[16px] h-[16px]" />
                </span>
                <span>compteur commentaire</span>
              </div>
            </div>

            {/* post actions */}
            <div className="flex gap-1 py-[0.4rem] px-[0.6rem]">
              <button className="flex-1 flex items-center justify-center gap-[0.45rem] bg-transparent border-none py-[0.6rem] px-[0.5rem] rounded-[calc(var(--radius)-4px)] font-sans text-[0.8rem] font-medium text-[hsl(var(--foreground-muted))] cursor-pointer transition-colors">
                <ThumbsUp className="w-[16px] h-[16px]" />
                Like
              </button>
              <button className="flex-1 flex items-center justify-center gap-[0.45rem] bg-transparent border-none py-[0.6rem] px-[0.5rem] rounded-[calc(var(--radius)-4px)] font-sans text-[0.8rem] font-medium text-[hsl(var(--foreground-muted))] cursor-pointer transition-colors">
                <MessageCircle className="w-[16px] h-[16px]" />
                Commenter
              </button>
            </div>

            {/* comment section */}
            <div className="hidden border-t border-[hsl(var(--border)/0.4)] pt-[0.875rem] px-5 pb-4">
              <div className="flex gap-[0.625rem] py-2">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-display font-extrabold text-[0.65rem] shrink-0">
                  VB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-[hsl(var(--background-dark))] border border-[hsl(var(--border)/0.5)] rounded-[14px] py-2 px-3">
                    <div className="text-[0.76rem] font-semibold text-[hsl(var(--foreground))] mb-[0.1rem]">
                      Membre
                    </div>
                    <div className="text-[0.82rem] text-[hsl(var(--foreground-secondary))] leading-[1.4]">
                      Super post !
                    </div>
                  </div>
                  <div className="mt-1 px-3 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[hsl(var(--foreground-muted))]">
                    <button className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-[hsl(var(--foreground-muted))] transition-colors">
                      <Heart className="w-[14px] h-[14px]" />
                      Like
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
