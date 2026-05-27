import { createContext, useContext, useState } from 'react'

interface BubbleContextValue {
  bubbles: Record<string, string>
  setBubbles: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

const BubbleContext = createContext<BubbleContextValue | null>(null)

export function BubbleProvider({ children }: { children: React.ReactNode }) {
  const [bubbles, setBubbles] = useState<Record<string, string>>({})
  return (
    <BubbleContext.Provider value={{ bubbles, setBubbles }}>
      {children}
    </BubbleContext.Provider>
  )
}

export function useBubbles() {
  const ctx = useContext(BubbleContext)
  if (!ctx) throw new Error('useBubbles must be used within BubbleProvider')
  return ctx
}
