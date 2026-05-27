import { useState } from 'react';
import type { Card, Player } from '@/features/game/utils/types';
import { GameCard } from './GameCard';
import { PlayerHeader } from '@/shared/PlayerHeader';

type CardStateResult = 'normal' | 'selected' | 'optimal' | 'chosen';
function cardState(card: Card, validMoves: Card[], bestMove: Card | null, selectedIds: string[]): CardStateResult {
  if (selectedIds.includes(card.id)) return 'chosen';
  if (bestMove?.id === card.id) return 'optimal';
  if (validMoves.some(m => m.id === card.id)) return 'selected';
  return 'normal';
}

interface PlayerZoneProps {
  player: Player;
  isCurrentPlayer: boolean;
  isHuman: boolean;
  isPreparing: boolean;
  cannotPlay: boolean;
  validMoves: Card[];
  bestMove: Card | null;
  selectedCardIds: string[];
  onCardClick: (card: Card) => void;
  onSwap: (handCard: Card, visibleCard: Card) => void;
  isDebugMode?: boolean;
  profileUsername?: string;
  profileAvatarUrl?: string | null;
  profileTitle?: string | null;
}

function FanRow({ cards, isHidden, validMoves, bestMove, selectedIds, onCardClick }: {
  cards: Card[]; isHidden: boolean; validMoves: Card[]; bestMove: Card | null;
  selectedIds: string[]; onCardClick: (c: Card) => void;
}) {
  const n = cards.length;
  const spread = n <= 1 ? 0 : Math.min(n * 6, 24);
  const angles = cards.map((_, i) => n <= 1 ? 0 : -spread / 2 + (spread / (n - 1)) * i);
  const overlap = 28;
  const width = n <= 1 ? 64 : (n - 1) * overlap + 64;
  return (
    <div className="relative" style={{ width, height: 110 }}>
      {cards.map((card, i) => {
        const rot = angles[i] ?? 0;
        const ty = Math.abs(rot) * 0.5;
        return (
          <div key={card.id} className="absolute"
            style={{ left: i * overlap, transform: `rotate(${rot}deg) translateY(${ty}px)`, transformOrigin: 'bottom center' }}>
            <GameCard card={isHidden ? null : card}
              state={isHidden ? 'hidden' : cardState(card, validMoves, bestMove, selectedIds)}
              onClick={isHidden ? undefined : () => onCardClick(card)} />
          </div>
        );
      })}
    </div>
  );
}

