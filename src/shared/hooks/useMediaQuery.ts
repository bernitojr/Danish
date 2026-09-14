import { useCallback, useMemo, useSyncExternalStore } from 'react'

/**
 * Renvoie `true` si la media query CSS matche actuellement, et se met à jour
 * en temps réel (resize, rotation) via `matchMedia` + `useSyncExternalStore`.
 */
export default function useMediaQuery(query: string): boolean {
  const mql = useMemo(() => window.matchMedia(query), [query])

  const subscribe = useCallback(
    (callback: () => void) => {
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [mql],
  )

  const getSnapshot = useCallback(() => mql.matches, [mql])

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

