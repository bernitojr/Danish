import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return createPortal(
    <div
      className="    fixed inset-0 z-50
    bg-[hsl(var(--background)/0.55)]
    backdrop-blur-sm
    flex items-center justify-center
    p-4"
      onClick={onClose}
    >
      <div
        className="    bg-[hsl(var(--card))]
    text-[hsl(var(--foreground))]
    rounded-[calc(var(--radius)*2)]
    shadow-[0_0_0_1px_hsl(var(--border)/0.4),0_24px_64px_hsl(var(--shadow-color))]
    max-w-[420px] w-full
    p-6
    relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold tracking-tight mb-4">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body
  )
}
