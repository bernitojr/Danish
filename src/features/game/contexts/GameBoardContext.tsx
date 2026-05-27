import { createContext, useContext } from 'react'
import type { Card } from '@/features/game/utils/types'

interface GameBoardContextValue {
  selectedCards: Card[]
  setSelectedCards: React.Dispatch<React.SetStateAction<Card[]>>
  pendingAce: Card | null
  setPendingAce: React.Dispatch<React.SetStateAction<Card | null>>
  hiddenPending: Card | null
  setHiddenPending: React.Dispatch<React.SetStateAction<Card | null>>
  revealingHidden: Card | null
  cutReveal: Card | null
  invalidMsg: string | null
  gameStarted: boolean
  handleCardClick: (card: Card) => void
  handlePileClick: () => void
  cannotPlay: boolean
  canPassTurn: boolean
  pileRing: string
  validMoves: Card[]
  bestMove: Card | null
  isPreparing: boolean
}

const GameBoardContext = createContext<GameBoardContextValue | null>(null)

export const GameBoardProvider = GameBoardContext.Provider

export function useGameBoardContext() {
  const ctx = useContext(GameBoardContext)
  if (!ctx) throw new Error('useGameBoardContext must be used within GameBoardProvider')
  return ctx
}
