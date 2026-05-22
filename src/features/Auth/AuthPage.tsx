import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle, User, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// login → --primary (vert), signup → --accent (autre couleur)
// La shadow est toujours visible (pas de hover), elle change de couleur avec le mode
function getCardBoxShadow(mode: 'login' | 'signup'): string {
  const color = mode === 'login' ? 'var(--primary)' : 'var(--accent)'
  return `
    0 0 0 1px hsl(${color} / 0.5),
    0 20px 50px -12px hsl(${color} / 0.35),
    inset 0 2px 0 0 hsl(${color})
  `
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false)
  const { signIn, signUp } = useAuth()

  // Variable CSS d'accentuation active — tout s'aligne dessus
  const accentVar = mode === 'login' ? '--primary' : '--accent'
  const accentHsl = `hsl(var(${accentVar}))`

  const submitLabel = isSubmitting
    ? 'Envoi...'
    : mode === 'login'
      ? 'Se connecter'
      : "S'inscrire"

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await signIn(username, password)
      } else {
        await signUp(username, password)
      }
      navigate('/')
    } catch {
      setError('Identifiants incorrects.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit()
    }
  }

  return (
    <div className="font-sans bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased flex flex-col items-center justify-center min-h-screen">
      <div
        className="relative z-10 w-full max-w-[400px] bg-[hsl(var(--card))] rounded-[calc(var(--radius)*2)] p-10 pt-12 pb-8 flex flex-col gap-[1.6rem] transition-[box-shadow] duration-500 card-container"
        data-mode={mode}
        style={{ boxShadow: getCardBoxShadow(mode) }}
      >
        {/* Header */}
        <div className="flex flex-col gap-[0.5rem] items-center text-center">
          <h1 className="font-display font-extrabold leading-none tracking-tight text-[hsl(var(--foreground))] text-[1.6rem]">
            Danish{' '}
            <span className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
              World
            </span>{' '}
            Championship
          </h1>
          <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[hsl(var(--foreground-muted))]">
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </div>
        </div>

        {/* Toggle login / signup */}
        <div className="relative grid grid-cols-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-full p-1">
          {/* Thumb animé — couleur suit le mode */}
          <div
            className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-full transition-all duration-[280ms] ease-[cubic-bezier(0.65,0.05,0.35,1)] z-[1]"
            style={{
              transform:
                mode === 'signup'
                  ? 'translateX(calc(100% + 4px))'
                  : 'translateX(0)',
              background: `hsl(var(${accentVar}) / 0.18)`,
              border: `1px solid hsl(var(${accentVar}) / 0.45)`,
              boxShadow: `0 0 12px hsl(var(${accentVar}) / 0.15)`,
            }}
          />
          <button
            onClick={() => setMode('login')}
            className="relative z-[2] py-[0.55rem] text-[0.78rem] font-semibold transition-colors duration-200"
            style={{
              color:
                mode === 'login' ? accentHsl : 'hsl(var(--foreground-muted))',
            }}
          >
            Se connecter
          </button>
          <button
            onClick={() => setMode('signup')}
            className="relative z-[2] py-[0.55rem] text-[0.78rem] font-semibold transition-colors duration-200"
            style={{
              color:
                mode === 'signup' ? accentHsl : 'hsl(var(--foreground-muted))',
            }}
          >
            S'inscrire
          </button>
        </div>

        <div className="flex flex-col gap-[0.95rem]">
          {/* Username */}
          <div className="flex flex-col gap-[0.4rem]">
            <label
              htmlFor="username"
              className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[hsl(var(--foreground-muted))]"
            >
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground-muted))]"
              />
              <input
                id="username"
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[calc(var(--radius)-2px)] py-[0.65rem] pr-[0.85rem] pl-[2.4rem] font-sans text-[0.82rem] text-[hsl(var(--foreground))] outline-none transition-[border-color,box-shadow] duration-150 appearance-none"
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[0.4rem]">
            <label
              htmlFor="password"
              className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[hsl(var(--foreground-muted))]"
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground-muted))]"
              />
              <input
                id="password"
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-[calc(var(--radius)-2px)] py-[0.65rem] pr-[0.85rem] pl-[2.4rem] font-sans text-[0.82rem] text-[hsl(var(--foreground))] outline-none transition-[border-color,box-shadow] duration-150 appearance-none"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] bg-red-500/10 border border-red-500/30 text-[0.8rem] text-red-400">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit — background + border + texte suivent le mode */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            onMouseEnter={() => setIsHoveringSubmit(true)}
            onMouseLeave={() => setIsHoveringSubmit(false)}
            className="w-full py-[0.72rem] px-4 font-sans text-[0.84rem] font-semibold cursor-pointer flex items-center justify-center gap-2 mt-1 rounded-[calc(var(--radius)-2px)] transition-[background,border-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isHoveringSubmit
                ? `hsl(var(${accentVar}) / 0.28)`
                : `hsl(var(${accentVar}) / 0.14)`,
              border: isHoveringSubmit
                ? `1px solid hsl(var(${accentVar}) / 0.8)`
                : `1px solid hsl(var(${accentVar}) / 0.45)`,
              color: accentHsl,
            }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
