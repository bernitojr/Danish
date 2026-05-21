import { useState, useRef, useEffect } from 'react'
import { Lock, ChevronDown } from 'lucide-react'

interface Title {
  id: string
  name: string
  description: string
}

interface TitleSelectProps {
  activeTitle: string | null
  allTitles: Title[]
  unlockedTitles: { title_id: string; name: string; description: string }[]
  onTitleChange: (titleId: string | null) => void
}

export function TitleSelect({ activeTitle, allTitles, unlockedTitles, onTitleChange }: TitleSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unlockedIds = new Set(unlockedTitles.map((t) => t.title_id))
  const activeTitleName = allTitles.find((t) => t.id === activeTitle)?.name ?? 'Aucun titre'

  // Fermer au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.04)] transition-colors"
      >
        <span>{activeTitleName}</span>
        <ChevronDown className={`w-4 h-4 text-[hsl(var(--foreground-muted))] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 top-full mt-1 w-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg overflow-hidden">
          {/* Option vide */}
          <button
            onClick={() => { onTitleChange(null); setIsOpen(false) }}
            className="w-full px-3 py-2 text-left text-sm text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--foreground)/0.04)] transition-colors"
          >
            Aucun titre
          </button>

          {allTitles.map((title) => {
            const isUnlocked = unlockedIds.has(title.id)
            return (
              <button
                key={title.id}
                disabled={!isUnlocked}
                onClick={() => { if (isUnlocked) { onTitleChange(title.id); setIsOpen(false) } }}
                className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                  isUnlocked
                    ? 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary)/0.08)]'
                    : 'text-[hsl(var(--foreground-muted))] cursor-not-allowed opacity-50'
                }`}
              >
                {!isUnlocked && <Lock className="w-3.5 h-3.5 shrink-0" />}
                <span>{title.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}