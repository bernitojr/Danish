import { useEffect } from 'react'
import { useGameStore } from '@/features/game/store/gameStore'
import type { Card } from '@/features/game/utils/types'

function getBestSwapsForBot(
  hand: Card[],
  visibleCards: Card[]
): { handCard: Card; visibleCard: Card }[] {
  // Combine all 6 cards (3 hand + 3 visible)
  const all = [...hand, ...visibleCards]

  // Sort by value descending — highest value cards should be visible
  all.sort((a, b) => b.value - a.value)

  // The 3 best cards should be visible
  const shouldBeVisible = new Set(all.slice(0, 3).map((c) => c.id))

  // Find cards currently in hand that should be visible
  // and their counterpart currently visible that should go to hand
  const swaps: { handCard: Card; visibleCard: Card }[] = []

  const handShouldBeVisible = hand.filter((c) => shouldBeVisible.has(c.id))
  const visibleShouldBeHand = visibleCards.filter(
    (c) => !shouldBeVisible.has(c.id)
  )

  // Pair them up — one swap per mismatch
  const count = Math.min(handShouldBeVisible.length, visibleShouldBeHand.length)
  for (let i = 0; i < count; i++) {
    swaps.push({
      handCard: handShouldBeVisible[i]!,
      visibleCard: visibleShouldBeHand[i]!,
    })
  }

  return swaps
}

export function useBotPreparation() {
  const gameState = useGameStore((s) => s.gameState)
  const swapBotCard = useGameStore((s) => s.swapBotCard)

  useEffect(() => {
    if (!gameState || gameState.phase !== 'PREPARATION') return

    const bots = gameState.players.filter((p) => p.isBot)
    const timeouts: ReturnType<typeof setTimeout>[] = []

    bots.forEach((bot, i) => {
      const baseDelay = 1800 + i * 800
      const swaps = getBestSwapsForBot(bot.hand, bot.visibleCards)
      swaps.forEach((swap, j) => {
        const t = setTimeout(
          () => {
            swapBotCard(bot.id, swap.handCard, swap.visibleCard)
          },
          baseDelay + j * 400
        )
        timeouts.push(t)
      })
    })

    return () => timeouts.forEach(clearTimeout)
  }, [gameState?.phase, swapBotCard])
}
