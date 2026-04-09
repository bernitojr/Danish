import { useEffect, useRef, useState } from 'react';
import type { GameState } from '@/features/game/utils/types';

const SUIT = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' } as const;

export function useGameLog(gameState: GameState | null, isPlayerTurn: boolean) {
  const [entries, setEntries] = useState<string[]>([]);
  const push = (m: string) => setEntries(p => [m, ...p].slice(0, 6));
  const prevGs = useRef<GameState | null>(null);

  useEffect(() => {
    const prev = prevGs.current;
    prevGs.current = gameState;
    if (!prev || !gameState || gameState.phase !== 'PLAYING') return;
    const who = prev.players[prev.currentPlayerIndex];
    if (!who?.isBot) return;

    if (gameState.pile.length > prev.pile.length) {
      const top = gameState.pile.at(-1);
      if (top) push(`${who.name} joue ${top.rank}${SUIT[top.suit as keyof typeof SUIT]}`);
    } else if (prev.pile.length > 0 && gameState.pile.length === 0) {
      push(gameState.discard.length > prev.discard.length
        ? `${who.name} coupe !`
        : `${who.name} ramasse (${prev.pile.length})`);
    }

    if (gameState.turnContext.attackTarget &&
        gameState.turnContext.attackTarget !== prev.turnContext.attackTarget) {
      const t = gameState.players.find(p => p.id === gameState.turnContext.attackTarget);
      if (t) push(`${who.name} attaque ${t.name} !`);
    }
  }, [gameState]);

  useEffect(() => { if (isPlayerTurn) push('→ À toi de jouer !'); }, [isPlayerTurn]);

  return { entries, push };
}
