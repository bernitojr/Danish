import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import logoDwc from '@/assets/logo-DWCV1.png'
import { AlertCircle, User, Lock } from 'lucide-react'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()

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
    } catch {
      setError('Identifiants incorrects.')
    } finally {
      // finally s'exécute toujours (succès ou erreur) — évite la duplication (DRY)
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="
    font-sans
    bg-[hsl(var(--background))]
    text-[hsl(var(--foreground))]
    antialiased
    flex flex-col items-center justify-center
    min-h-screen"
    >
      {/* // container du formulaire */}
      <div
        className="
    relative
    z-10
    w-full
    max-w-[400px]
    bg-[hsl(var(--card))]
    border border-[hsl(var(--border)/0.7)]
    rounded-[calc(var(--radius)*2)]
    p-10 pt-12 pb-8
    shadow-[0_0_0_1px_hsl(var(--primary)/0.06),0_24px_64px_hsl(0_0%_0%/0.6),0_4px_16px_hsl(0_0%_0%/0.35)]
    flex flex-col gap-[1.6rem]
    border-t-2 border-t-[hsl(var(--primary))]

    card-container"
        data-mode={mode}
      >
        {/* header du form */}
        <div
          className="flex
    flex-col
    items-center
    gap-[0.7rem]
    text-center"
        >
          <img
            className="
            w-12
     h-12
    object-contain
    filter
    drop-shadow-[0_0_12px_hsl(var(--primary)/0.35)]
    transition duration-300"
            src={logoDwc}
            alt="Logo DWCV1"
          />

          <div
            className=" font-display
    font-extrabold
    text-[1rem]
    tracking-[-0.02em]
    text-[hsl(var(--foreground))]"
          >
            Danish World Championship
          </div>
          <div>
            <div className="flex items-center gap-[0.45rem] font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[hsl(var(--foreground-muted))]">
              {/* <span className="blink-dot" /> */}
              <span>
                {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
              </span>
            </div>
          </div>
        </div>

        {/* toogler login/signup */}
        <div
          className="
    relative
    grid
    grid-cols-2
    bg-[hsl(var(--background))]
    border border-[hsl(var(--border))]
    rounded-full
    p-1
  "
        >
          {/* thumb animé — positionné en absolu, SEUL dans ce div */}
          <div
            className={`
    absolute top-1 left-1
    w-[calc(50%-4px)] h-[calc(100%-8px)]
    rounded-full
    bg-[hsl(var(--primary)/0.18)]
    border border-[hsl(var(--primary)/0.45)]
    shadow-[0_0_12px_hsl(var(--primary)/0.15)]
    transition-transform duration-[280ms] ease-[cubic-bezier(0.65,0.05,0.35,1)]
    z-[1]
    toggle-thumb
  `}
          />

          {/* boutons — en dehors du thumb, dans la grille */}
          <button
            onClick={() => setMode('login')}
            className={`relative z-[2] py-[0.55rem] text-[0.78rem] font-semibold transition-colors duration-200
    ${
      mode === 'login'
        ? 'text-[hsl(var(--primary))]'
        : 'text-[hsl(var(--foreground-muted))]'
    }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`relative z-[2] py-[0.55rem] text-[0.78rem] font-semibold transition-colors duration-200`}
          >
            S'inscrire
          </button>
        </div>

        <div
          className=" flex
    flex-col
    gap-[0.95rem]"
        >
          <div
            className="flex
    flex-col
    gap-[0.4rem]"
          >
            {/* champ username */}
            <label
              htmlFor="username"
              className="font-mono
    text-[0.58rem]
    uppercase
    tracking-[0.14em]
    text-[hsl(var(--foreground-muted))]"
            >
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground-muted))]"
              />
              <input
                className="w-full
    bg-[hsl(var(--background))]
    border border-[hsl(var(--border))]
    rounded-[calc(var(--radius)-2px)]
    py-[0.65rem]
    pr-[0.85rem]
    pl-[2.4rem]
    font-sans
    text-[0.82rem]
    text-[hsl(var(--foreground))]
    outline-none
    transition-[border-color,box-shadow]
    duration-150
    appearance-none"
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div
            className="flex
    flex-col
    gap-[0.4rem]"
          >
            {/* champ password */}
            <label
              htmlFor="password"
              className="font-mono
    text-[0.58rem]
    uppercase
    tracking-[0.14em]
    text-[hsl(var(--foreground-muted))]"
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground-muted))]"
              />
              <input
                className="w-full
    bg-[hsl(var(--background))]
    border border-[hsl(var(--border))]
    rounded-[calc(var(--radius)-2px)]
    py-[0.65rem]
    pr-[0.85rem]
    pl-[2.4rem]
    font-sans
    text-[0.82rem]
    text-[hsl(var(--foreground))]
    outline-none
    transition-[border-color,box-shadow]
    duration-150
    appearance-none"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {/* message erreur si error !== null */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] bg-red-500/10 border border-red-500/30 text-[0.8rem] text-red-400">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {/* bouton submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full
    py-[0.72rem] px-4
    bg-[hsl(var(--primary)/0.14)]
    border border-[hsl(var(--primary)/0.45)]
    rounded-[calc(var(--radius)-2px)]
    font-sans
    text-[0.84rem]
    font-semibold
    text-[hsl(var(--primary))]
    cursor-pointer
    transition-[background,border-color,box-shadow,transform,color]
    duration-200
    flex items-center justify-center
    gap-2
    mt-1
    hover:bg-[hsl(var(--primary)/0.22)]
    hover:border-[hsl(var(--primary)/0.7)]
    hover:shadow-[0_0_18px_hsl(var(--primary)/0.15)]
    submit-btn
    `}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
