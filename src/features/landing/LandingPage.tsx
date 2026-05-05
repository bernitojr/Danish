// import { useTheme } from './hooks/useTheme';
// import { ThemeToggle } from './components/ThemeToggle';
import { useGameStore } from '../game/store/gameStore'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { QuickAccessCards } from './components/QuickAccessCard'
export function LandingPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void
}) {
  const store = useGameStore()
  console.log('Game store state on landing page:', store)

  // const { theme, toggleTheme } = useTheme();
  //    console.log('Current theme:', theme);

  return (
    <div>
      <Nav onNavigate={onNavigate} />
      <Hero />
      <QuickAccessCards onNavigate={onNavigate} />
    </div>
  )
}
