import { useGameStore } from '@/features/game/store/gameStore'
import useFitScale from '@/features/game/hooks/useFitScale'
import { BotZone } from './BotZone'
import { CentrePiles } from './CentrePiles'
import { HumanZone } from './HumanZone'
import { PreparationPanel } from './PreparationPanel'

// Design box fixe (même pattern que GameBoard desktop) mise à l'échelle
// uniformément. Budget vertical mesuré au rendu (8 états de jeu, W=30) :
// zones bot/humain = boîte 116 (visuel jusqu'à 120, les cartes visibles
// dépassent de 4px en haut), bande centrale = boîte 42 (visuel jusqu'à 45).
export const COMPACT_DESIGN_W = 780
export const COMPACT_DESIGN_H = 340

// Coordonnées Y des boîtes. Pire cas visuel 8+120+45+120+8 = 301px ; les 39px
// restants vont en deux marges de 19,5px autour de la bande centrale (≥ 15px
// exigés : chevauchements de 12,5–15px mesurés à l'étape 2).
const TOP_BOT_Y = 12 // visuel 8 → 128
const CENTRE_Y = 149 // boîte 149 → 191, centrée sur COMPACT_DESIGN_H / 2
const SIDE_BOT_Y = 112 // boîte 112 → 228, centrée verticalement
const SIDE_BOT_X = 16
// Zone humaine : HumanZone s'ancre elle-même en bottom: 8 → boîte 216 → 332.

export function BoardLayoutCompact() {
  const players = useGameStore((s) => s.gameState?.players)
  const [, bot1, bot2, bot3] = players ?? []
  const { ref, scale } = useFitScale(COMPACT_DESIGN_W, COMPACT_DESIGN_H)

  return (
    <div ref={ref} className="absolute inset-0">
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: COMPACT_DESIGN_W,
          height: COMPACT_DESIGN_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {/* FEUTRE — vrai ovale desktop (bois + tapis + quadrillage + liseré),
            étiré au paysage, dans la design box. */}
        <div className="pointer-events-none absolute" style={{ inset: '8% 4%' }}>
          {/* Bois (couche externe) */}
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

        {/* Bot 2 (haut) */}
        {bot2 && (
          <div
            style={{
              position: 'absolute',
              top: TOP_BOT_Y,
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
              top: SIDE_BOT_Y,
              left: SIDE_BOT_X,
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
              top: SIDE_BOT_Y,
              right: SIDE_BOT_X,
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
            top: CENTRE_Y,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
          }}
        >
          <CentrePiles />
        </div>

        {/* Panneau de préparation — centré sur la bande libre mesurée
            (design y 128 → 212, centre 170 = COMPACT_DESIGN_H / 2). w-max :
            sans lui, left:50% bornerait la largeur à 390 alors que la carte en
            fait 421,4. z 16 → au-dessus des piles (15) et sous HumanZone (20),
            qu'il ne chevauche pas (bande libre bornée à y 212). */}
        <div
          className="w-max"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 16,
          }}
        >
          <PreparationPanel />
        </div>

        {/* BAS — main humaine. Rendue directement : HumanZone s'ancre lui-même
            (absolute bottom:8 / left-1/2 / z-20) → au premier plan et cliquable. */}
        <HumanZone />
      </div>
    </div>
  )
}
