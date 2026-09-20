import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { RotateCcw, Table2, Trophy } from 'lucide-react'
import useIsCompactBoard from '@/features/game/hooks/useIsCompactBoard'
import type { Player } from '@/features/game/utils/types'

interface Props {
  players: Player[]
  finishOrder: string[]
  humanId: string
  onHide: () => void
  onReplay: () => void
  /** Confettis à l'ouverture. false quand l'écran est rouvert depuis la barre
   *  d'actions : on ne fête la victoire qu'à sa première apparition. */
  celebrate?: boolean
  /** Pseudo affiché sur la ligne de l'humain. Le store ne connaît que le nom
   *  passé à startGame (« You ») ; le vrai pseudo vient de Supabase. */
  humanName?: string
}

// L'EndScreen est rendu en dehors de la design box mise à l'échelle : ses px
// sont des px réels. Budgets mesurés (étape 0d) : zone de jeu moins 2×16 →
// desktop 1120×779, compact 780×295 (812×375) et 708×280 (740×360, cas
// dimensionnant). Chaînes mesurées dans les vraies fontes :
//   eyebrow     « Classement provisoire » 176,03 (> « Partie terminée » 125,73)
//   pire nom    « Emmanuel Raton » 126,08 en 14/600, 117,08 en 13/600
//   boutons     rangée Rejouer + Voir le plateau : 272,3 desktop, 260,7 compact
//
// Les largeurs sont FIXES pour que la carte ne bouge pas quand le classement se
// remplit (l'eyebrow change de libellé entre la 3e et la 4e ligne, et les noms
// varient) :
//   desktop  contenu dimensionnant = boutons 272,3 → carte 312 (marge 5,7)
//   compact  colonne classement 2+16+18+8+117,08+8+32,8 = 201,88 → 208, pour
//            laisser 6,1 au nom au lieu des 0,12 qu'un arrondi à 202 donnait
//            colonne verdict max(260,7 ; 216,03) → 268 (marge 7,3)
//            carte 2+32+268+20+208 = 530 × 228,1, budget 708 × 280
// Place laissée au nom : 117,2 → 123,2 en compact, 191,2 en desktop. Au-delà,
// `truncate` prend le relais (pseudo Supabase arbitrairement long).
const MEDAL_TOKENS = ['--gold', '--silver', '--bronze', '--foreground-muted']
const ORDINALS = ['1er', '2e', '3e', '4e']
const VERDICTS = [
  'Tu remportes la partie.',
  'Tu montes sur le podium.',
  'Tu montes sur le podium.',
  'Tu fermes la marche.',
]

/**
 * Lit un token de couleur sur :root et le convertit en hex.
 *
 * canvas-confetti ne sait pas lire autre chose : `hexToRgb` y filtre la chaîne
 * par /[^0-9a-f]/gi puis lit six chiffres, donc un `hsl(...)` serait accepté
 * en silence et rendu dans une couleur fausse. Les tokens du projet sont
 * stockés sans la fonction hsl() (« 43 85% 55% »), d'où la conversion ici.
 * Un token illisible est ignoré plutôt que rendu faux.
 */
