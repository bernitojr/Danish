import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logoDwc from '@/assets/logo-DWCV1.png'

export function CompactGameBar() {
  const navigate = useNavigate()

  return (
    <header
      className="flex flex-none items-center gap-3 px-3"
      style={{
        height: 48,
        background: 'hsl(var(--background))',
        borderBottom: '1px solid hsl(var(--border))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
      }}
    >
      <button
        type="button"
        aria-label="Quitter la partie"
        onClick={() => navigate('/')}
        className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[hsl(var(--border)/0.4)]"
      >
        <ArrowLeft size={20} color="hsl(var(--foreground))" />
      </button>

      <img src={logoDwc} alt="Logo DWC" className="h-7 w-7 object-contain" />
    </header>
  )
}
