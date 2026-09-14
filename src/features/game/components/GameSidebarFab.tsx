import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import useIsCompactBoard from '@/features/game/hooks/useIsCompactBoard'
import { GameSidebar } from './GameSidebar'

export function GameSidebarFab() {
  const isCompact = useIsCompactBoard()
  const [open, setOpen] = useState<boolean>(false)

  if (!isCompact) return null

  return (
    <>
      {/* FAB — fixed (pas absolute : la game zone est overflow:hidden) */}
      <button
        type="button"
        aria-label="Ouvrir le journal et les emotes"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[55] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
        style={{ background: 'hsl(var(--primary))' }}
      >
        <MessageSquare size={24} color="hsl(var(--primary-foreground))" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60]"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panneau latéral */}
            <motion.div
              className="fixed right-0 top-0 z-[61] flex h-full flex-col"
              style={{
                width: 'min(320px, 85vw)',
                background: 'hsl(var(--background-dark))',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="flex flex-none items-center justify-end p-2">
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                >
                  <X size={20} color="hsl(var(--foreground))" />
                </button>
              </div>

              {/* Slot flex-row → GameSidebar s'étire en hauteur, réutilisé tel quel */}
              <div className="flex min-h-0 flex-1">
                <GameSidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
