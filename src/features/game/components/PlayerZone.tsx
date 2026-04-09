import { useState } from 'react';
import type { Card, Player } from '@/features/game/utils/types';
import { GameCard } from './GameCard';

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
}

type CardStateResult = 'normal' | 'selected' | 'optimal' | 'chosen';
function cardState(card: Card, validMoves: Card[], bestMove: Card | null, selectedIds: string[]): CardStateResult {
  if (selectedIds.includes(card.id)) return 'chosen';
  if (bestMove?.id === card.id) return 'optimal';
  if (validMoves.some(m => m.id === card.id)) return 'selected';
  return 'normal';
}

export function PlayerZone({
  player, isCurrentPlayer, isHuman, isPreparing, cannotPlay, validMoves, bestMove, selectedCardIds, onCardClick, onSwap,
}: PlayerZoneProps) {
  const [pendingSwap, setPendingSwap] = useState<Card | null>(null);

  const handEmpty = player.hand.length === 0;
  const visibleEmpty = player.visibleCards.length === 0;
  const hiddenActive = !isPreparing && handEmpty && visibleEmpty;

  function handleHandClick(card: Card) {
    if (isPreparing) { setPendingSwap(prev => (prev?.id === card.id ? null : card)); }
    else { onCardClick(card); }
  }
  function handleVisibleClick(card: Card) {
    if (isPreparing && pendingSwap) { onSwap(pendingSwap, card); setPendingSwap(null); }
    else if (!isPreparing && handEmpty) { onCardClick(card); }
  }
  function handleHiddenClick(card: Card) {
    if (hiddenActive) onCardClick(card);
  }

  if (!isHuman) {
    const w = Math.max(player.hiddenCards.length, 1) * 20 + 44;
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">{player.name[0]}</div>
          <span className="text-white/80 text-xs">{player.name}</span>
          {isCurrentPlayer && <span className="text-yellow-400 text-xs animate-pulse">▶</span>}
        </div>
        <div className="relative h-[89px]" style={{ width: w }}>
          {player.hiddenCards.map((c, i) => (
            <div key={c.id} className="absolute" style={{ left: i * 20 }}><GameCard card={null} state="hidden" /></div>
          ))}
          {player.visibleCards.map((c, i) => (
            <div key={c.id} className="absolute" style={{ left: i * 20, top: -4 }}><GameCard card={c} state="normal" /></div>
          ))}
        </div>
        {player.hand.length > 0 && (
          <div className="px-2 py-0.5 bg-white/10 rounded text-white/60 text-xs">{player.hand.length} en main</div>
        )}
      </div>
    );
  }

  // Human zone
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">{player.name[0]}</div>
        <span className="text-white text-sm font-medium">{player.name}</span>
        {isCurrentPlayer && <span className="text-yellow-400 text-xs font-semibold animate-pulse">▶</span>}
      </div>

      {/* Table cards */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-white/40 text-[10px] uppercase tracking-wide">Sur la table</span>
        <div className="relative flex gap-1">
          {player.hiddenCards.map((c, i) => (
            <div key={c.id} className="relative">
              <GameCard
                card={null}
                state={hiddenActive ? 'selected' : 'hidden'}
                onClick={hiddenActive ? () => handleHiddenClick(c) : undefined}
              />
              {player.visibleCards[i] && (
                <div className="absolute -top-2 left-0">
                  <GameCard
                    card={player.visibleCards[i]}
                    state={isPreparing && pendingSwap ? 'selected' : !isPreparing && handEmpty ? cardState(player.visibleCards[i], validMoves, bestMove, selectedCardIds) : 'normal'}
                    onClick={() => handleVisibleClick(player.visibleCards[i])}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {!isPreparing && handEmpty && visibleEmpty && player.hiddenCards.length > 0 && (
          <p className="text-orange-300 text-[10px] mt-0.5">Retournez une carte cachée</p>
        )}
        {!isPreparing && handEmpty && !visibleEmpty && (
          <p className="text-blue-300 text-[10px] mt-0.5">Jouez vos cartes visibles</p>
        )}
      </div>

      {/* Hand */}
      <div className="flex flex-col items-center gap-1 px-3 py-2 bg-black/30 rounded-lg border border-white/10">
        <span className="text-white/40 text-[10px] uppercase tracking-wide">En main</span>
        <div className={`flex gap-1 ${cannotPlay ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}>
          {player.hand.map(card => (
            <GameCard key={card.id} card={card}
              state={isPreparing && pendingSwap?.id === card.id ? 'selected' : cardState(card, validMoves, bestMove, selectedCardIds)}
              onClick={() => handleHandClick(card)} />
          ))}
        </div>
        {isPreparing && pendingSwap && (
          <p className="text-yellow-300 text-[10px] mt-0.5">Cliquez une carte visible pour échanger</p>
        )}
      </div>
    </div>
  );
}
