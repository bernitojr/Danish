import type { Card, GameState, Player, RulesConfig, TurnContext } from '@/features/game/utils/types';

// Ranks whose face value is ≤ 7 — the only ranks legal under the 7 rule.
// 10 is NOT allowed under the 7 rule (handled explicitly in the 10 branch).
const BELOW_7_RANKS = new Set<Card['rank']>(['2', '3', '4', '5', '6', '7']);

// Ranks exempt from Jack's "must play a double" obligation.
// 10 is also exempt but is handled before this check.
const JACK_EXCEPTION_RANKS = new Set<Card['rank']>(['2', '3', 'J']);

/**
 * Returns the effective value of a card given the current rules config.
 * Q and K swap values between patriarchal and matriarchal modes;
 * all other cards return their fixed value.
 */
export function getEffectiveValue(card: Card, config: RulesConfig): number {
  if (card.rank === 'Q') return config.mode === 'matriarchal' ? 10 : 9;
  if (card.rank === 'K') return config.mode === 'matriarchal' ? 9 : 10;
  return card.value;
}

/**
 * Returns true when `cards` is a legal play given the current game state.
 *
 * Priority order — first matching branch wins and returns immediately:
 *   1. 10           → valid except after a 7 or wrong suit under 6 rule
 *   2. mustPlayDouble (Jack rule)
 *   3. mustPlayBelow7 (Seven rule)
 *   4. mustFollowSuit (Six rule)
 *   5. Empty pile
 *   6. Default value comparison
 *
 * Pure function — never mutates state.
 */
export function isValidPlay(cards: Card[], state: GameState): boolean {
  if (cards.length === 0) return false;

  // Playing N identical cards is always allowed — verify all share the same rank.
  const rank = cards[0].rank;
  if (!cards.every(c => c.rank === rank)) return false;

  const card = cards[0];
  const { turnContext, pile, config } = state;

  // ── 1. 10 ────────────────────────────────────────────────────────────────
  // 10 cuts the pile and overrides every constraint, with two exceptions:
  //   a) forbidden after a 7 (mustPlayBelow7)
  //   b) forbidden after a 6 if the 10 does not match the required suit
  if (rank === '10') {
    if (turnContext.mustPlayBelow7) return false;
    if (turnContext.mustFollowSuit !== null && card.suit !== turnContext.mustFollowSuit) return false;
    return true;
  }

  // ── 2. Jack rule — must play a double ────────────────────────────────────
  // 2, 3 and J satisfy the obligation as singles; all other ranks require N ≥ 2.
  if (turnContext.mustPlayDouble) {
    if (!JACK_EXCEPTION_RANKS.has(rank) && cards.length < 2) return false;
  }

  // ── 3. Seven rule — must play ≤ 7 ────────────────────────────────────────
  // Only face-value ≤ 7 ranks are legal. Ace is explicitly forbidden by the rules.
  if (turnContext.mustPlayBelow7) {
    if (!BELOW_7_RANKS.has(rank)) return false;
  }

  // ── 4. Six rule — must follow suit and play higher ────────────────────────
  // Another 6 (any suit) always satisfies the constraint.
  // Specials 2, 3 of the SAME suit are valid (effect applies); wrong suit → invalid.
  // All other cards must match the required suit AND beat mustFollowAboveValue.
  if (turnContext.mustFollowSuit !== null) {
    const requiredSuit = turnContext.mustFollowSuit;
    if (rank === '6') {
      // Another 6 of any suit is valid — fall through to remaining checks
    } else if (rank === '2' || rank === '3') {
      if (card.suit !== requiredSuit) return false;
      // Same-suit 2/3: valid — fall through
    } else {
      if (card.suit !== requiredSuit) return false;
      const gateValue = turnContext.mustFollowAboveValue ?? 0;
      if (getEffectiveValue(card, config) <= gateValue) return false;
    }
  }

  // ── 5. Empty pile ─────────────────────────────────────────────────────────
  // 4 cannot open a fresh pile (after 10 cuts or at game start).
  // After a 2 reset, pile.length > 0 → this branch is never reached, 4 is valid.
  if (pile.length === 0) {
    return rank !== '4';
  }

  // ── 6. Default value comparison ───────────────────────────────────────────
  // 3 copies the effective top of pile — it carries no value of its own and
  // therefore cannot be gated by a value comparison.
  if (rank === '3') return true;

  // Cards may equal or beat the effective pile top (>= not strict >).
  // lastEffectiveCard is null after a 2 reset (effective value 0),
  // which allows 4 (value 1) and any higher card to follow.
  const effectiveValue = turnContext.lastEffectiveCard
    ? getEffectiveValue(turnContext.lastEffectiveCard, config)
    : 0;
  return getEffectiveValue(card, config) >= effectiveValue;
}

// ── Cleared context — used after any cut ──────────────────────────────────────
const CLEARED_CONTEXT: TurnContext = {
  mustPlayDouble: false,
  mustFollowSuit: null,
  mustFollowAboveValue: null,
  mustPlayBelow7: false,
  lastEffectiveCard: null,
  consecutiveSameValue: 0,
  lastPlayedValue: null,
  skippedPlayers: 0,
  attackTarget: null,
};

