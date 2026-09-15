import { useGameStore } from '@/features/game/store/gameStore'
import { useGameBoardContext } from '@/features/game/contexts/GameBoardContext'
import { useCardAnimation } from '@/features/game/contexts/CardAnimationContext'
import { GameCard } from './GameCard'
import { AnimatePresence, motion } from 'framer-motion'
import {
  getCardDims,
  CARD_W_DESKTOP,
  CARD_W_COMPACT,
} from '@/features/game/utils/cardDims'
import useIsCompactBoard from '@/features/game/hooks/useIsCompactBoard'

// Libellé "Nom (n)". Compact : à droite de la carte, sur deux lignes (order-last
// dans une colonne passée en ligne) → la bande n'a plus que la hauteur d'une
// carte. À droite car les piles empilées débordent vers la gauche.
function PileLabel({
  name,
  count,
  compact,
  className = '',
  style,
}: {
  name: string
  count: number
  compact: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return compact ? (
    <span
      className={`order-last text-[10px] leading-tight ${className}`}
      style={style}
    >
      {name}
      <br />({count})
    </span>
  ) : (
    <span className={`text-xs ${className}`} style={style}>
      {name} ({count})
    </span>
  )
}

export function CentrePiles() {
  const gameState = useGameStore((s) => s.gameState)
  const { registerPileRef, registerFosseRef } = useCardAnimation()
  const { pileRing, handlePileClick, revealingHidden } = useGameBoardContext()
  const isCompact = useIsCompactBoard()
  const dims = getCardDims(isCompact ? CARD_W_COMPACT : CARD_W_DESKTOP)

  if (!gameState) return null
  const { pile, deck, discard } = gameState
  const pileTop3 = pile.slice(-3)
  const column = isCompact
    ? 'flex items-center gap-1'
    : 'flex flex-col items-center gap-1'

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="flex items-center gap-6">
        {/* Fosse */}
        <div className={column}>
          <PileLabel
            name="Fosse"
            count={discard.length}
            compact={isCompact}
            style={{ color: 'hsl(var(--primary))' }}
          />
          <div
            ref={registerFosseRef}
            className="relative"
            style={{ width: dims.w, height: dims.h }}
          >
            {discard.length === 0 && (
              <div
                className="absolute inset-0 rounded-md flex items-center justify-center text-xs"
                style={{
                  border: '1.5px solid hsl(var(--primary) / 0.5)',
                  color: 'hsl(var(--primary) / 0.4)',
                }}
              >
                vide
              </div>
            )}
            {discard.length >= 3 && (
              <div className="absolute inset-0 -rotate-6 -translate-x-4 opacity-60">
                <GameCard
                  card={discard[discard.length - 3]}
                  state="normal"
                  width={dims.w}
                  height={dims.h}
                />
              </div>
            )}
            {discard.length >= 2 && (
              <div className="absolute inset-0 -rotate-3 -translate-x-2 opacity-80">
                <GameCard
                  card={discard[discard.length - 2]}
                  state="normal"
                  width={dims.w}
                  height={dims.h}
                />
              </div>
            )}
            {discard.length >= 1 && (
              <div className="absolute inset-0">
                <GameCard
                  card={discard[discard.length - 1]}
                  state="normal"
                  width={dims.w}
                  height={dims.h}
                />
              </div>
            )}
          </div>
        </div>
        <div className={column}>
          <PileLabel
            name="Pile"
            count={pile.length}
            compact={isCompact}
            className="text-white/60"
          />
          <div
            ref={(el) => registerPileRef(el)}
            className={`relative cursor-pointer rounded-md ${pileRing}`}
            style={{ width: dims.w, height: dims.h }}
            onClick={handlePileClick}
          >
            {pile.length === 0 && !revealingHidden && (
              <GameCard
                card={null}
                state="empty"
                width={dims.w}
                height={dims.h}
              />
            )}
            <AnimatePresence>
              {pileTop3.map((card, i) => {
                const offsets = [
                  { rotate: -6, x: -16, opacity: 0.6 },
                  { rotate: -3, x: -8, opacity: 0.8 },
                  { rotate: 0, x: 0, opacity: 1 },
                ]
                const offset = offsets[i + (3 - pileTop3.length)] ?? offsets[2]
                return (
                  <motion.div
                    key={card.id}
                    className="absolute inset-0"
                    animate={{
                      rotate: offset.rotate,
                      x: offset.x,
                      opacity: offset.opacity,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <GameCard
                      card={card}
                      state="normal"
                      width={dims.w}
                      height={dims.h}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {revealingHidden && (
              <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-md animate-pulse">
                <GameCard
                  card={revealingHidden}
                  state="normal"
                  width={dims.w}
                  height={dims.h}
                />
              </div>
            )}
          </div>
        </div>
        <div className={column}>
          <PileLabel
            name="Deck"
            count={deck.length}
            compact={isCompact}
            className="text-white/60"
          />
          {deck.length === 0 ? (
            <div
              className="rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm"
              style={{ width: dims.w, height: dims.h }}
            >
              0
            </div>
          ) : (
            <GameCard
              card={null}
              state="hidden"
              width={dims.w}
              height={dims.h}
            />
          )}
        </div>
      </div>
    </div>
  )
}
