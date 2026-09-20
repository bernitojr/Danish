import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { GameState } from '@/features/game/utils/types'
import { useAuthStore } from '@/stores/useAuthStore'
import { useGameStore } from '@/features/game/store/gameStore'

/**
 * Enregistre le placement de l'humain dans `game_results`, une fois par partie.
 *
 * Le verrou vit dans le store, pas dans un ref local : `GameBoard` est démonté
 * dès qu'on quitte /game, et un ref y repartirait à `false` alors que le store
 * a gardé la partie terminée — la même partie était alors réinsérée au retour.
 * Inversement, un ref jamais remis à zéro empêchait toute partie suivante
 * d'être enregistrée, `GameBoard` ne se démontant pas entre deux parties.
 * `startGame` et `resetGame` remettent le marqueur à `false`.
 */
export function useGameResult(gameState: GameState | null) {
  const { user } = useAuthStore()

  const phase = gameState?.phase
  const finishOrder = gameState?.finishOrder
  const userId = user?.id

  useEffect(() => {
    if (!phase || !finishOrder) return
    if (!finishOrder.includes('human')) return
    // Sans utilisateur connecté, l'insert partait sans colonne user_id du tout
    // (JSON.stringify supprime les clés undefined) et se faisait rejeter en 401.
    if (!userId) return

    // Lu impérativement : on n'a besoin des valeurs qu'au moment de décider,
    // et s'y abonner ferait re-rendre GameBoard à chaque bascule.
    const { resultRecorded, markResultRecorded, isDebugMode } =
      useGameStore.getState()
    // Une partie montée depuis /debug n'est jamais enregistrée : DebugPage
    // écrit directement dans le store (isDebugMode: true) sans passer par
    // startGame, donc sans remettre le marqueur à zéro.
    if (isDebugMode) return
    if (resultRecorded) return
    markResultRecorded()

    const placement = finishOrder.indexOf('human') + 1
    const insertResult = async () => {
      const { error } = await supabase
        .from('game_results')
        .insert({ user_id: userId, placement })
      if (error) console.error('Erreur insert game_results:', error)
    }

    insertResult()
  }, [phase, finishOrder, userId])
}
