import { useState } from 'react'
import type { Card, Player } from '@/features/game/utils/types'
import { GameCard } from './GameCard'
import { PlayerHeader } from '@/shared/PlayerHeader'
import { AnimatePresence, motion } from 'framer-motion'
import { useCardAnimation } from '@/features/game/contexts/CardAnimationContext'
import {
  getCardDims,
  CARD_W_DESKTOP,
  CARD_W_COMPACT,
} from '@/features/game/utils/cardDims'
import useIsCompactBoard from '@/features/game/hooks/useIsCompactBoard'

type CardStateResult = 'normal' | 'selected' | 'optimal' | 'chosen'
function cardState(
  card: Card,
  validMoves: Card[],
  bestMove: Card | null,
  selectedIds: string[]
): CardStateResult {
  if (selectedIds.includes(card.id)) return 'chosen'
  if (bestMove?.id === card.id) return 'optimal'
  if (validMoves.some((m) => m.id === card.id)) return 'selected'
  return 'normal'
}

interface PlayerZoneProps {
  player: Player
  isCurrentPlayer: boolean
  isHuman: boolean
  isPreparing: boolean
  cannotPlay: boolean
  validMoves: Card[]
  bestMove: Card | null
  selectedCardIds: string[]
  onCardClick: (card: Card) => void
  onSwap: (handCard: Card, visibleCard: Card) => void
  isDebugMode?: boolean
  profileUsername?: string
  profileAvatarUrl?: string | null
  profileTitle?: string | null
  turnBadgeSide?: 'left' | 'right' // côté du badge de tour en board compact
}

