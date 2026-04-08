import { create } from 'zustand';
import type { BotDifficulty, Card, GameState, Player } from '@/features/game/utils/types';
import {
  initGame,
  isValidPlay,
  applyPlay,
  getBotMove,
} from '@/features/game/utils/cardRules';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** True when the player at currentPlayerIndex is human (not a bot). */
function deriveIsPlayerTurn(gs: GameState | null): boolean {
  if (!gs) return false;
  const current = gs.players[gs.currentPlayerIndex];
  return current !== undefined && !current.isBot;
}

function makeHumanPlayer(name: string): Player {
  return {
    id: 'human',
    name,
    isBot: false,
    isReady: false,
    hand: [],
    visibleCards: [],
    hiddenCards: [],
    stats: { gamesPlayed: 0, placements: [0, 0, 0, 0], achievements: [] },
  };
}

function makeBotPlayer(index: number): Player {
  return {
    id: `bot-${index}`,
    name: `Bot ${index}`,
    isBot: true,
    isReady: true, // bots are always ready during PREPARATION
    hand: [],
    visibleCards: [],
    hiddenCards: [],
    stats: { gamesPlayed: 0, placements: [0, 0, 0, 0], achievements: [] },
  };
}

/** Total cards remaining for a player across all zones. */
function totalCards(p: Player): number {
  return p.hand.length + p.visibleCards.length + p.hiddenCards.length;
}

// ── Store definition ──────────────────────────────────────────────────────────

interface GameStore {
  gameState: GameState | null;
  difficulty: BotDifficulty;
  isPlayerTurn: boolean;

  startGame: (playerName: string, difficulty: BotDifficulty) => void;
  playCards: (cards: Card[], targetId?: string | null) => void;
  swapCard: (handCard: Card, visibleCard: Card) => void;
  setReady: () => void;
  triggerBotTurn: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // ── Initial state ───────────────────────────────────────────────────────────
  gameState: null,
  difficulty: 'medium',
  isPlayerTurn: false,

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Starts a new game.
   *
   * Creates a human player and three bot players, calls `initGame` to shuffle
   * and deal a fresh deck, then stores the resulting GameState.
   * The game starts in PREPARATION phase so the human can swap cards.
   */
  startGame: (playerName, difficulty) => {
    const players: Player[] = [
      makeHumanPlayer(playerName),
      makeBotPlayer(1),
      makeBotPlayer(2),
      makeBotPlayer(3),
    ];
    const gs = initGame(players, { mode: 'patriarchal' });
    set({ gameState: gs, difficulty, isPlayerTurn: deriveIsPlayerTurn(gs) });
  },

  /**
   * Plays one or more cards from the human player's active zone.
   *
   * Calls `isValidPlay` first — does nothing if the play is illegal (the UI
   * is responsible for showing feedback in that case).
   * If valid, calls `applyPlay` and updates the store with the new GameState.
   *
   * @param cards    The card(s) to play (same rank, from the active zone).
   * @param targetId Player id to attack when an Ace is played; null otherwise.
   */
  playCards: (cards, targetId = null) => {
    const gs = get().gameState;
    if (!gs) return;
    if (!isValidPlay(cards, gs)) return;
    const next = applyPlay(cards, targetId ?? null, gs);
    set({ gameState: next, isPlayerTurn: deriveIsPlayerTurn(next) });
  },

  /**
   * Swaps a card between the human player's hand and their visible zone.
   *
   * Only valid during the PREPARATION phase. The human player is identified
   * by `isBot === false`. Both cards must already belong to the human player.
   * Does nothing if the phase is wrong or either card cannot be found.
   *
   * @param handCard    Card currently in the human's hand to move face-up.
   * @param visibleCard Card currently face-up to move into the human's hand.
   */
  swapCard: (handCard, visibleCard) => {
    const gs = get().gameState;
    if (!gs || gs.phase !== 'PREPARATION') return;

    const humanIdx = gs.players.findIndex(p => !p.isBot);
    if (humanIdx === -1) return;
    const human = gs.players[humanIdx];

    // Verify ownership
    if (!human.hand.some(c => c.id === handCard.id)) return;
    if (!human.visibleCards.some(c => c.id === visibleCard.id)) return;

    const newHand = human.hand.map(c => (c.id === handCard.id ? visibleCard : c));
    const newVisible = human.visibleCards.map(c => (c.id === visibleCard.id ? handCard : c));

    const updatedHuman: Player = { ...human, hand: newHand, visibleCards: newVisible };
    const newPlayers = gs.players.map((p, i) => (i === humanIdx ? updatedHuman : p));
    const next: GameState = { ...gs, players: newPlayers };
    set({ gameState: next, isPlayerTurn: deriveIsPlayerTurn(next) });
  },

  /**
   * Marks the human player as ready and transitions to PLAYING if all players
   * are ready.
   *
   * Bots are pre-marked as ready when created. Calling this action flips the
   * human's `isReady` flag; if every player is now ready the phase advances
   * from PREPARATION to PLAYING.
   */
  setReady: () => {
    const gs = get().gameState;
    if (!gs || gs.phase !== 'PREPARATION') return;

    const newPlayers = gs.players.map(p => (p.isBot ? p : { ...p, isReady: true }));
    const allReady = newPlayers.every(p => p.isReady);
    const next: GameState = {
      ...gs,
      players: newPlayers,
      phase: allReady ? 'PLAYING' : gs.phase,
    };
    set({ gameState: next, isPlayerTurn: deriveIsPlayerTurn(next) });
  },

  /**
   * Executes one bot turn for the currently active bot player.
   *
   * Should be invoked by the UI after a short delay (600 ms for easy,
   * 1000 ms for medium, 1500 ms for hard) when `isPlayerTurn` is false.
   *
   * Calls `getBotMove` to choose which cards to play, then validates the
   * play with `isValidPlay` as a safety guard before calling `applyPlay`.
   * For Ace plays, automatically targets the opponent with the fewest cards.
   * Does nothing if the current player is human or no valid move is found.
   */
  triggerBotTurn: () => {
    const { gameState: gs, difficulty } = get();
    if (!gs) return;

    const bot = gs.players[gs.currentPlayerIndex];
    if (!bot || !bot.isBot) return;

    const botCards = getBotMove(bot, gs, difficulty);
    if (botCards.length === 0) return; // no valid move — caller handles take-pile

    // Safety: confirm the chosen play is still valid (guards async race conditions)
    if (!isValidPlay(botCards, gs)) return;

    // For Ace: target the opponent with the fewest remaining cards
    let targetId: string | null = null;
    if (botCards[0].rank === 'A') {
      const others = gs.players.filter(p => p.id !== bot.id && totalCards(p) > 0);
      if (others.length > 0) {
        targetId = others.reduce((t, p) =>
          totalCards(p) < totalCards(t) ? p : t,
        ).id;
      }
    }

    const next = applyPlay(botCards, targetId, gs);
    set({ gameState: next, isPlayerTurn: deriveIsPlayerTurn(next) });
  },

  /**
   * Resets the store to its initial state, discarding the current game.
   *
   * Called when returning to the lobby or starting over. Does not call any
   * engine function — just nulls out `gameState`.
   */
  resetGame: () => {
    set({ gameState: null, isPlayerTurn: false });
  },
}));
