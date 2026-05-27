import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { Card } from '@/features/game/utils/types'

export interface FlyingCard {
  id: string
  cardId: string
  fromRect: DOMRect
  toRect: DOMRect
  delay?: number
  type?: 'card' | 'attack'
  onComplete?: () => void
}

interface CardAnimationContextValue {
  registerCardRef: (cardId: string, el: HTMLElement | null) => void
  registerPileRef: (el: HTMLElement | null) => void
  registerFosseRef: (el: HTMLElement | null) => void
  registerPlayerRef: (playerId: string, el: HTMLElement | null) => void
  flyCardToPile: (cards: Card[], onComplete?: () => void) => void
  flyPileToHand: (cardIds: string[], targetPlayerId?: string, onComplete?: () => void) => void
  flyPileToDiscard: (cardIds: string[], onComplete?: () => void) => void
  flyAttack: (attackerId: string, targetId: string, onComplete?: () => void) => void
  flyingCards: FlyingCard[]
}

const CardAnimationContext = createContext<CardAnimationContextValue | null>(null)

const STAGGER = 40
const DURATION = 400

export function CardAnimationProvider({ children }: { children: React.ReactNode }) {
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map())
  const pileRef = useRef<HTMLElement | null>(null)
  const fosseRef = useRef<HTMLElement | null>(null)
  const playerRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [flyingCards, setFlyingCards] = useState<FlyingCard[]>([])

  const registerCardRef = useCallback((cardId: string, el: HTMLElement | null) => {
    if (el) cardRefs.current.set(cardId, el)
    else cardRefs.current.delete(cardId)
  }, [])

  const registerPileRef = useCallback((el: HTMLElement | null) => {
    pileRef.current = el
  }, [])

  const registerFosseRef = useCallback((el: HTMLElement | null) => {
    fosseRef.current = el
  }, [])

  const registerPlayerRef = useCallback((playerId: string, el: HTMLElement | null) => {
    if (el) playerRefs.current.set(playerId, el)
    else playerRefs.current.delete(playerId)
  }, [])

  const flyCardToPile = useCallback((cards: Card[], onComplete?: () => void) => {
    const pileEl = pileRef.current
    if (!pileEl || cards.length === 0) {
      onComplete?.()
      return
    }
    const toRect = pileEl.getBoundingClientRect()
    const newFlying: FlyingCard[] = []

    cards.forEach((card, i) => {
      const el = cardRefs.current.get(card.id)
      if (!el) return
      const fromRect = el.getBoundingClientRect()
      const id = `fly-to-pile-${card.id}-${Date.now()}-${i}`
      newFlying.push({
        id,
        cardId: card.id,
        fromRect,
        toRect,
        onComplete: () => setFlyingCards((prev) => prev.filter((f) => f.id !== id)),
      })
    })

    if (newFlying.length === 0) {
      onComplete?.()
      return
    }

    if (onComplete) {
      const last = newFlying[newFlying.length - 1]!
      const cleanup = last.onComplete
      last.onComplete = () => {
        cleanup?.()
        onComplete()
      }
    }

    setFlyingCards((prev) => [...prev, ...newFlying])
  }, [])

  const flyPileToHand = useCallback(
    (cardIds: string[], targetPlayerId?: string, onComplete?: () => void) => {
      const pileEl = pileRef.current
      if (!pileEl || cardIds.length === 0) {
        onComplete?.()
        return
      }

      const fromRect = pileEl.getBoundingClientRect()
      const targetEl = targetPlayerId ? playerRefs.current.get(targetPlayerId) : null
      const toRect = targetEl
        ? targetEl.getBoundingClientRect()
        : new DOMRect(fromRect.x - 200, fromRect.y + 300, fromRect.width, fromRect.height)

      const newFlying: FlyingCard[] = cardIds.slice(0, 5).map((cardId, i) => ({
        id: `fly-pile-${Date.now()}-${i}`,
        cardId,
        fromRect: new DOMRect(
          fromRect.x + i * 2,
          fromRect.y + i * 2,
          fromRect.width,
          fromRect.height,
        ),
        toRect: new DOMRect(toRect.x + i * 6, toRect.y, toRect.width, toRect.height),
        delay: i * STAGGER,
      }))

      setFlyingCards((prev) => [...prev, ...newFlying])

      const totalDuration = DURATION + (cardIds.length - 1) * STAGGER
      setTimeout(() => {
        setFlyingCards((prev) => prev.filter((f) => !newFlying.some((n) => n.id === f.id)))
        onComplete?.()
      }, totalDuration)
    },
    [],
  )

  const flyPileToDiscard = useCallback((cardIds: string[], onComplete?: () => void) => {
    const pileEl = pileRef.current
    const fosseEl = fosseRef.current
    if (!pileEl || !fosseEl || cardIds.length === 0) {
      onComplete?.()
      return
    }

    const fromRect = pileEl.getBoundingClientRect()
    const toRect = fosseEl.getBoundingClientRect()

    const newFlying: FlyingCard[] = cardIds.map((cardId, i) => ({
      id: `fly-discard-${Date.now()}-${i}`,
      cardId,
      fromRect: new DOMRect(
        fromRect.x + i * 1.5,
        fromRect.y + i * 1.5,
        fromRect.width,
        fromRect.height,
      ),
      toRect,
      delay: i * STAGGER,
    }))

    setFlyingCards((prev) => [...prev, ...newFlying])

    const totalDuration = DURATION + (cardIds.length - 1) * STAGGER
    setTimeout(() => {
      setFlyingCards((prev) => prev.filter((f) => !newFlying.some((n) => n.id === f.id)))
      onComplete?.()
    }, totalDuration)
  }, [])

  const flyAttack = useCallback(
    (attackerId: string, targetId: string, onComplete?: () => void) => {
      const attackerEl = playerRefs.current.get(attackerId)
      const targetEl = playerRefs.current.get(targetId)
      if (!attackerEl || !targetEl) {
        onComplete?.()
        return
      }

      const fromRect = attackerEl.getBoundingClientRect()
      const toRect = targetEl.getBoundingClientRect()
      const flyId = `fly-attack-${Date.now()}`

      setFlyingCards((prev) => [
        ...prev,
        { id: flyId, cardId: 'attack', fromRect, toRect, delay: 0, type: 'attack' },
      ])

      setTimeout(() => {
        setFlyingCards((prev) => prev.filter((f) => f.id !== flyId))
        onComplete?.()
      }, 800)
    },
    [],
  )

  return (
    <CardAnimationContext.Provider
      value={{
        registerCardRef,
        registerPileRef,
        registerFosseRef,
        registerPlayerRef,
        flyCardToPile,
        flyPileToHand,
        flyPileToDiscard,
        flyAttack,
        flyingCards,
      }}
    >
      {children}
    </CardAnimationContext.Provider>
  )
}

export function useCardAnimation() {
  const ctx = useContext(CardAnimationContext)
  if (!ctx) throw new Error('useCardAnimation must be used within CardAnimationProvider')
  return ctx
}
