import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { GameBoard } from '@/features/game/components/GameBoard'
import { LandingPage } from '@/features/landing/components/LandingPage'
import { AuthPage } from './features/Auth/AuthPage'
import { ProfilePage } from './features/profil/pages/ProfilePage'
import { PublicProfilePage } from './features/profil/pages/PublicProfilePage'
import { LeaderboardPage } from './features/leaderboard/pages/LeaderboardPage'
import { Nav } from './shared/Nav'
import { Footer } from './shared/Footer'
import { useTheme } from './hooks/useTheme'
import { useAuthStore } from './stores/useAuthStore'
import { useGameStore } from '@/features/game/store/gameStore'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { FeedPage } from './features/feed/pages/FeedPage'

const queryClient = new QueryClient()

const DebugPage = import.meta.env.DEV
  ? lazy(() =>
      import('@/features/game/components/DebugPage').then((m) => ({
        default: m.DebugPage,
      }))
    )
  : null

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return null
  if (!user) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function GameRoute() {
  const { gameState, startGame, difficulty } = useGameStore()
  useEffect(() => {
    if (!gameState) startGame('You', difficulty)
  }, [])
  return <GameBoard />
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Nav />
      <main className="flex flex-1 overflow-hidden min-h-0">{children}</main>
    </div>
  )
}

function AppContent() {
  useTheme()
  const { setUser, setProfile, setIsLoading } = useAuthStore()

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

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/game"
          element={
            <GameLayout>
              <GameRoute />
            </GameLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <Layout>
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <Layout>
              <ProtectedRoute>
                <PublicProfilePage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/feed"
          element={
            <Layout>
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        {DebugPage && (
          <Route
            path="/debug"
            element={
              <Suspense fallback={null}>
                <DebugPage />
              </Suspense>
            }
          />
        )}
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/Danish">
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
