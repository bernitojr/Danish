import { useState } from 'react'
import { useGameStore } from '@/features/game/store/gameStore'
import type { BotDifficulty } from '@/features/game/utils/types'

export function PreparationPanel() {
  const gameState = useGameStore(s => s.gameState)
  const setRulesMode = useGameStore(s => s.setRulesMode)
  const setDifficulty = useGameStore(s => s.setDifficulty)
  const setReady = useGameStore(s => s.setReady)
  const [localDiffIndex, setLocalDiffIndex] = useState(1)

  if (!gameState || gameState.phase !== 'PREPARATION') return null

  return (
    <div
      className="absolute bottom-4 left-4 z-20 flex flex-col gap-4 rounded-lg p-5"
      style={{
        width: 260,
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div>
        <p
          className="text-xs uppercase tracking-widest font-bold mb-0.5"
          style={{ color: 'hsl(var(--primary))', fontFamily: 'var(--font-display)' }}
        >
          Phase de préparation
        </p>
        <p className="text-xs" style={{ color: 'hsl(var(--foreground-muted))' }}>
          Échange tes cartes visibles, puis choisis tes paramètres.
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'hsl(var(--border))' }} />

      {/* Difficulty slider */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold" style={{ color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' }}>
          Difficulté
        </p>
        <div className="flex justify-between text-[0.65rem] font-medium">
          {(['Facile', 'Moyen', 'Difficile'] as const).map((label, i) => (
            <span
              key={label}
              style={{
                color: i === localDiffIndex
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--foreground-muted))',
                fontWeight: i === localDiffIndex ? 800 : 400,
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="relative h-1.5 rounded-full" style={{ background: 'hsl(var(--border))' }}>
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${(localDiffIndex / 2) * 100}%`,
              background: 'hsl(var(--primary))',
              transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
          <div
            className="absolute top-1/2 w-3.5 h-3.5 rounded-full pointer-events-none"
            style={{
              left: `${(localDiffIndex / 2) * 100}%`,
              transform: 'translate(-50%, -50%)',
              background: 'hsl(var(--primary))',
              transition: 'left 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
          <input
            type="range" min={0} max={2} step={1}
            value={localDiffIndex}
            onChange={(e) => setLocalDiffIndex(Number(e.target.value))}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
        </div>
        <p className="text-[0.65rem] min-h-[2em]" style={{ color: 'hsl(var(--foreground-muted))' }}>
          {['Les bots jouent au hasard.', 'Quelques stratégies de base.', 'Stratégie avancée — bonne chance !'][localDiffIndex]}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'hsl(var(--border))' }} />

      {/* Mode */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold" style={{ color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' }}>
          Mode
        </p>
        {(['patriarchal', 'matriarchal'] as const).map((mode) => (
          <label key={mode} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rules-mode"
              value={mode}
              checked={gameState.config.mode === mode}
              onChange={() => setRulesMode(mode)}
            />
            <span className="text-xs capitalize" style={{ color: 'hsl(var(--foreground))' }}>
              {mode === 'patriarchal' ? 'Patriarcal' : 'Matriarcal'}
            </span>
          </label>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'hsl(var(--border))' }} />

      {/* Submit */}
      <button
        onClick={() => {
          setDifficulty(['easy', 'medium', 'hard'][localDiffIndex] as BotDifficulty)
          setReady()
        }}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
        style={{
          background: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          fontFamily: 'var(--font-display)',
          boxShadow: '0 4px 14px hsl(var(--primary) / 0.25)',
        }}
      >
        Je suis prêt ✓
      </button>
    </div>
  )
}
