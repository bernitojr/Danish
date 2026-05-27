import { useState } from 'react'
import {
  FileText,
  Play,
  User,
  ArrowRight,
  Trophy,
  Newspaper,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const STATIC_CARDS = [
  {
    // number: '01',
    tag: 'Règlement',
    title: 'Règles',
    description:
      'Les règles officielles du Danish, non négociables. Consultez les variantes, les pénalités et les cas particuliers.',
    icon: FileText,
    accentVar: '--accent',
    footer: 'Feature incoming',
    href: '#',
    onClickPath: '/rules',
  },
  {
    // number: '03',
    tag: 'Compte',
    title: 'Profil',
    description:
      'Consulte ton historique, tes statistiques, ton classement dans le tournoi et personnalise ton avatar DWC.',
    icon: User,
    accentVar: '--dwc-grey-blue',
    footer: 'Voir mon profil',
    href: '#',
    onClickPath: '/profile',
  },
  {
    tag: 'Classement',
    title: 'Classement',
    description: 'Consulte le classement officiel.',
    icon: Trophy,
    accentVar: '--gold',
    footer: 'Voir le classement',
    href: '#',
    onClickPath: '/leaderboard',
  },

  {
    tag: 'Feed',
    title: 'Feed',
    description: 'Consulte le feed des dernières actualités.',
    icon: Newspaper,
    accentVar: '--info',
    footer: 'Voir le feed',
    href: '#',
    onClickPath: '/feed',
  },
]


export function QuickAccessCards() {
  const navigate = useNavigate()

  function handlePlay() {
    navigate('/game')
  }

  return (
    <section className="relative z-10 px-8 pb-24">
      <div className="max-w-[1280px] mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8 text-[0.7rem] uppercase tracking-[0.15em] text-[hsl(var(--foreground-muted))]">
          <span className="flex-1 h-px bg-[hsl(var(--border))]" />
          Accès rapide
          <span className="flex-1 h-px bg-[hsl(var(--border))]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Règles */}
          <CardStatic
            data={STATIC_CARDS[0]!}
            onClick={() => navigate(STATIC_CARDS[0]!.onClickPath)}
          />

          {/* Card 2 — Jouer (interactive) */}
          <CardPlay onPlay={handlePlay} />

          {/* Card 3 — Profil */}
          <CardStatic
            data={STATIC_CARDS[1]!}
            onClick={() => navigate(STATIC_CARDS[1]!.onClickPath)}
          />
          {/* Card 4 Classement */}
          <CardStatic
            data={STATIC_CARDS[2]!}
            onClick={() => navigate(STATIC_CARDS[2]!.onClickPath)}
          />
          {/* Card 5 — Feed */}
          <CardStatic
            data={STATIC_CARDS[3]!}
            onClick={() => navigate(STATIC_CARDS[3]!.onClickPath)}
          />
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// Styles partagés (border top permanente + hover glow)
// ─────────────────────────────────────────────

const CARD_BASE_CLASSES = `
  relative overflow-hidden
  bg-[hsl(var(--card))]
  rounded-lg p-7
  flex flex-col gap-5
  transition-all duration-300
  hover:-translate-y-1
`

// Au repos : bordure 1px globale grise + bordure top colorée (2px)
// Au hover : bordure 1px colorée tout autour + glow projeté
function getCardBoxShadow(isHovered: boolean): string {
  if (isHovered) {
    return `
      0 0 0 1px hsl(var(--card-accent) / 0.5),
      0 20px 50px -12px hsl(var(--card-accent) / 0.35),
      inset 0 2px 0 0 hsl(var(--card-accent))
    `
  }
  return `
    0 0 0 1px hsl(var(--border)),
    inset 0 2px 0 0 hsl(var(--card-accent))
  `
}

// ─────────────────────────────────────────────
// Card Jouer (interactive avec slider)
// ─────────────────────────────────────────────

interface CardPlayProps {
  onPlay: () => void
}

function CardPlay({ onPlay }: CardPlayProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`group ${CARD_BASE_CLASSES}`}
      style={{
        ['--card-accent' as string]: 'var(--primary)',
        boxShadow: getCardBoxShadow(isHovered),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <span
        className="absolute top-4 right-6 text-[7rem] font-extrabold leading-none opacity-[0.04] pointer-events-none select-none transition-opacity duration-300 group-hover:opacity-[0.08]"
        style={{ color: 'hsl(var(--card-accent))' }}
      >
        02
      </span> */}

      <div
        className="relative z-10 w-12 h-12 rounded-lg flex items-center justify-center"
        style={{
          background: 'hsl(var(--card-accent) / 0.15)',
          color: 'hsl(var(--card-accent))',
        }}
      >
        <Play size={20} />
      </div>

      <div className="relative z-10 flex flex-col gap-2 flex-1">
        <span
          className="text-[0.65rem] uppercase tracking-[0.15em] font-medium"
          style={{ color: 'hsl(var(--card-accent))' }}
        >
          Partie
        </span>
        <div className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">
          Jouer
        </div>
        <p className="text-sm text-[hsl(var(--foreground-secondary))] leading-relaxed">
          Lance une nouvelle partie contre des bots. Choisis la difficulté avant de jouer.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[hsl(var(--border))]">
        <button
          onClick={onPlay}
          className="
            inline-flex items-center gap-2
            text-[hsl(var(--primary-foreground))]
            px-4 py-2 rounded-md
            font-semibold text-sm
            hover:opacity-90
            transition-opacity
          "
          style={{ background: 'hsl(var(--card-accent))' }}
        >
          Lancer une partie
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Card statique (Règles, Profil)
// ─────────────────────────────────────────────

interface CardStaticProps {
  data: (typeof STATIC_CARDS)[number]
  onClick: () => void
}

function CardStatic({ data, onClick }: CardStaticProps) {
  const Icon = data.icon
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={data.href}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={`group cursor-pointer no-underline ${CARD_BASE_CLASSES}`}
      style={{
        ['--card-accent' as string]: `var(${data.accentVar})`,
        boxShadow: getCardBoxShadow(isHovered),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <span
        className="absolute top-4 right-6 text-[7rem] font-extrabold leading-none opacity-[0.04] pointer-events-none select-none transition-opacity duration-300 group-hover:opacity-[0.08]"
        style={{ color: 'hsl(var(--card-accent))' }}
      >
        {data.number}
      </span> */}

      <div
        className="relative z-10 w-12 h-12 rounded-lg flex items-center justify-center"
        style={{
          background: 'hsl(var(--card-accent) / 0.15)',
          color: 'hsl(var(--card-accent))',
        }}
      >
        <Icon size={20} />
      </div>

      <div className="relative z-10 flex flex-col gap-2 flex-1">
        <span
          className="text-[0.65rem] uppercase tracking-[0.15em] font-medium text-[hsl(var(--foreground-muted))]"
          style={{ color: 'hsl(var(--card-accent))' }}
        >
          {data.tag}
        </span>
        <div className="text-2xl font-display font-bold text-[hsl(var(--foreground))]">
          {data.title}
        </div>
        <p className="text-sm text-[hsl(var(--foreground-secondary))] leading-relaxed">
          {data.description}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[hsl(var(--border))]">
        <span className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--foreground-muted))]">
          {/* <Info size={11} /> */}
          {data.footer}
        </span>
        <span style={{ color: 'hsl(var(--card-accent))' }}>
          <ArrowRight size={16} />
        </span>
      </div>
    </a>
  )
}
