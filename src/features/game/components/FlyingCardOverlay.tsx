import { AnimatePresence, motion } from 'framer-motion'
import { useCardAnimation } from '@/features/game/contexts/CardAnimationContext'
import logoBernitoCorp from '@/assets/logoBernitoCorp.svg'

function FlyingCardItem({
  fromRect,
  toRect,
  delay = 0,
  type = 'card',
  onComplete,
}: {
  fromRect: DOMRect
  toRect: DOMRect
  delay?: number
  type?: 'card' | 'attack'
  onComplete?: () => void
}) {
  const isAttack = type === 'attack'

  return (
    <motion.div
      initial={{
        left: fromRect.left + fromRect.width / 2 - 24,
        top: fromRect.top + fromRect.height / 2 - 24,
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        left: toRect.left + toRect.width / 2 - 24,
        top: toRect.top + toRect.height / 2 - 24,
        scale: [0.5, 1.4, 1],
        opacity: [0, 1, 1, 0],
        rotate: isAttack ? [0, -20, 360] : [-5, 10, -3, 0],
      }}
      transition={{
        duration: 0.4,
        delay: delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        position: 'fixed',
        width: 48,
        height: 48,
        zIndex: 9999,
        pointerEvents: 'none',
        borderRadius: isAttack ? '50%' : 6,
        overflow: 'hidden',
      }}
      onAnimationComplete={onComplete}
    >
      {isAttack ? (
        <div
          className="w-full h-full flex items-center justify-center rounded-full text-2xl"
          style={{
            background:
              'radial-gradient(circle, hsl(var(--delete)) 0%, hsl(var(--primary)) 100%)',
            boxShadow: '0 0 20px hsl(var(--delete) / 0.8)',
          }}
        >
          ⚔
        </div>
      ) : (
        <div className="w-full h-full relative bg-[#e8dcc8] rounded-md border border-[#c4a882]">
          <div
            className="absolute inset-[3px] rounded-[5px] border border-[#c4a88266]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg,#c4a88218 0px,#c4a88218 2px,transparent 2px,transparent 8px)',
            }}
          />
          <img
            src={logoBernitoCorp}
            alt=""
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 object-contain pointer-events-none"
          />
        </div>
      )}
    </motion.div>
  )
}

export function FlyingCardOverlay() {
  const { flyingCards } = useCardAnimation()

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      <AnimatePresence>
        {flyingCards.map(({ id, fromRect, toRect, delay, type, onComplete }) => (
          <FlyingCardItem
            key={id}
            fromRect={fromRect}
            toRect={toRect}
            delay={delay}
            type={type}
            onComplete={onComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