export function PlayerZone({ player, isCurrentPlayer, isHuman, isPreparing, cannotPlay, validMoves, bestMove, selectedCardIds, onCardClick, onSwap, isDebugMode = false, profileUsername, profileAvatarUrl, profileTitle }: PlayerZoneProps) {
  const [pendingSwap, setPendingSwap] = useState<{ card: Card; zone: 'hand' | 'visible' } | null>(null);
  const handEmpty = player.hand.length === 0;
  const visibleEmpty = player.visibleCards.length === 0;
  const hiddenActive = !isPreparing && handEmpty && visibleEmpty;

  // UX 1 — sort by value ascending (weakest left, strongest right)
  const sortedHand = [...player.hand].sort((a, b) => a.value - b.value);
  const sortedVisible = [...player.visibleCards].sort((a, b) => a.value - b.value);

  function handleHandClick(card: Card) {
    if (isPreparing) {
      if (pendingSwap?.zone === 'visible') { onSwap(card, pendingSwap.card); setPendingSwap(null); }
      else { setPendingSwap(prev => prev?.card.id === card.id ? null : { card, zone: 'hand' }); }
    } else { onCardClick(card); }
  }
  function handleVisibleClick(card: Card) {
    if (isPreparing) {
      if (pendingSwap?.zone === 'hand') { onSwap(pendingSwap.card, card); setPendingSwap(null); }
      else { setPendingSwap(prev => prev?.card.id === card.id ? null : { card, zone: 'visible' }); }
    } else if (!isPreparing && handEmpty) { onCardClick(card); }
  }

  const tableCards = (
    <div className="relative flex gap-1">
      {player.hiddenCards.map((c, i) => (
        <div key={c.id} className="relative">
          <GameCard card={isDebugMode ? c : null} state={isDebugMode ? 'normal' : (hiddenActive ? 'selected' : 'hidden')}
            onClick={hiddenActive ? () => onCardClick(c) : undefined} />
          {sortedVisible[i] && (
            <div className="absolute -top-2 left-0">
              <GameCard card={sortedVisible[i]}
                state={isPreparing ? (pendingSwap?.zone === 'hand' ? 'selected' : pendingSwap?.card.id === sortedVisible[i]?.id ? 'chosen' : 'normal') : (!isPreparing && handEmpty ? cardState(sortedVisible[i], validMoves, bestMove, selectedCardIds) : 'normal')}
                onClick={() => handleVisibleClick(sortedVisible[i])} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (!isHuman) {
    // UX 5 — cap displayed bot hand at 5 cards, show "+N" badge for extras
    const displayHand = player.hand.slice(0, 5);
    const extra = player.hand.length - 5;
    return (
      <div className="flex flex-col items-center gap-1">
        {tableCards}
        {player.hand.length > 0 && (
          <div className="flex items-center">
            <FanRow cards={displayHand} isHidden={!isDebugMode} validMoves={[]} bestMove={null} selectedIds={[]} onCardClick={() => {}} />
            {extra > 0 && <span className="text-white/60 text-xs ml-1">+{extra}</span>}
          </div>
        )}
        <div className="relative flex flex-col items-center">
          {isCurrentPlayer && (
            <div
              className="mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide animate-pulse"
              style={{
                background: 'hsl(var(--accent) / 0.15)',
                border: '1px solid hsl(var(--accent) / 0.6)',
                color: 'hsl(var(--accent))',
                fontFamily: 'var(--font-display)',
              }}
            >
              ⏳ En jeu
            </div>
          )}
          <PlayerHeader
            username={player.name}
            avatarUrl={null}
            activeTitle={player.title ?? null}
            compact={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 overflow-visible">
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] uppercase tracking-wide" style={{ color: 'hsl(var(--foreground-muted))', letterSpacing: '0.08em' }}>Sur la table</span>
        {tableCards}
        {!isPreparing && handEmpty && visibleEmpty && player.hiddenCards.length > 0 && (
          <p className="text-[10px] mt-0.5" style={{ color: 'hsl(var(--warning))' }}>Retournez une carte cachée</p>
        )}
        {!isPreparing && handEmpty && !visibleEmpty && (
          <p className="text-[10px] mt-0.5" style={{ color: 'hsl(var(--info))' }}>Jouez vos cartes visibles</p>
        )}
      </div>
      <div
        className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg overflow-visible ${cannotPlay ? 'opacity-40 pointer-events-none' : ''}`}
        style={{ background: 'hsl(var(--background-dark))', border: '1px solid hsl(var(--border))' }}
      >
        <span className="text-[10px] uppercase tracking-wide" style={{ color: 'hsl(var(--foreground-muted))', letterSpacing: '0.08em' }}>En main</span>
        <div className="overflow-visible" style={{ transformOrigin: 'center bottom' }}>
          <FanRow cards={sortedHand} isHidden={false} validMoves={validMoves} bestMove={bestMove} selectedIds={isPreparing && pendingSwap?.zone === 'hand' ? [pendingSwap.card.id] : selectedCardIds} onCardClick={handleHandClick} />
        </div>
        {isPreparing && pendingSwap && (
          <p className="text-[10px] mt-0.5" style={{ color: 'hsl(var(--accent))' }}>
            {pendingSwap.zone === 'hand' ? 'Cliquez une carte visible' : 'Cliquez une carte en main'}
          </p>
        )}
      </div>
      <div className="relative flex flex-col items-center">
        {isCurrentPlayer && (
          <div
            className="mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide animate-pulse"
            style={{
              background: 'hsl(var(--accent) / 0.15)',
              border: '1px solid hsl(var(--accent) / 0.6)',
              color: 'hsl(var(--accent))',
              fontFamily: 'var(--font-display)',
            }}
          >
            ▶ À toi de jouer
          </div>
        )}
        <PlayerHeader
          username={profileUsername ?? player.name}
          avatarUrl={profileAvatarUrl ?? null}
          activeTitle={profileTitle ?? player.title ?? null}
        />
      </div>
    </div>
  );
}
