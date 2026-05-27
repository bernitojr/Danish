import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGameStore } from '@/features/game/store/gameStore'
import { useGameLog } from '@/features/game/hooks/useGameLog'
import { EndScreen } from './EndScreen'
import { BotZone } from './BotZone'
import { CentrePiles } from './CentrePiles'
import { PreparationPanel } from './PreparationPanel'
import { HumanZone } from './HumanZone'
import { GameSidebar } from './GameSidebar'
import type { Card, GameState } from '@/features/game/utils/types'
import { useGameResult } from '@/features/profil/hooks/useGameResult'
import { GameBoardProvider } from '@/features/game/contexts/GameBoardContext'
import { useBubbles } from '@/features/game/contexts/BubbleContext'

const BOT_DELAY_MS = { easy: 1200, medium: 2000, hard: 2500 } as const

// Suit name lookup for contextual emotes (e.g. "Comme ça t'as pas de cœur ?").
const SUIT_NAME: Record<Card['suit'], string> = {
  hearts: 'cœur',
  diamonds: 'carreau',
  clubs: 'trèfle',
  spades: 'pique',
}

export function GameBoard() {
  // ── Store / context hooks ────────────────────────────────────────────────
  const {
    gameState,
    isPlayerTurn,
    playCards,
    triggerBotTurn,
    undoLastMove,
    stateHistory,
    sendEmote,
    resetGame,
    startGame,
    difficulty,
  } = useGameStore()
  const { setBubbles } = useBubbles()

  // ── Local state ──────────────────────────────────────────────────────────
  const [pendingAce, setPendingAce] = useState<Card | null>(null)
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [hiddenPending, setHiddenPending] = useState<Card | null>(null)
  const [revealingHidden, setRevealingHidden] = useState<Card | null>(null)
  const [cutReveal, setCutReveal] = useState<Card | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
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

  // ── Effects ──────────────────────────────────────────────────────────────
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
      // eslint-disable-next-line react-compiler/react-compiler
      setPendingAce(null)
      setSelectedCards([])
      setHiddenPending(null)
      setRevealingHidden(null)
    }
  }, [isPlayerTurn])
  useEffect(() => {
    if (gameState?.phase !== 'PLAYING') {
      // eslint-disable-next-line react-compiler/react-compiler
      setGameStarted(false)
      return
    }
    const t = setTimeout(() => setGameStarted(true), 500)
    return () => clearTimeout(t)
  }, [gameState?.phase])
  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    if (gameState?.phase === 'PREPARATION') setShowEnd(true)
  }, [gameState?.phase])

  const lastEmote = gameState?.emotes.at(-1)
  useEffect(() => {
    if (!lastEmote) return
    // One bubble at a time globally — overwrite any prior player's bubble.
    setBubbles({ [lastEmote.playerId]: lastEmote.emote })
    const t = setTimeout(() => setBubbles({}), 3500)
    return () => clearTimeout(t)
  }, [lastEmote, setBubbles])

  // ── Derived values (before early return — gameState may be null) ─────────
  const human = gameState?.players[0]
  const pile = useMemo(() => gameState?.pile ?? [], [gameState?.pile])
  const validMoves = useMemo(() => gameState?.validMoves ?? [], [gameState?.validMoves])
  const turnContext = gameState?.turnContext ?? null
  const isPreparing = gameState?.phase === 'PREPARATION'
  const inHiddenMode =
    human != null &&
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
  const pileRing =
    (selectedCards.length > 0 || hiddenPending) && !pendingAce
      ? 'ring-2 ring-blue-400 animate-pulse'
      : ''

  // ── Handlers (before early return) ──────────────────────────────────────
  const handleCardClick = useCallback((card: Card) => {
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
  }, [isPreparing, isPlayerTurn, pendingAce, inHiddenMode])

  const handlePileClick = useCallback(() => {
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
      turnContext?.lastEffectiveCard?.rank === 'A'
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
          const effectiveCard = turnContext?.lastEffectiveCard ?? pile.at(-1)
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
      const effectiveCard = turnContext?.lastEffectiveCard ?? pile.at(-1)
      setInvalidMsg(
        `Tu ne peux pas jouer ${selectedCards[0].rank} sur ${effectiveCard?.rank ?? 'vide'}`
      )
      setTimeout(() => setInvalidMsg(null), 2500)
    } else {
      addLog(`Tu joues ${selectedCards[0].rank}`)
      setSelectedCards([])
    }
  }, [
    revealingHidden, cutReveal, inHiddenMode, hiddenPending,
    selectedCards, pendingAce, turnContext, pile, playCards,
    addLog, cutTimerRef,
  ])

  // ── Context value (useMemo before early return) ──────────────────────────
  const contextValue = useMemo(
    () => ({
      selectedCards,
      setSelectedCards,
      pendingAce,
      setPendingAce,
      hiddenPending,
      setHiddenPending,
      revealingHidden,
      cutReveal,
      invalidMsg,
      gameStarted,
      handleCardClick,
      handlePileClick,
      cannotPlay,
      canPassTurn,
      pileRing,
      validMoves,
      bestMove: gameState?.bestMove ?? null,
      isPreparing: gameState?.phase === 'PREPARATION',
    }),
    [
      selectedCards,
      pendingAce,
      hiddenPending,
      revealingHidden,
      cutReveal,
      invalidMsg,
      gameStarted,
      handleCardClick,
      handlePileClick,
      cannotPlay,
      canPassTurn,
      pileRing,
      validMoves,
      gameState?.bestMove,
      gameState?.phase,
      setSelectedCards,
      setPendingAce,
      setHiddenPending,
    ],
  )

  // ── Early return ─────────────────────────────────────────────────────────
  if (!gameState)
    return (
      <div className="flex items-center justify-center h-screen bg-green-900 text-white">
        <p>No game in progress.</p>
      </div>
    )

  // ── Post-guard: gameState is non-null ────────────────────────────────────
  const { players, phase, finishOrder } = gameState
  const [, bot1, bot2, bot3] = players

  return (
    <GameBoardProvider value={contextValue}>
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
          <PreparationPanel />

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
              <CentrePiles />
            </div>
          </div>

          <HumanZone />
        </div>

        <GameSidebar />
      </div>
    </GameBoardProvider>
  )
}