function FanRow({
  cards,
  isHidden,
  validMoves,
  bestMove,
  selectedIds,
  onCardClick,
}: {
  cards: Card[]
  isHidden: boolean
  validMoves: Card[]
  bestMove: Card | null
  selectedIds: string[]
  onCardClick: (c: Card) => void
}) {
  const { registerCardRef } = useCardAnimation()
  const isCompact = useIsCompactBoard()
  const dims = getCardDims(isCompact ? CARD_W_COMPACT : CARD_W_DESKTOP)
  const n = cards.length
  // Compact : éventail à plat (spread 0 → ni rotation ni translateY), ce qui
  // rend inutile la marge verticale qui absorbe le débord des cartes tournées.
  const spread = isCompact || n <= 1 ? 0 : Math.min(n * 6, 24)
  const vPadding = isCompact ? 0 : dims.fanVPadding
  const angles = cards.map((_, i) =>
    n <= 1 ? 0 : -spread / 2 + (spread / (n - 1)) * i
  )
  const overlap = dims.overlap
  const width =
    n <= 1
      ? dims.w + dims.fanPadding
      : (n - 1) * overlap + dims.w + dims.fanPadding
  return (
    <div
      className="relative"
      style={{ width, height: dims.h + vPadding }}
    >
      <AnimatePresence>
        {cards.map((card, i) => {
          const rot = angles[i] ?? 0
          const ty = Math.abs(rot) * 0.5
          return (
            <motion.div
              key={card.id}
              ref={(el) => registerCardRef(card.id, el)}
              className="absolute"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                left: i * overlap,
                rotate: rot,
                translateY: ty,
                transformOrigin: 'bottom center',
              }}
            >
              <GameCard
                card={isHidden ? null : card}
                state={
                  isHidden
                    ? 'hidden'
                    : cardState(card, validMoves, bestMove, selectedIds)
                }
                onClick={isHidden ? undefined : () => onCardClick(card)}
                width={dims.w}
                height={dims.h}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Badge "Ton Tour" / "Son tour". En overlay (board compact) il sort du flux,
// posé à côté du header (côté `side`) : la hauteur de la zone ne dépend plus
// du tour et le badge ne recouvre pas l'éventail de la main.
function TurnBadge({
  label,
  overlay,
  side,
}: {
  label: string
  overlay: boolean
  side: 'left' | 'right'
}) {
  const overlayClass = `absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none z-10 ${side === 'left' ? 'right-full mr-1' : 'left-full ml-1'}`
  return (
    <div
      className={`${overlay ? overlayClass : 'mb-1'} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide animate-pulse`}
      style={{
        background: 'hsl(var(--accent) / 0.15)',
        border: '1px solid hsl(var(--accent) / 0.6)',
        color: 'hsl(var(--accent))',
        fontFamily: 'var(--font-display)',
      }}
    >
      {label}
    </div>
  )
}

// Message d'aide contextuel. En overlay (board compact) il sort du flux et se
// place à droite de son parent (qui doit être `relative`) : ne pousse rien et
// ne recouvre aucune carte, ni le badge de tour posé au-dessus du header.
function ZoneHint({
  color,
  overlay,
  children,
}: {
  color: string
  overlay: boolean
  children: React.ReactNode
}) {
  return (
    <p
      className={
        overlay
          ? 'absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap text-[10px] pointer-events-none z-10'
          : 'text-[10px] mt-0.5'
      }
      style={{ color }}
    >
      {children}
    </p>
  )
}

export function PlayerZone({
  player,
  isCurrentPlayer,
  isHuman,
  isPreparing,
  cannotPlay,
  validMoves,
  bestMove,
  selectedCardIds,
  onCardClick,
  onSwap,
  isDebugMode = false,
  profileUsername,
  profileAvatarUrl,
  profileTitle,
  turnBadgeSide = 'right',
}: PlayerZoneProps) {
  const [pendingSwap, setPendingSwap] = useState<{
    card: Card
    zone: 'hand' | 'visible'
  } | null>(null)
  const handEmpty = player.hand.length === 0
  const visibleEmpty = player.visibleCards.length === 0
  const hiddenActive = !isPreparing && handEmpty && visibleEmpty

  const sortedHand = [...player.hand].sort((a, b) => a.value - b.value)
  const sortedVisible = [...player.visibleCards].sort(
    (a, b) => a.value - b.value
  )

  function handleHandClick(card: Card) {
    if (isPreparing) {
      if (pendingSwap?.zone === 'visible') {
        onSwap(card, pendingSwap.card)
        setPendingSwap(null)
      } else {
        setPendingSwap((prev) =>
          prev?.card.id === card.id ? null : { card, zone: 'hand' }
        )
      }
    } else {
      onCardClick(card)
    }
  }

  function handleVisibleClick(card: Card) {
    if (isPreparing) {
      if (pendingSwap?.zone === 'hand') {
        onSwap(pendingSwap.card, card)
        setPendingSwap(null)
      } else {
        setPendingSwap((prev) =>
          prev?.card.id === card.id ? null : { card, zone: 'visible' }
        )
      }
    } else if (!isPreparing && handEmpty) {
      onCardClick(card)
    }
  }

  const { registerCardRef } = useCardAnimation()
  const isCompact = useIsCompactBoard()
  const dims = getCardDims(isCompact ? CARD_W_COMPACT : CARD_W_DESKTOP)
  const tableGap = Math.round(dims.w * (4 / 56)) // 4 à 56px
  const tableVOffset = Math.round(dims.w * (8 / 56)) // 8 à 56px

  const tableCards = (
    <div className="relative flex" style={{ gap: tableGap }}>
      <AnimatePresence>
        {player.hiddenCards.map((c, i) => (
          <div key={c.id} className="relative">
            <motion.div
              ref={(el) => registerCardRef(c.id, el)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <GameCard
                card={isDebugMode ? c : null}
                state={
                  isDebugMode ? 'normal' : hiddenActive ? 'selected' : 'hidden'
                }
                onClick={hiddenActive ? () => onCardClick(c) : undefined}
                width={dims.w}
                height={dims.h}
              />
            </motion.div>
            {sortedVisible[i] && (
              <motion.div
                ref={(el) => registerCardRef(sortedVisible[i].id, el)}
                className="absolute"
                style={{ top: -tableVOffset, left: 0 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <GameCard
                  card={sortedVisible[i]}
                  state={
                    isPreparing
                      ? pendingSwap?.zone === 'hand'
                        ? 'selected'
                        : pendingSwap?.card.id === sortedVisible[i]?.id
                          ? 'chosen'
                          : 'normal'
                      : !isPreparing && handEmpty
                        ? cardState(
                            sortedVisible[i],
                            validMoves,
                            bestMove,
                            selectedCardIds
                          )
                        : 'normal'
                  }
                  onClick={() => handleVisibleClick(sortedVisible[i])}
                  width={dims.w}
                  height={dims.h}
                />
              </motion.div>
            )}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )

  if (!isHuman) {
    const displayHand = player.hand.slice(0, 5)
    const extra = player.hand.length - 5
    return (
      <div
        className={`flex flex-col items-center ${isCompact ? 'gap-0.5' : 'gap-1'}`}
      >
        {tableCards}
        {player.hand.length > 0 && (
          <div className="flex items-center">
            <FanRow
              cards={displayHand}
              isHidden={!isDebugMode}
              validMoves={[]}
              bestMove={null}
              selectedIds={[]}
              onCardClick={() => {}}
            />
            {extra > 0 && (
              <span className="text-white/60 text-xs ml-1">+{extra}</span>
            )}
          </div>
        )}
        <div className="relative flex flex-col items-center">
          {isCurrentPlayer && (
            <TurnBadge
              label="Son tour"
              overlay={isCompact}
              side={turnBadgeSide}
            />
          )}
          <PlayerHeader
            username={player.name}
            avatarUrl={null}
            activeTitle={player.title ?? null}
            compact={true}
            dense={isCompact}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center overflow-visible ${isCompact ? 'gap-0.5' : 'gap-1'}`}
    >
      <div
        className={`flex flex-col items-center gap-0.5 ${isCompact ? 'relative' : ''}`}
      >
        {!isCompact && (
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: 'hsl(var(--foreground-muted))',
              letterSpacing: '0.08em',
            }}
          >
            Sur la table
          </span>
        )}
        {tableCards}
        {!isPreparing &&
          handEmpty &&
          visibleEmpty &&
          player.hiddenCards.length > 0 && (
            <ZoneHint color="hsl(var(--warning))" overlay={isCompact}>
              Retournez une carte cachée
            </ZoneHint>
          )}
        {!isPreparing && handEmpty && !visibleEmpty && (
          <ZoneHint color="hsl(var(--info))" overlay={isCompact}>
            Jouez vos cartes visibles
          </ZoneHint>
        )}
      </div>
      <div
        className={`flex flex-col items-center gap-0.5 overflow-visible ${isCompact ? 'relative' : 'px-3 py-1 rounded-lg'} ${cannotPlay ? 'opacity-40 pointer-events-none' : ''}`}
        style={
          isCompact
            ? undefined
            : {
                background: 'hsl(var(--background-dark))',
                border: '1px solid hsl(var(--border))',
              }
        }
      >
        {!isCompact && (
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{
              color: 'hsl(var(--foreground-muted))',
              letterSpacing: '0.08em',
            }}
          >
            En main
          </span>
        )}
        <div
          className="overflow-visible"
          style={{ transformOrigin: 'center bottom' }}
        >
          <FanRow
            cards={sortedHand}
            isHidden={false}
            validMoves={validMoves}
            bestMove={bestMove}
            selectedIds={
              isPreparing && pendingSwap?.zone === 'hand'
                ? [pendingSwap.card.id]
                : selectedCardIds
            }
            onCardClick={handleHandClick}
          />
        </div>
        {isPreparing && pendingSwap && (
          <ZoneHint color="hsl(var(--accent))" overlay={isCompact}>
            {pendingSwap.zone === 'hand'
              ? 'Cliquez une carte visible'
              : 'Cliquez une carte en main'}
          </ZoneHint>
        )}
      </div>
      <div className="relative flex flex-col items-center">
        {isCurrentPlayer && (
          <TurnBadge
            label="Ton Tour"
            overlay={isCompact}
            side={turnBadgeSide}
          />
        )}
        <PlayerHeader
          username={profileUsername ?? player.name}
          avatarUrl={profileAvatarUrl ?? null}
          activeTitle={profileTitle ?? null}
          compact={true}
          dense={isCompact}
        />
      </div>
    </div>
  )
}
