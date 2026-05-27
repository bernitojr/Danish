import { useGameStore } from '@/features/game/store/gameStore'
import { LogPanel } from './LogPanel'

const EMOTES = ['😊', '😐', '😍', '😵']

export function GameSidebar() {
  const gameState = useGameStore(s => s.gameState)
  const sendEmote = useGameStore(s => s.sendEmote)

  if (!gameState) return null

  return (
    <div
      className="flex flex-col border-l"
      style={{
        width: 288,
        flexShrink: 0,
        background: 'hsl(var(--background-dark))',
        borderColor: 'hsl(var(--border))',
      }}
    >
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
      <div className="flex-1 overflow-hidden min-h-0">
        <LogPanel log={gameState.log ?? []} />
      </div>
      <div
        className="flex items-center justify-center"
        style={{ padding: 12, borderTop: '1px solid hsl(var(--border))' }}
      >
        <div className="grid grid-cols-2 gap-1 rounded-lg p-1.5">
          {EMOTES.map(e => (
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
  )
}
