import { useRef } from 'react'
import { Check } from 'lucide-react'
import { useGameStore } from '@/features/game/store/gameStore'
import useIsCompactBoard from '@/features/game/hooks/useIsCompactBoard'
import type { RulesConfig } from '@/features/game/utils/types'

type Mode = RulesConfig['mode']

// Budgets mesurés au rendu (étape 0), en unités de design box :
//   compact 417,8 × 68  (bande libre 433,8 × 84 moins 8px de marge de chaque côté ;
//                        433,8 = 780 - 2*16 - 2*157,1, la zone bot latérale la plus
//                        large étant celle du nom le plus long, « Emmanuel Raton »)
//   desktop 550 × 143,5 (bande libre 566 × 159,5, idem)
// Chaînes mesurées dans les vraies fontes (Montserrat 800 / Space Mono 700) :
//   desktop  titre 389,1 · eyebrow 167,6 · rangée 2 = 355,5  → carte 429,1 × 138,8
//   compact  titre 116,7 (2 lignes) · mode 158,6 · bouton 79,7 → carte 407,3 × 66
// Le bouton s'abrège en « Prêt » en compact : « Je suis prêt » coûte 48,9 de plus.
// Le padding des options tombe à 8 en compact (16 gagnés) : à 12, la carte fait
// 423,3 et mord de 5,5 sur la marge du bot latéral le plus large.
const MODES: { value: Mode; label: string; hint: string }[] = [
  { value: 'patriarchal', label: 'Patriarcal', hint: 'K > Q' },
  { value: 'matriarchal', label: 'Matriarcal', hint: 'Q > K' },
]

/**
 * Contrôle segmenté à deux options. Roving tabindex : seule l'option cochée est
 * dans l'ordre de tabulation, les flèches déplacent la sélection (pattern radio).
 */
function ModeControl({
  mode,
  compact,
  onChange,
}: {
  mode: Mode
  compact: boolean
  onChange: (mode: Mode) => void
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function move(from: number, delta: number) {
    const next = (from + delta + MODES.length) % MODES.length
    onChange(MODES[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Mode de jeu"
      className="flex shrink-0 items-center gap-1"
    >
      {MODES.map((m, i) => {
        const active = m.value === mode
        return (
          <button
            key={m.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            data-active={active}
            onClick={() => onChange(m.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault()
                move(i, 1)
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault()
                move(i, -1)
              }
            }}
            className="inline-flex flex-col items-center justify-center whitespace-nowrap border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))] data-[active=false]:border-transparent data-[active=false]:bg-transparent data-[active=false]:text-[hsl(var(--foreground-muted))] data-[active=true]:border-[hsl(var(--primary))] data-[active=true]:bg-[hsl(var(--primary)_/_0.14)] data-[active=true]:text-[hsl(var(--foreground))]"
            style={{
              height: compact ? 48 : 44,
              padding: compact ? '0 8px' : '0 14px',
              borderRadius: 'calc(var(--radius) - 2px)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: compact ? 12 : 13,
                lineHeight: 1.2,
              }}
            >
              {m.label}
            </span>
            {!compact && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  lineHeight: 1.2,
                  letterSpacing: '0.02em',
                  opacity: 0.75,
                }}
              >
                {m.hint}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function PreparationPanel() {
  const gameState = useGameStore((s) => s.gameState)
  const setRulesMode = useGameStore((s) => s.setRulesMode)
  const setReady = useGameStore((s) => s.setReady)
  const isCompact = useIsCompactBoard()

  if (!gameState || gameState.phase !== 'PREPARATION') return null

  const mode = gameState.config.mode

  const card: React.CSSProperties = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius)',
    boxShadow: '0 8px 24px hsl(var(--shadow-color))',
  }

  const readyButton = (
    <button
      type="button"
      onClick={() => setReady()}
      className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]"
      style={{
        height: isCompact ? 48 : 44,
        padding: isCompact ? '0 14px' : '0 18px',
        fontFamily: 'var(--font-display)',
        fontSize: isCompact ? 13 : 14,
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: 'calc(var(--radius) - 2px)',
        boxShadow: '0 4px 14px hsl(var(--primary) / 0.25)',
      }}
    >
      <Check size={isCompact ? 15 : 16} strokeWidth={3} aria-hidden />
      {isCompact ? 'Prêt' : 'Je suis prêt'}
    </button>
  )

  // Compact : une seule ligne. La coupure du titre est explicite — un retour
  // automatique dépendrait des métriques de la fonte de repli si Montserrat
  // n'est pas encore chargée, et ferait passer le titre sur trois lignes.
  if (isCompact) {
    return (
      <div
        className="flex items-center gap-3"
        style={{ ...card, maxWidth: 418, padding: '8px 12px' }}
      >
        <h2
          className="shrink-0"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 16,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'hsl(var(--foreground))',
          }}
        >
          Échange tes
          <br />
          cartes visibles
        </h2>
        <ModeControl mode={mode} compact onChange={setRulesMode} />
        {readyButton}
      </div>
    )
  }

  return (
    <div
      className="flex flex-col"
      style={{ ...card, maxWidth: 550, padding: '14px 20px' }}
    >
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
          style={{
            width: 32,
            height: 1,
            background: 'hsl(var(--primary))',
          }}
        />
        Phase de préparation
      </p>
      <h2
        style={{
          marginTop: 4,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 28,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'hsl(var(--foreground))',
        }}
      >
        Échange tes cartes visibles
      </h2>
      <div
        className="flex items-center justify-between gap-4"
        style={{ marginTop: 14 }}
      >
        <ModeControl mode={mode} compact={false} onChange={setRulesMode} />
        {readyButton}
      </div>
    </div>
  )
}
