import { useBubbles } from '@/features/game/contexts/BubbleContext'

type Direction = 'up' | 'down' | 'left' | 'right'

interface BubbleProps {
  id: string
  direction?: Direction
}

export function Bubble({ id, direction = 'up' }: BubbleProps) {
  const { bubbles } = useBubbles()
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
