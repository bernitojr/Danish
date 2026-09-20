import { Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

/**
 * Overlay plein écran invitant à passer le téléphone en paysage.
 * S'affiche uniquement sur mobile tenu en portrait ; sinon ne rend rien.
 */
export function RotateDevicePrompt() {
  const isPhonePortrait = useMediaQuery(
    '(pointer: coarse) and (orientation: portrait) and (max-width: 600px)'
  )

  if (!isPhonePortrait) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 px-8 text-center"
      style={{ backgroundColor: 'hsl(var(--background-dark))' }}
    >
      <motion.div
        animate={{ rotate: [0, 90, 90, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Smartphone size={64} color="hsl(var(--primary))" />
      </motion.div>

      <h2 className="font-display text-2xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
        Tourne ton téléphone
      </h2>

      <p className="text-[hsl(var(--foreground-muted))]">
        Le Danish se joue en mode paysage.
      </p>
    </div>
  )
}
