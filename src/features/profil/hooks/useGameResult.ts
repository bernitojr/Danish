import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { GameState } from '@/features/game/utils/types'
import { useAuthStore } from '@/stores/useAuthStore'
export function useGameResult(gameState: GameState | null) {
  //   console.log('useGameResult MOUNTED', gameState?.phase) // ← ici
  const hasInserted = useRef(false)
  const { user } = useAuthStore()

  const phase = gameState?.phase
  const finishOrder = gameState?.finishOrder

  useEffect(() => {
    console.log('useGameResult triggered', { phase, finishOrder })

    if (!phase || !finishOrder) return
    if (!finishOrder.includes('human')) return
    if (hasInserted.current) return

    console.log('Conditions OK — tentative insert', {
      placement: finishOrder.indexOf('human') + 1,
      userId: user?.id,
    })

    const placement = finishOrder.indexOf('human') + 1
    hasInserted.current = true

    const insertResult = async () => {
      const { error } = await supabase.from('game_results').insert({
        user_id: user?.id,
        placement,
      })
      if (error) console.error('Erreur insert game_results:', error)
    }

    insertResult()
  }, [phase, finishOrder, user?.id])
}
