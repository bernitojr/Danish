import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/features/game/store/gameStore'
import { useGameLog } from '@/features/game/hooks/useGameLog'
import { PlayerZone } from './PlayerZone'
import { GameCard } from './GameCard'
import { EndScreen } from './EndScreen'
import { LogPanel } from './LogPanel'
import type { Card, GameState, Player } from '@/features/game/utils/types'
import { useGameResult } from '@/features/profil/hooks/useGameResult'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePublicProfile } from '@/features/profil/hooks/usePublicProfile'

const EMOTES = ['😊', '😐', '😍', '😵']

const BOT_DELAY_MS = { easy: 1200, medium: 2000, hard: 2500 } as const

// Suit name lookup for contextual emotes (e.g. "Comme ça t'as pas de cœur ?").
const SUIT_NAME: Record<Card['suit'], string> = {
  hearts: 'cœur',
  diamonds: 'carreau',
  clubs: 'trèfle',
  spades: 'pique',
}

export function GameBoard() {
  const {
    gameState,
    isPlayerTurn,
    playCards,
    swapCard,
    setReady,
    triggerBotTurn,
    takePile,
    passTurn,
    undoLastMove,
    stateHistory,
    sendEmote,
    resetGame,
    startGame,
    difficulty,
    isDebugMode,
    setRulesMode,
  } = useGameStore()
  const { user, profile } = useAuthStore()
  const { data: publicProfile } = usePublicProfile(user?.id ?? null)
  const activeTitle = publicProfile
    ? (publicProfile.allTitles.find(
        (t) => t.id === publicProfile.active_title_id
      )?.name ?? null)
    : null
  const [pendingAce, setPendingAce] = useState<Card | null>(null)
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [hiddenPending, setHiddenPending] = useState<Card | null>(null)
  const [revealingHidden, setRevealingHidden] = useState<Card | null>(null)
  const [cutReveal, setCutReveal] = useState<Card | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [bubbles, setBubbles] = useState<Record<string, string>>({})
  const [invalidMsg, setInvalidMsg] = useState<string | null>(null)
  const [showEnd, setShowEnd] = useState(true)
  const prevGsRef = useRef<GameState | null>(null)
  const cutTimerRef = useRef<number | null>(null)
  useGameResult(gameState)
  // Remembers the most recently played card + its player across state
  // transitions so "next player takes pile" consequence emotes can attribute
  // the taunt to the correct sender.
  const lastPlayRef = useRef<{ playerId: string; card: Card } | null>(null)
  const { push: addLog } = useGameLog(gameState, isPlayerTurn)

  useEffect(() => {
    const prev = prevGsRef.current
    prevGsRef.current = gameState
    if (!prev || !gameState) return

    const pileGrew = gameState.pile.length > prev.pile.length
    const discardGrew = gameState.discard.length > prev.discard.length
    const pileCleared =
      prev.pile.length > 0 && gameState.pile.length === 0 && !discardGrew

    // Bot 10 cut visual: stage a 700ms overlay so the 10 stays visible on
    // top of the pile before the display clears. Human 10 plays are
    // intercepted in handlePileClick and don't reach this effect.
    const lastDiscardCard = discardGrew
      ? (gameState.discard.at(-1) ?? null)
      : null
    const botCut =
      prev.currentPlayerIndex !== 0 &&
      discardGrew &&
      prev.pile.length > 0 &&
      gameState.pile.length === 0 &&
      lastDiscardCard?.rank === '10'
    if (botCut && lastDiscardCard) {
      if (cutTimerRef.current !== null) window.clearTimeout(cutTimerRef.current)
      setCutReveal(lastDiscardCard)
      cutTimerRef.current = window.setTimeout(() => {
        setCutReveal(null)
        cutTimerRef.current = null
      }, 700)
    }

    // ── Contextual emote triggers ──────────────────────────────────────────
    // Bubbles reuse the existing Zustand emote state: sendEmote appends to
    // gameState.emotes → the lastEmote effect below mirrors it onto a bubble.
    let emote: { playerId: string; message: string } | null = null

    if (pileGrew || discardGrew) {
      const lastCard = discardGrew
        ? gameState.discard.at(-1)
        : gameState.pile.at(-1)
      const player = prev.players[prev.currentPlayerIndex]
      if (!lastCard || !player) return
      lastPlayRef.current = { playerId: player.id, card: lastCard }

      if (discardGrew) {
        // Distinguish a 4-of-a-kind cut from a 10 cut by counting trailing
        // same-rank cards on discard. A 10-cut leaves a lone 10 at the end;
        // a 4-of-a-kind leaves 4+ same-rank cards at the end.
        let trailingSame = 0
        for (let i = gameState.discard.length - 1; i >= 0; i--) {
          if (gameState.discard[i].rank === lastCard.rank) trailingSame++
          else break
        }
        if (trailingSame >= 4) {
          emote = {
            playerId: player.id,
            message: `On remercie les ${lastCard.rank} !`,
          }
        } else if (lastCard.rank === '10') {
          emote =
            prev.turnContext.attackTarget === player.id
              ? { playerId: player.id, message: 'Peace man' }
              : {
                  playerId: player.id,
                  message: 'Je fais ça pour vous\n(et un peu pour moi)',
                }
        }
      } else {
        switch (lastCard.rank) {
          case '2':
            if (prev.pile.length >= 5)
              emote = { playerId: player.id, message: 'Chill' }
            break
          case '4':
            emote = { playerId: player.id, message: 'Je pose ça là...' }
            break
          case '8':
            emote = { playerId: player.id, message: 'Toi, tu joues pas' }
            break
        }
      }
    } else if (pileCleared) {
      // Next player just took the pile. The card-player (lastPlayRef) taunts.
      const taker = prev.players[prev.currentPlayerIndex]
      const lastCard = prev.pile.at(-1)
      const lastPlay = lastPlayRef.current
      const pileSize = prev.pile.length
      if (taker && lastCard) {
        if (pileSize >= 10) {
          emote = { playerId: taker.id, message: 'Pardon??' }
        } else if (lastPlay && lastPlay.playerId !== taker.id) {
          // Skip self-taken piles (e.g. a bot revealing an invalid hidden
          // card then sweeping into its own hand — no taunt makes sense).
          switch (lastCard.rank) {
            case '6':
              emote = {
                playerId: lastPlay.playerId,
                message: `Comme ça t'as pas de ${SUIT_NAME[lastCard.suit]} ?`,
              }
              break
            case 'J':
              emote = {
                playerId: lastPlay.playerId,
                message: 'Pas de double ?',
              }
              break
            case '7':
              emote = {
                playerId: lastPlay.playerId,
                message: 'Même pas un petit 4 ?',
              }
              break
            case 'A':
              emote = {
                playerId: lastPlay.playerId,
                message: "T'aurais dû faire attention",
              }
              break
          }
        }
      }
    }

    if (emote) sendEmote(emote.playerId, emote.message)
  }, [gameState, sendEmote])

  useEffect(() => {
    if (!gameState || gameState.phase !== 'PLAYING' || isPlayerTurn) return
    const t = setTimeout(triggerBotTurn, BOT_DELAY_MS[difficulty])
    return () => clearTimeout(t)
  }, [gameState, isPlayerTurn, triggerBotTurn, difficulty])

  useEffect(() => {
    if (!isPlayerTurn) {
      setPendingAce(null)
      setSelectedCards([])
      setHiddenPending(null)
      setRevealingHidden(null)
    }
  }, [isPlayerTurn])
  useEffect(() => {
    if (gameState?.phase !== 'PLAYING') {
      setGameStarted(false)
      return
    }
    const t = setTimeout(() => setGameStarted(true), 500)
    return () => clearTimeout(t)
  }, [gameState?.phase])
  useEffect(() => {
    if (gameState?.phase === 'PREPARATION') setShowEnd(true)
  }, [gameState?.phase])

  const lastEmote = gameState?.emotes.at(-1)
  useEffect(() => {
    if (!lastEmote) return
    // One bubble at a time globally — overwrite any prior player's bubble.
    setBubbles({ [lastEmote.playerId]: lastEmote.emote })
    const t = setTimeout(() => setBubbles({}), 3500)
    return () => clearTimeout(t)
  }, [lastEmote?.timestamp])

  if (!gameState)
    return (
      <div className="flex items-center justify-center h-screen bg-green-900 text-white">
        <p>No game in progress.</p>
      </div>
    )

  const {
    players,
    pile,
    deck,
    currentPlayerIndex,
    validMoves,
    bestMove,
    phase,
    finishOrder,
    turnContext,
  } = gameState
  const [human, bot1, bot2, bot3] = players
  const isPreparing = phase === 'PREPARATION'
  const inHiddenMode =
    human.hand.length === 0 &&
    human.visibleCards.length === 0 &&
    human.hiddenCards.length > 0
  const cannotPlay =
    gameStarted &&
    isPlayerTurn &&
    !isPreparing &&
    !pendingAce &&
    validMoves.length === 0 &&
    !inHiddenMode
  const canPassTurn = cannotPlay && pile.length === 0
  const pileTop3 = pile.slice(-3)

  function handleCardClick(card: Card) {
    if (isPreparing || !isPlayerTurn || pendingAce) return
    if (inHiddenMode) {
      setHiddenPending(card)
      return
    }
    setSelectedCards((prev) =>
      prev.some((c) => c.id === card.id)
        ? prev.filter((c) => c.id !== card.id)
        : prev.length > 0 && prev[0].rank !== card.rank
          ? [card]
          : [...prev, card]
    )
  }

  function handlePileClick() {
    if (revealingHidden || cutReveal) return
    if (inHiddenMode) {
      if (!hiddenPending) return
      const card = hiddenPending
      setHiddenPending(null)
      setRevealingHidden(card)
      window.setTimeout(() => {
        setRevealingHidden(null)
        if (card.rank === 'A') {
          setSelectedCards([card])
          setPendingAce(card)
        } else {
          playCards([card])
        }
      }, 700)
      return
    }
    if (!selectedCards.length || pendingAce) return
    if (selectedCards.some((c) => c.rank === 'A')) {
      setPendingAce(selectedCards.find((c) => c.rank === 'A')!)
      return
    }
    if (
      selectedCards.every((c) => c.rank === '3') &&
      turnContext.lastEffectiveCard?.rank === 'A'
    ) {
      setPendingAce(selectedCards[0])
      return
    }
    // Bug 1: stage 700ms pause so the 10 is visible on top of the pile before
    // applyPlay cuts it into the discard. Same pattern as the Ace hidden-reveal fix.
    if (selectedCards[0].rank === '10') {
      const tens = selectedCards
      if (cutTimerRef.current !== null) window.clearTimeout(cutTimerRef.current)
      setCutReveal(tens[tens.length - 1])
      cutTimerRef.current = window.setTimeout(() => {
        setCutReveal(null)
        cutTimerRef.current = null
        if (!playCards(tens)) {
          const effectiveCard = turnContext.lastEffectiveCard ?? pile.at(-1)
          setInvalidMsg(
            `Tu ne peux pas jouer ${tens[0].rank} sur ${effectiveCard?.rank ?? 'vide'}`
          )
          setTimeout(() => setInvalidMsg(null), 2500)
        } else {
          addLog(`Tu joues ${tens[0].rank}`)
          setSelectedCards([])
        }
      }, 700)
      return
    }
    if (!playCards(selectedCards)) {
      const effectiveCard = turnContext.lastEffectiveCard ?? pile.at(-1)
      setInvalidMsg(
        `Tu ne peux pas jouer ${selectedCards[0].rank} sur ${effectiveCard?.rank ?? 'vide'}`
      )
      setTimeout(() => setInvalidMsg(null), 2500)
    } else {
      addLog(`Tu joues ${selectedCards[0].rank}`)
      setSelectedCards([])
    }
  }

  function Bubble({
    id,
    direction = 'up',
  }: {
    id: string
    direction?: 'up' | 'down' | 'left' | 'right'
  }) {
    const content = bubbles[id]
    if (!content) return null
    const isEmoji = [...content].length <= 2
    const posClass = {
      up: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      down: 'top-1/2 left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }[direction]
    return (
      <div
        className={`absolute ${posClass} bg-black/70 rounded-xl px-3 py-1.5 z-20 text-white text-center whitespace-pre-line font-medium leading-snug shadow-lg max-w-[220px] ${isEmoji ? 'text-2xl' : 'text-xs'}`}
      >
        {content}
      </div>
    )
  }

  function BotZone({
    player,
    idx,
    bubbleDirection = 'up',
  }: {
    player: Player
    idx: number
    bubbleDirection?: 'up' | 'down' | 'left' | 'right'
  }) {
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
            <span className="text-white font-bold text-sm drop-shadow">
              ⚔ Attaquer
            </span>
          </button>
        )}
      </div>
    )
  }

  const pileRing =
    (selectedCards.length > 0 || hiddenPending) && !pendingAce
      ? 'ring-2 ring-blue-400 animate-pulse'
      : ''

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      {/* ── Game zone (left column) ── */}
      <div
        className="relative flex-1 min-h-0 overflow-hidden"
        style={{ background: 'hsl(var(--background-dark))' }}
      >
        {finishOrder.includes('human') && showEnd && (
          <EndScreen
            players={players}
            finishOrder={finishOrder}
            humanId="human"
            onHide={() => setShowEnd(false)}
            onReplay={() => {
              resetGame()
              startGame(human?.name ?? 'Joueur', difficulty)
            }}
          />
        )}
        {stateHistory.length > 0 && phase === 'PLAYING' && (
          <button
            onClick={undoLastMove}
            className="absolute top-2 right-2 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              background: 'transparent',
              color: 'hsl(var(--foreground-muted))',
              border: '1px solid hsl(var(--border))',
            }}
          >
            ↩ Retour
          </button>
        )}
        {isPreparing && (
          <div className="absolute bottom-4 left-4 z-20" style={{ width: 220 }}>
            <div className="w-full px-3 py-2 bg-black/50 rounded-lg border border-yellow-500/40 flex flex-col items-stretch gap-1.5">
              <p className="text-yellow-300 text-xs font-medium">
                Phase de préparation
              </p>
              <div className="flex flex-col gap-0.5">
                <label className="flex items-center gap-2 text-white text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="rules-mode"
                    value="patriarchal"
                    checked={gameState.config.mode === 'patriarchal'}
                    onChange={() => setRulesMode('patriarchal')}
                  />
                  <span>Patriarcal</span>
                </label>
                <label className="flex items-center gap-2 text-white text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="rules-mode"
                    value="matriarchal"
                    checked={gameState.config.mode === 'matriarchal'}
                    onChange={() => setRulesMode('matriarchal')}
                  />
                  <span>Matriarcal</span>
                </label>
              </div>
              <button
                className="w-full px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded text-xs"
                onClick={setReady}
              >
                Je suis prêt ✓
              </button>
            </div>
          </div>
        )}

        {/* ── Shared container: oval table + 3×3 grid, sized + centred identically ── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(1100px, 95vw)',
            height: 'min(645px, 80vh)',
            zIndex: 0,
          }}
        >
          {/* Oval table — covers full container, behind grid */}
          <div className="pointer-events-none absolute inset-0">
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background:
                  'radial-gradient(ellipse at 30% 30%,#8b5a2b,#6b3a1f 60%,#3d1f0a)',
                boxShadow:
                  '0 0 0 4px #8b6030,0 0 0 7px #5a3510,0 20px 80px rgba(0,0,0,0.7)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 22,
                borderRadius: '50%',
                background:
                  'radial-gradient(ellipse at 50% 35%,#1e6b3d 0%,#1a5c35 50%,#0f3d22 100%)',
                boxShadow: 'inset 0 4px 30px rgba(0,0,0,0.4)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 22,
                borderRadius: '50%',
                backgroundImage:
                  'repeating-linear-gradient(0deg,rgba(255,255,255,0.012) 0px,transparent 1px,transparent 12px),repeating-linear-gradient(90deg,rgba(255,255,255,0.012) 0px,transparent 1px,transparent 12px)',
                backgroundSize: '12px 12px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 30,
                borderRadius: '50%',
                border: '1.5px solid rgba(180,140,40,0.2)',
              }}
            />
          </div>

          {/* 3×3 grid — same bounds as oval */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr',
              gridTemplateRows: '1fr 1fr 1.4fr',
            }}
          >
            {/* R1 C1 — empty */}
            <div />

            {/* R1 C2 — Bot top (bot2) */}
            <div className="flex items-end justify-center pb-2">
              <BotZone player={bot2} idx={2} bubbleDirection="down" />
            </div>

            {/* R1 C3 — empty */}
            <div />

            {/* R2 C1 — Bot left (bot1) */}
            <div className="flex items-center justify-end pr-2">
              <BotZone player={bot1} idx={1} bubbleDirection="right" />
            </div>

            {/* R2 C2 — empty */}
            <div />

            {/* R2 C3 — Bot right (bot3) */}
            <div className="flex items-center justify-start pl-2">
              <BotZone player={bot3} idx={3} bubbleDirection="left" />
            </div>

            {/* R3 C1 — empty */}
            <div />

            {/* R3 C2 — empty */}
            <div />

            {/* R3 C3 — empty */}
            <div />
          </div>

          {/* Centre piles — absolute inside the shared container */}
          <div
            style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -25%)',
              zIndex: 20,
            }}
          >
            <div className="relative flex flex-col items-center gap-2">
              <div className="flex items-center gap-6">
                {/* Fosse */}
                <div className="flex flex-col items-center gap-1">
                  <span
                    className="text-xs"
                    style={{ color: 'hsl(var(--primary))' }}
                  >
                    Fosse ({gameState.discard.length})
                  </span>
                  <div className="relative w-14 h-[78px]">
                    {gameState.discard.length === 0 && (
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
                    {gameState.discard.length >= 3 && (
                      <div className="absolute inset-0 -rotate-6 -translate-x-4 opacity-60">
                        <GameCard
                          card={gameState.discard[gameState.discard.length - 3]}
                          state="normal"
                        />
                      </div>
                    )}
                    {gameState.discard.length >= 2 && (
                      <div className="absolute inset-0 -rotate-3 -translate-x-2 opacity-80">
                        <GameCard
                          card={gameState.discard[gameState.discard.length - 2]}
                          state="normal"
                        />
                      </div>
                    )}
                    {gameState.discard.length >= 1 && (
                      <div className="absolute inset-0">
                        <GameCard
                          card={gameState.discard[gameState.discard.length - 1]}
                          state="normal"
                        />
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
                        <GameCard
                          card={pileTop3[pileTop3.length - 2]}
                          state="normal"
                        />
                      </div>
                    )}
                    {pileTop3.length >= 1 && (
                      <div className="absolute inset-0">
                        <GameCard
                          card={pileTop3[pileTop3.length - 1]}
                          state="normal"
                        />
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
          </div>
        </div>

        {/* Human zone — absolute, outside the table container to avoid clipping */}
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
            selectedCardIds={selectedCards.map((c) => c.id)}
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
      </div>

      {/* ── Sidebar (right column) ── */}
      <div
        className="flex flex-col border-l"
        style={{
          width: 288,
          flexShrink: 0,
          background: 'hsl(var(--background-dark))',
          borderColor: 'hsl(var(--border))',
        }}
      >
        {/* Header */}
        <div
          className="flex-none"
          style={{
            padding: 12,
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'hsl(var(--foreground-muted))',
            }}
          >
            Journal de partie
          </span>
        </div>

        {/* Log */}
        <div className="flex-1 overflow-hidden min-h-0">
          <LogPanel log={gameState.log ?? []} />
        </div>

        {/* Emotes */}
        <div
          className="flex items-center justify-center"
          style={{ padding: 12, borderTop: '1px solid hsl(var(--border))' }}
        >
          <div className="grid grid-cols-2 gap-1 rounded-lg p-1.5">
            {EMOTES.map((e) => (
              <button
                key={e}
                className="flex items-center justify-center w-12 h-12 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => sendEmote('human', e)}
              >
                <span className="text-[36px] leading-none">{e}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
