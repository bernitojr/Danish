import { useEffect, useState, lazy, Suspense } from 'react'
import { GameBoard } from '@/features/game/components/GameBoard'
import { LandingPage } from '@/features/landing/components/LandingPage'
import { useGameStore } from '@/features/game/store/gameStore'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'
import { AuthPage } from './features/Auth/AuthPage'
import { useTheme } from './features/profil/hooks/useTheme'
import { ProfilePage } from './features/profil/components/ProfilePage'
import { Nav } from './shared/Nav'
import { Toaster } from 'sonner'
// import { Nav } from './shared/components/Nav'

function Layout({
  children,
  onNavigate,
}: {
  children: React.ReactNode
  onNavigate: (to: string) => void
}) {
  return (
    <div>
      <Nav onNavigate={onNavigate} />
      <main>{children}</main>
    </div>
  )
}

const DebugPage = import.meta.env.DEV
  ? lazy(() =>
      import('@/features/game/components/DebugPage').then((m) => ({
        default: m.DebugPage,
      }))
    )
  : null

function GameRoute() {
  const { gameState, startGame, difficulty } = useGameStore()

  useEffect(() => {
    if (!gameState) startGame('You', difficulty)
  }, [])

  return <GameBoard />
}

function App() {
  useTheme()
  const [path, setPath] = useState(window.location.pathname)

  const { setUser, setProfile, setIsLoading, isLoading, user } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)

      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setProfile(profile)
            setIsLoading(false)
          })
      } else {
        setProfile(null)
        setIsLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(to: string) {
    const url = import.meta.env.BASE_URL.replace(/\/$/, '') + to
    history.pushState({}, '', url)
    setPath(url)
  }

  const base = import.meta.env.BASE_URL
  const cleanPath = path.replace(base.replace(/\/$/, ''), '') || '/'

  if (cleanPath === '/auth') return <AuthPage onNavigate={navigate} />

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Layout onNavigate={navigate}>
        {cleanPath === '/game' && <GameRoute />}
        {cleanPath === '/profile' &&
          (isLoading ? (
            <div>Chargement...</div>
          ) : !user ? (
            (navigate('/auth'), null)
          ) : (
            <ProfilePage />
          ))}
        {cleanPath === '/debug' && DebugPage && (
          <Suspense fallback={null}>
            <DebugPage />
          </Suspense>
        )}
        {cleanPath === '/' && <LandingPage onNavigate={navigate} />}
      </Layout>
    </>
  )
}

export default App
