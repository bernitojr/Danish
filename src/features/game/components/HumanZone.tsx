import { motion } from 'framer-motion'
import { useGameStore } from '@/features/game/store/gameStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePublicProfile } from '@/features/profil/hooks/usePublicProfile'
import { useGameBoardContext } from '@/features/game/contexts/GameBoardContext'
import { useCardAnimation } from '@/features/game/contexts/CardAnimationContext'
import useIsCompactBoard from '@/features/game/hooks/useIsCompactBoard'
import { Bubble } from './Bubble'
import { PlayerZone } from './PlayerZone'

export function HumanZone() {
  const gameState = useGameStore((s) => s.gameState)
  const isDebugMode = useGameStore((s) => s.isDebugMode)
  const swapCard = useGameStore((s) => s.swapCard)
  const passTurn = useGameStore((s) => s.passTurn)
  const pile = useGameStore((s) => s.gameState?.pile ?? [])
  const { user, profile } = useAuthStore()
  const { data: publicProfile } = usePublicProfile(user?.id ?? null)
  const activeTitle = publicProfile
    ? (publicProfile.allTitles.find(
        (t) => t.id === publicProfile.active_title_id
      )?.name ?? null)
    : null

  const {
    selectedCards,
    pendingAce,
    setPendingAce,
    validMoves,
    bestMove,
    cannotPlay,
    canPassTurn,
    invalidMsg,
    handleCardClick,
    handleTakePile,
    isPreparing,
    attackTarget,
  } = useGameBoardContext()
  const { registerPlayerRef } = useCardAnimation()
  const isCompact = useIsCompactBoard()

  if (!gameState) return null
  const human = gameState.players[0]
  const currentPlayerIndex = gameState.currentPlayerIndex
  if (!human) return null

  const isBeingAttacked = attackTarget === human.id

  // Actions conditionnelles : leur présence dépend de l'état de jeu.
  const actionButtons = (
    <>
      {cannotPlay && pile.length > 0 && (
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg z-50 relative"
          style={{
            background: 'hsl(var(--delete))',
            color: 'hsl(var(--primary-foreground))',
            boxShadow: 'hsl(var(--delete) / 0.25) 0 4px 14px',
          }}
          onClick={handleTakePile}
        >
          Ramasser la pile
        </button>
      )}
      {canPassTurn && (
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg z-50 relative"
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
        <div className="px-3 py-1 bg-red-900/80 text-red-200 text-xs rounded-full z-50 relative">
          {invalidMsg}
        </div>
      )}
    </>
  )
  // Compact : deux lignes, largeur fixe, et seule "Annuler" capte les taps →
  // ne bloque pas le bouton "⚔ Attaquer" du bot voisin.
  const aceChooser = pendingAce && (
    <div
      className={
        isCompact
          ? 'w-[140px] px-2.5 py-1.5 bg-black/60 rounded-lg border border-red-400/60 flex flex-col items-center gap-1 pointer-events-none'
          : 'px-4 py-2 bg-black/60 rounded-lg border border-red-400/60 flex items-center gap-3'
      }
    >
      <span
        className={
          isCompact
            ? 'text-red-300 text-xs font-medium text-center leading-tight'
            : 'text-red-300 text-sm font-medium'
        }
      >
        Choisissez un joueur à attaquer
      </span>
      <button
        className={
          isCompact
            ? 'px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded pointer-events-auto'
            : 'px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded'
        }
        onClick={() => setPendingAce(null)}
      >
        Annuler
      </button>
    </div>
  )

  return (
    <motion.div
      ref={(el) => registerPlayerRef(human.id, el)}
      className="absolute left-1/2 z-20 flex flex-col items-center gap-2"
      style={{ bottom: 8, x: '-50%' }}
      animate={
        isBeingAttacked
          ? {
              x: [
                '-50%',
                'calc(-50% - 12px)',
                'calc(-50% + 12px)',
                'calc(-50% - 10px)',
                'calc(-50% + 10px)',
                'calc(-50% - 6px)',
                'calc(-50% + 6px)',
                '-50%',
              ],
            }
          : { x: '-50%' }
      }
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {isCompact ? (
        // Compact : colonne hors flux à gauche de la zone → la hauteur de
        // HumanZone ne dépend plus des actions affichées.
        // w-max : sans largeur explicite, un absolute en right-full se réduit à
        // sa largeur min-content (boutons repliés sur plusieurs lignes).
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-max flex flex-col items-end gap-2">
          {actionButtons}
          {aceChooser}
        </div>
      ) : (
        actionButtons
      )}
      <Bubble id="human" direction="up" />
      <PlayerZone
        player={human}
        isCurrentPlayer={currentPlayerIndex === 0}
        isHuman={true}
        isPreparing={isPreparing}
        cannotPlay={cannotPlay}
        validMoves={pendingAce ? [] : validMoves}
        bestMove={pendingAce ? null : bestMove}
        selectedCardIds={selectedCards.map((c) => c.id)}
        onCardClick={handleCardClick}
        onSwap={swapCard}
        isDebugMode={isDebugMode}
        profileUsername={profile?.username}
        profileAvatarUrl={profile?.avatar_url}
        profileTitle={activeTitle}
      />
      {!isCompact && aceChooser}
    </motion.div>
  )
}