function tokenToHex(token: string): string | null {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()
  const m = raw.match(
    /^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/.*)?$/
  )
  if (!m) return null
  const h = Number(m[1]) / 360
  const s = Number(m[2]) / 100
  const l = Number(m[3]) / 100
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function EndScreen({
  players,
  finishOrder,
  humanId,
  onHide,
  onReplay,
  celebrate = true,
  humanName,
}: Props) {
  const navigate = useNavigate()
  const isCompact = useIsCompactBoard()
  const placement = finishOrder.indexOf(humanId) + 1
  const isFinal = finishOrder.length >= players.length

  useEffect(() => {
    if (!celebrate || placement !== 1) return
    const colors = ['--gold', '--primary', '--accent']
      .map(tokenToHex)
      .filter((c): c is string => c !== null)
    if (colors.length === 0) return

    let raf = 0
    let cancelled = false
    const end = Date.now() + 2000
    const frame = () => {
      if (cancelled) return
      const shot = {
        particleCount: 2,
        spread: 50,
        colors,
        disableForReducedMotion: true,
      }
      confetti({ ...shot, angle: 60, origin: { x: 0 } })
      confetti({ ...shot, angle: 120, origin: { x: 1 } })
      if (Date.now() < end) raf = requestAnimationFrame(frame)
    }
    frame()
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      confetti.reset()
    }
  }, [placement, celebrate])

  // Le nom de l'humain est surchargé : le store porte « You », pas le pseudo.
  // Les largeurs sont fixes, donc un pseudo long est tronqué (filet `truncate`)
  // sans jamais déplacer la carte.
  const nameOf = (id: string) =>
    id === humanId
      ? humanName || 'Joueur'
      : (players.find((p) => p.id === id)?.name ?? id)

  const eyebrow = (
    <p
      className="flex items-center gap-2"
      style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 11,
        lineHeight: 1.45,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'hsl(var(--primary))',
      }}
    >
      <span
        aria-hidden
        style={{ width: 32, height: 1, background: 'hsl(var(--primary))' }}
      />
      {isFinal ? 'Partie terminée' : 'Classement provisoire'}
    </p>
  )

  const verdict = (
    <>
      <p
        style={{
          marginTop: 6,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: isCompact ? 40 : 56,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: `hsl(var(${MEDAL_TOKENS[placement - 1] ?? '--foreground-muted'}))`,
        }}
      >
        {ORDINALS[placement - 1] ?? '—'}
      </p>
      <p
        style={{
          marginTop: 4,
          fontSize: isCompact ? 12 : 14,
          lineHeight: 1.35,
          color: 'hsl(var(--foreground-muted))',
        }}
      >
        {VERDICTS[placement - 1] ?? 'La partie est terminée.'}
      </p>
    </>
  )

  // Toujours quatre lignes : finishOrder peut n'en contenir qu'une (l'humain
  // finit premier, les bots jouent encore) — les places non attribuées sont
  // marquées « En jeu ».
  const standings = (
    <ol className="flex flex-col gap-1.5" style={{ listStyle: 'none' }}>
      {[0, 1, 2, 3].map((i) => {
        const id = finishOrder[i]
        const isHuman = id === humanId
        return (
          <li
            key={i}
            data-human={isHuman}
            className="flex items-center gap-2 border border-transparent data-[human=true]:border-[hsl(var(--primary))] data-[human=true]:bg-[hsl(var(--primary)_/_0.12)]"
            style={{
              height: isCompact ? 32 : 36,
              padding: '0 8px',
              borderRadius: 'calc(var(--radius) - 2px)',
            }}
          >
            <span
              style={{
                width: isCompact ? 18 : 20,
                flexShrink: 0,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: 13,
                color: id
                  ? `hsl(var(${MEDAL_TOKENS[i]}))`
                  : 'hsl(var(--foreground-muted))',
              }}
            >
              {i + 1}
            </span>
            {id ? (
              <span
                className="min-w-0 flex-1 truncate"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: isCompact ? 13 : 14,
                  color: 'hsl(var(--foreground))',
                }}
              >
                {nameOf(id)}
              </span>
            ) : (
              <span
                className="min-w-0 flex-1"
                style={{
                  fontSize: isCompact ? 12 : 13,
                  color: 'hsl(var(--foreground-muted))',
                }}
              >
                En jeu
              </span>
            )}
            {isHuman && (
              <span
                style={{
                  flexShrink: 0,
                  padding: '2px 6px',
                  borderRadius: 'calc(var(--radius) - 4px)',
                  background: 'hsl(var(--primary) / 0.2)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'hsl(var(--primary))',
                }}
              >
                Toi
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )

  const btnBase =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]'
  const btnSize = {
    height: 44,
    fontFamily: 'var(--font-display)',
    fontSize: isCompact ? 13 : 14,
    borderRadius: 'calc(var(--radius) - 2px)',
  } as const

  // Même gabarit dans les deux layouts : une rangée de 44 (Rejouer + Voir le
  // plateau) puis le lien ghost. Les trois sur une rangée demanderaient 421,6
  // de large en desktop, au-delà des 386 utiles de la carte.
  const actions = (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReplay}
          className={`${btnBase} flex-1`}
          style={{
            ...btnSize,
            padding: '0 14px',
            background: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            boxShadow: '0 4px 14px hsl(var(--primary) / 0.25)',
          }}
        >
          <RotateCcw size={15} strokeWidth={2.5} aria-hidden />
          Rejouer
        </button>
        <button
          type="button"
          onClick={onHide}
          className={`${btnBase} flex-1 border`}
          style={{
            ...btnSize,
            padding: '0 14px',
            borderColor: 'hsl(var(--border))',
            background: 'transparent',
            color: 'hsl(var(--foreground))',
          }}
        >
          <Table2 size={15} strokeWidth={2.5} aria-hidden />
          Voir le plateau
        </button>
      </div>
      <button
        type="button"
        onClick={() => navigate('/leaderboard')}
        className={btnBase}
        style={{
          ...btnSize,
          padding: '0 14px',
          background: 'transparent',
          color: 'hsl(var(--foreground-muted))',
        }}
      >
        <Trophy size={15} strokeWidth={2.5} aria-hidden />
        Classement
      </button>
    </div>
  )

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'hsl(var(--background) / 0.8)', padding: 16 }}
    >
      <div
        role="dialog"
        aria-label="Résultat de la partie"
        className={
          isCompact
            ? 'flex max-h-full gap-5 overflow-auto'
            : 'flex max-h-full flex-col overflow-auto'
        }
        style={{
          width: isCompact ? 530 : 312,
          maxWidth: '100%',
          padding: 16,
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius)',
          boxShadow: '0 24px 64px hsl(var(--shadow-color))',
        }}
      >
        {isCompact ? (
          <>
            <div className="flex min-w-0 flex-1 flex-col">
              {eyebrow}
              {verdict}
              <div style={{ marginTop: 14 }}>{actions}</div>
            </div>
            {/* Largeur fixe : calibrée sur le pire nom du pool, tag « Toi »
                compris. Le classement ne fait donc jamais varier la carte. */}
            <div style={{ width: 208, flex: 'none' }}>{standings}</div>
          </>
        ) : (
          <>
            {eyebrow}
            {verdict}
            <div style={{ marginTop: 22 }}>{standings}</div>
            <div style={{ marginTop: 22 }}>{actions}</div>
          </>
        )}
      </div>
    </div>
  )
}