/**
 * Applies a validated play and returns the next GameState.
 *
 * Responsibilities (in order):
 *   1. Remove played cards from the current player's zones (hand → visible → hidden)
 *   2. Add cards to pile
 *   3. Detect auto-cut (4-of-a-kind) or 10 cut — move pile to discard
 *   4. Compute new TurnContext based on the card played
 *   5. Replenish hand from deck (up to 3 cards)
 *   6. Detect if current player has finished
 *   7. Advance currentPlayerIndex (same for cuts, attacked player for Ace,
 *      skip N for 8s, +1 otherwise)
 *
 * Pure function — never mutates state or arguments.
 */
export function applyPlay(
  cards: Card[],
  targetId: string | null,
  state: GameState,
): GameState {
  const rank = cards[0].rank;
  const card = cards[0];
  const { turnContext, config } = state;
  const currentPlayer = state.players[state.currentPlayerIndex];

  // ── 1. Remove played cards from player zones ──────────────────────────────
  const playedIds = new Set(cards.map(c => c.id));
  const newHand = currentPlayer.hand.filter(c => !playedIds.has(c.id));
  const newVisible = currentPlayer.visibleCards.filter(c => !playedIds.has(c.id));
  const newHidden = currentPlayer.hiddenCards.filter(c => !playedIds.has(c.id));

  // ── 2. Add played cards to pile ───────────────────────────────────────────
  const grownPile = [...state.pile, ...cards];

  // ── 3. Detect 4-of-a-kind and cut ────────────────────────────────────────
  const effectiveVal = getEffectiveValue(card, config);
  const newConsecutive =
    turnContext.lastPlayedValue !== null && effectiveVal === turnContext.lastPlayedValue
      ? turnContext.consecutiveSameValue + cards.length
      : cards.length;
  const isFourOfAKind = newConsecutive >= 4;
  const isCut = rank === '10' || isFourOfAKind;

  const finalPile = isCut ? [] : grownPile;
  const finalDiscard = isCut ? [...state.discard, ...grownPile] : state.discard;

  // ── 4. Build new TurnContext ──────────────────────────────────────────────
  let newContext: TurnContext;

  if (isCut) {
    newContext = { ...CLEARED_CONTEXT };
  } else {
    const base: TurnContext = {
      mustPlayDouble: false,
      mustFollowSuit: null,
      mustFollowAboveValue: null,
      mustPlayBelow7: false,
      lastEffectiveCard: card,
      consecutiveSameValue: newConsecutive,
      lastPlayedValue: effectiveVal,
      skippedPlayers: 0,
      attackTarget: null,
    };

    switch (rank) {
      case '2':
        // Reset effective pile value to 0; pile stays (no cut)
        newContext = { ...base, lastEffectiveCard: null };
        break;

      case '3': {
        // Mirror grandparent card's effect forward
        const mirrored = turnContext.lastEffectiveCard;
        newContext = {
          ...base,
          lastEffectiveCard: mirrored,
          // If mirroring a 6, carry the suit constraint forward
          mustFollowSuit: mirrored?.rank === '6' ? mirrored.suit : null,
          mustFollowAboveValue:
            mirrored?.rank === '6' ? getEffectiveValue(mirrored, config) : null,
        };
        break;
      }

      case '6':
        newContext = {
          ...base,
          mustFollowSuit: card.suit,
          mustFollowAboveValue: effectiveVal,
        };
        break;

      case '7':
        newContext = { ...base, mustPlayBelow7: true };
        break;

      case '8':
        // N eights played → N players skipped; advancement is handled below
        newContext = { ...base, skippedPlayers: cards.length };
        break;

      case 'J':
        newContext = { ...base, mustPlayDouble: true };
        break;

      case 'A':
        newContext = { ...base, attackTarget: targetId };
        break;

      default:
        newContext = base;
    }
  }

  // ── 5. Replenish hand from deck (up to 3 cards) ───────────────────────────
  let repHand = newHand;
  let repDeck = state.deck;
  while (repHand.length < 3 && repDeck.length > 0) {
    repHand = [...repHand, repDeck[0]];
    repDeck = repDeck.slice(1);
  }

  // ── 6. Detect finish ──────────────────────────────────────────────────────
  const playerDone =
    repHand.length === 0 && newVisible.length === 0 && newHidden.length === 0;
  const newFinishOrder =
    playerDone && !state.finishOrder.includes(currentPlayer.id)
      ? [...state.finishOrder, currentPlayer.id]
      : state.finishOrder;

  // ── 7. Update player in players array ────────────────────────────────────
  const updatedPlayer: Player = {
    ...currentPlayer,
    hand: repHand,
    visibleCards: newVisible,
    hiddenCards: newHidden,
  };
  const newPlayers = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? updatedPlayer : p,
  );

  // ── 8. Advance to next player ─────────────────────────────────────────────
  const n = state.players.length;
  let nextIndex: number;

  if (isCut) {
    // 10 or 4-of-a-kind: same player plays again on empty pile
    nextIndex = state.currentPlayerIndex;
  } else if (rank === 'A' && targetId !== null) {
    // Ace: jump to the attacked player
    const found = state.players.findIndex(p => p.id === targetId);
    nextIndex = found !== -1 ? found : (state.currentPlayerIndex + 1) % n;
  } else {
    // 8: skip N players; all others: advance by 1
    const skip = rank === '8' ? cards.length : 0;
    nextIndex = (state.currentPlayerIndex + 1 + skip) % n;
  }

  return {
    ...state,
    players: newPlayers,
    deck: repDeck,
    pile: finalPile,
    discard: finalDiscard,
    turnContext: newContext,
    currentPlayerIndex: nextIndex,
    finishOrder: newFinishOrder,
    validMoves: [],
    bestMove: null,
  };
}
