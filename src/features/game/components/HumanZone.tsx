import { useGameStore } from '@/features/game/store/gameStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePublicProfile } from '@/features/profil/hooks/usePublicProfile'
import { useGameBoardContext } from '@/features/game/contexts/GameBoardContext'
import { Bubble } from './Bubble'
import { PlayerZone } from './PlayerZone'

export function HumanZone() {
  const gameState = useGameStore(s => s.gameState)
  const isDebugMode = useGameStore(s => s.isDebugMode)
  const swapCard = useGameStore(s => s.swapCard)
  const { user, profile } = useAuthStore()
  const { data: publicProfile } = usePublicProfile(user?.id ?? null)
  const activeTitle = publicProfile
    ? (publicProfile.allTitles.find(t => t.id === publicProfile.active_title_id)?.name ?? null)
    : null

  const {
    selectedCards,
    pendingAce,
    setPendingAce,
    validMoves,
    bestMove,
    cannotPlay,
    handleCardClick,
    isPreparing,
  } = useGameBoardContext()

  if (!gameState) return null
  const human = gameState.players[0]
  const currentPlayerIndex = gameState.currentPlayerIndex
  if (!human) return null

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      style={{ bottom: 8 }}
    >
      <Bubble id="human" direction="up" />
      <PlayerZone
        player={human}
        isCurrentPlayer={currentPlayerIndex === 0}
        isHuman={true}
        isPreparing={isPreparing}
        cannotPlay={cannotPlay}
        validMoves={pendingAce ? [] : validMoves}
        bestMove={pendingAce ? null : bestMove}
        selectedCardIds={selectedCards.map(c => c.id)}
        onCardClick={handleCardClick}
        onSwap={swapCard}
        isDebugMode={isDebugMode}
        profileUsername={profile?.username}
        profileAvatarUrl={profile?.avatar_url}
        profileTitle={activeTitle}
      />
      {pendingAce && (
        <div className="px-4 py-2 bg-black/60 rounded-lg border border-red-400/60 flex items-center gap-3">
          <span className="text-red-300 text-sm font-medium">
            Choisissez un joueur à attaquer
          </span>
          <button
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded"
            onClick={() => setPendingAce(null)}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
