import { BubbleProvider } from '@/features/game/contexts/BubbleContext'
import { CardAnimationProvider } from '@/features/game/contexts/CardAnimationContext'
import { GameBoard } from '@/features/game/components/GameBoard'
import { FlyingCardOverlay } from '@/features/game/components/FlyingCardOverlay'
import { LayoutGroup } from 'framer-motion'

export function GamePage() {
  return (
    <BubbleProvider>
      <CardAnimationProvider>
        <LayoutGroup>
          <GameBoard />
          <FlyingCardOverlay />
        </LayoutGroup>
      </CardAnimationProvider>
    </BubbleProvider>
  )
}
