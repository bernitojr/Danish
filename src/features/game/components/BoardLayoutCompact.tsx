import { useGameStore } from '@/features/game/store/gameStore'
import { BotZone } from './BotZone'
import { CentrePiles } from './CentrePiles'
import { HumanZone } from './HumanZone'

export function BoardLayoutCompact() {
  const players = useGameStore((s) => s.gameState?.players)
  const [, bot1, bot2, bot3] = players ?? []

  return (
    <div className="absolute inset-0">
      {/* FEUTRE — vrai ovale desktop (bois + tapis + quadrillage + liseré),
          étiré au paysage. inset = le "sol" sombre autour de la table. */}
      <div className="pointer-events-none absolute" style={{ inset: '8% 4%' }}>
        {/* Bois (couche externe) — borderRadius fixe à ajuster */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '120px / 90px',
            background:
              'radial-gradient(ellipse at 30% 30%,#8b5a2b,#6b3a1f 60%,#3d1f0a)',
            boxShadow:
              '0 0 0 4px #8b6030,0 0 0 7px #5a3510,0 20px 80px rgba(0,0,0,0.7)',
          }}
        />
        {/* Tapis vert */}
        <div
          style={{
            position: 'absolute',
            inset: 22,
            borderRadius: '120px / 90px',
            background:
              'radial-gradient(ellipse at 50% 35%,#1e6b3d 0%,#1a5c35 50%,#0f3d22 100%)',
            boxShadow: 'inset 0 4px 30px rgba(0,0,0,0.4)',
          }}
        />
        {/* Quadrillage */}
        <div
          style={{
            position: 'absolute',
            inset: 22,
            borderRadius: '120px / 90px',
            backgroundImage:
              'repeating-linear-gradient(0deg,rgba(255,255,255,0.012) 0px,transparent 1px,transparent 12px),repeating-linear-gradient(90deg,rgba(255,255,255,0.012) 0px,transparent 1px,transparent 12px)',
            backgroundSize: '12px 12px',
          }}
        />
        {/* Liseré */}
        <div
          style={{
            position: 'absolute',
            inset: 30,
            borderRadius: '120px / 90px',
            border: '1.5px solid rgba(180,140,40,0.2)',
          }}
        />
      </div>

      {/* PLACEHOLDERS sièges — positions de départ à ajuster à l'œil */}
      {/* Bot 2 (haut) */}
      {bot2 && (
        <div
          style={{
            position: 'absolute',
            top: '4%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <BotZone player={bot2} idx={2} bubbleDirection="down" />
        </div>
      )}
      {/* Bot 1 (gauche) */}
      {bot1 && (
        <div
          style={{
            position: 'absolute',
            top: '46%',
            left: '2%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        >
          <BotZone player={bot1} idx={1} bubbleDirection="right" />
        </div>
      )}
      {/* Bot 3 (droite) */}
      {bot3 && (
        <div
          style={{
            position: 'absolute',
            top: '46%',
            right: '2%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        >
          <BotZone player={bot3} idx={3} bubbleDirection="left" />
        </div>
      )}
      {/* CENTRE — piles (autonome, wrapper centré ; ne se centre pas lui-même) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
        }}
      >
        <CentrePiles />
      </div>

      {/* BAS — main humaine. Rendue directement : HumanZone s'ancre lui-même
          (absolute bottom:8 / left-1/2 / z-20) → au premier plan et cliquable. */}
      <HumanZone />
    </div>
  )
}
