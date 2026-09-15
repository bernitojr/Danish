import { useCallback, useRef, useState } from 'react'

export default function useFitScale(
  baseWidth: number,
  baseHeight: number,
): { ref: (node: HTMLDivElement | null) => void; scale: number } {
  const [scale, setScale] = useState(1)
  const observerRef = useRef<ResizeObserver | null>(null)

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      // Détache l'observer précédent (changement de node ou démontage).
      observerRef.current?.disconnect()
      observerRef.current = null

      if (!node) return

      const measure = () => {
        const next = Math.min(
          node.clientWidth / baseWidth,
          node.clientHeight / baseHeight,
          1,
        )
        setScale(next)
      }

      measure() // mesure synchrone dès l'attache → pas de flash
      const observer = new ResizeObserver(measure)
      observer.observe(node)
      observerRef.current = observer
    },
    [baseWidth, baseHeight],
  )

  return { ref, scale }
}
