import { useEffect, useRef, useState } from 'react'
import type { LogEntry } from '@/features/game/utils/types'

interface LogPanelProps {
  log: LogEntry[]
}

export function LogPanel({ log }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    if (!isLocked) return
    const el = scrollRef.current
    if (!el) return
    // Defer to the next frame so the scroll height reflects the just-rendered
    // log entries (layout can still settle after commit in rare cases).
    // Depend on `log` reference rather than `log.length`: appendLogAction can
    // push a new action onto the current turn without growing the array length,
    // so we need the reference change to catch in-turn appends.
    const raf = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
    return () => cancelAnimationFrame(raf)
  }, [log, isLocked])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    // User scrolled away from bottom → drop out of auto-scroll so they can
    // read history without being pulled down. Threshold absorbs the sub-pixel
    // residue from the auto-scroll itself (programmatic scroll lands exactly
    // at bottom, so atBottom stays true and this branch is skipped).
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4
    if (isLocked && !atBottom) setIsLocked(false)
  }

  return (
    <div className="relative w-full h-full flex flex-col min-h-0">
      <button
        onClick={() => setIsLocked((v) => !v)}
        title={
          isLocked
            ? 'Défilement auto (cliquer pour libérer)'
            : 'Libre (cliquer pour verrouiller en bas)'
        }
        className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded text-sm"
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground-muted))',
        }}
      >
        {isLocked ? '🔒' : '🔓'}
      </button>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-3 min-h-0"
      >
        {log.length === 0 ? (
          <p
            className="text-xs italic"
            style={{ color: 'hsl(var(--foreground-muted))' }}
          >
            En attente des actions…
          </p>
        ) : (
          log.map((entry) => (
            <div
              key={entry.turn}
              className="rounded-lg px-3 py-2.5 mb-2"
              style={{
                background: 'hsl(var(--background-dark))',
              }}
            >
              <div
                className="font-bold text-sm mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'hsl(var(--foreground))',
                }}
              >
                Tour {entry.turn}
              </div>
              {entry.actions.map((action, i) => (
                <div
                  key={i}
                  className="text-sm leading-snug"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  {action}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
