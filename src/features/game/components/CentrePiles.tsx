import { useGameStore } from '@/features/game/store/gameStore'
import { useGameBoardContext } from '@/features/game/contexts/GameBoardContext'
import { useCardAnimation } from '@/features/game/contexts/CardAnimationContext'
import { GameCard } from './GameCard'
import { AnimatePresence, motion } from 'framer-motion'

export function CentrePiles() {
  const gameState = useGameStore((s) => s.gameState)
  const { registerPileRef, registerFosseRef } = useCardAnimation()
  const { pileRing, handlePileClick, revealingHidden } = useGameBoardContext()

  if (!gameState) return null
  const { pile, deck, discard } = gameState
  const pileTop3 = pile.slice(-3)

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="flex items-center gap-6">
        {/* Fosse */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs" style={{ color: 'hsl(var(--primary))' }}>
            Fosse ({discard.length})
          </span>
          <div ref={registerFosseRef} className="relative w-14 h-[78px]">
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
                <GameCard card={discard[discard.length - 3]} state="normal" />
              </div>
            )}
            {discard.length >= 2 && (
              <div className="absolute inset-0 -rotate-3 -translate-x-2 opacity-80">
                <GameCard card={discard[discard.length - 2]} state="normal" />
              </div>
            )}
            {discard.length >= 1 && (
              <div className="absolute inset-0">
                <GameCard card={discard[discard.length - 1]} state="normal" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white/60 text-xs">Pile ({pile.length})</span>
          <div
            ref={(el) => registerPileRef(el)}
            className={`relative w-14 h-[78px] cursor-pointer rounded-md ${pileRing}`}
            onClick={handlePileClick}
          >
            {pile.length === 0 && !revealingHidden && (
              <GameCard card={null} state="empty" />
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
                    <GameCard card={card} state="normal" />
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {revealingHidden && (
              <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-md animate-pulse">
                <GameCard card={revealingHidden} state="normal" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white/60 text-xs">Deck ({deck.length})</span>
          {deck.length === 0 ? (
            <div className="w-14 h-[78px] rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm">
              0
            </div>
          ) : (
            <GameCard card={null} state="hidden" />
          )}
        </div>
      </div>
    </div>
  )
}
