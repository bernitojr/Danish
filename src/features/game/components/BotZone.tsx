import { useGameStore } from '@/features/game/store/gameStore'
import { useGameBoardContext } from '@/features/game/contexts/GameBoardContext'
import { Bubble } from './Bubble'
import { PlayerZone } from './PlayerZone'
import type { Player } from '@/features/game/utils/types'

interface BotZoneProps {
  player: Player
  idx: number
  bubbleDirection?: 'up' | 'down' | 'left' | 'right'
}

export function BotZone({ player, idx, bubbleDirection = 'up' }: BotZoneProps) {
  const currentPlayerIndex = useGameStore(s => s.gameState?.currentPlayerIndex ?? 0)
  const isDebugMode = useGameStore(s => s.isDebugMode)
  const playCards = useGameStore(s => s.playCards)
  const { pendingAce, setPendingAce, selectedCards, setSelectedCards } = useGameBoardContext()

  return (
    <div className="relative flex justify-center">
      <Bubble id={player.id} direction={bubbleDirection} />
      <PlayerZone
        player={player}
        isCurrentPlayer={currentPlayerIndex === idx}
        isHuman={false}
        isPreparing={false}
        cannotPlay={false}
        validMoves={[]}
        bestMove={null}
        selectedCardIds={[]}
        onCardClick={() => {}}
        onSwap={() => {}}
        isDebugMode={isDebugMode}
      />
      {pendingAce && !player.isFinished && (
        <button
          onClick={() => {
            playCards(selectedCards, player.id)
            setPendingAce(null)
            setSelectedCards([])
          }}
          className="absolute inset-0 flex items-center justify-center bg-red-500/40 hover:bg-red-500/60 rounded-lg border-2 border-red-400 transition-colors"
        >
          <span className="text-white font-bold text-sm drop-shadow">⚔ Attaquer</span>
        </button>
      )}
    </div>
  )
}
