import { useGameStore } from '@/features/game/store/gameStore'
import { useGameBoardContext } from '@/features/game/contexts/GameBoardContext'
import { GameCard } from './GameCard'

export function CentrePiles() {
  const gameState = useGameStore(s => s.gameState)
  const takePile = useGameStore(s => s.takePile)
  const passTurn = useGameStore(s => s.passTurn)
  const {
    pileRing,
    handlePileClick,
    revealingHidden,
    cutReveal,
    cannotPlay,
    canPassTurn,
    invalidMsg,
  } = useGameBoardContext()

  if (!gameState) return null
  const { pile, deck, discard } = gameState
  const pileTop3 = pile.slice(-3)

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="flex items-center gap-6">
        {/* Fosse */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-xs"
            style={{ color: 'hsl(var(--primary))' }}
          >
            Fosse ({discard.length})
          </span>
          <div className="relative w-14 h-[78px]">
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
          <span className="text-white/60 text-xs">
            Pile ({pile.length})
          </span>
          <div
            className={`relative w-14 h-[78px] cursor-pointer rounded-md ${pileRing}`}
            onClick={handlePileClick}
          >
            {pile.length === 0 && !revealingHidden && !cutReveal && (
              <GameCard card={null} state="empty" />
            )}
            {pileTop3.length >= 3 && (
              <div className="absolute inset-0 -rotate-6 -translate-x-4 opacity-60">
                <GameCard card={pileTop3[0]} state="normal" />
              </div>
            )}
            {pileTop3.length >= 2 && (
              <div className="absolute inset-0 -rotate-3 -translate-x-2 opacity-80">
                <GameCard card={pileTop3[pileTop3.length - 2]} state="normal" />
              </div>
            )}
            {pileTop3.length >= 1 && (
              <div className="absolute inset-0">
                <GameCard card={pileTop3[pileTop3.length - 1]} state="normal" />
              </div>
            )}
            {revealingHidden && (
              <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-md animate-pulse">
                <GameCard card={revealingHidden} state="normal" />
              </div>
            )}
            {cutReveal && (
              <div className="absolute inset-0 ring-2 ring-orange-400 rounded-md animate-pulse">
                <GameCard card={cutReveal} state="normal" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white/60 text-xs">
            Deck ({deck.length})
          </span>
          {deck.length === 0 ? (
            <div className="w-14 h-[78px] rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm">
              0
            </div>
          ) : (
            <GameCard card={null} state="hidden" />
          )}
        </div>
      </div>
      {cannotPlay && pile.length > 0 && (
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg animate-pulse"
          style={{
            background: 'hsl(var(--delete))',
            color: 'hsl(var(--primary-foreground))',
            boxShadow: 'hsl(var(--delete) / 0.25) 0 4px 14px',
          }}
          onClick={takePile}
        >
          Ramasser la pile
        </button>
      )}
      {canPassTurn && (
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg animate-pulse"
          style={{
            background: 'hsl(var(--warning))',
            color: 'hsl(var(--foreground-contrast))',
            boxShadow: 'hsl(var(--warning) / 0.25) 0 4px 14px',
          }}
          onClick={passTurn}
        >
          ⏭ Passer son tour
        </button>
      )}
      {invalidMsg && (
        <div className="px-3 py-1 bg-red-900/80 text-red-200 text-xs rounded-full">
          {invalidMsg}
        </div>
      )}
    </div>
  )
}
