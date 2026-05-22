import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../game/store/gameStore'
import { Hero } from './Hero'
import { QuickAccessCards } from './QuickAccessCard'

export function LandingPage() {
  const store = useGameStore()
  const navigate = useNavigate()

  return (
    <div>
      <Hero />
      <QuickAccessCards onNavigate={navigate} />
    </div>
  )
}
