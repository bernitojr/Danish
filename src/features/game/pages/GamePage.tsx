import { BubbleProvider } from '@/features/game/contexts/BubbleContext'
import { GameBoard } from '@/features/game/components/GameBoard'

export function GamePage() {
  return (
    <BubbleProvider>
      <GameBoard />
    </BubbleProvider>
  )
}
