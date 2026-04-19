import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/features/game/store/gameStore';
import type { BotDifficulty } from '@/features/game/utils/types';

const DIFFICULTY_LEVELS: { label: string; value: BotDifficulty }[] = [
  { label: 'Facile', value: 'easy' },
  { label: 'Moyen', value: 'medium' },
  { label: 'Difficile', value: 'hard' },
];

// Mirrors --color-card-play-* CSS vars for Framer Motion (JS-driven animation)
const DIFFICULTY_BG: Record<BotDifficulty, string> = {
  easy: '#fca5a5',
  medium: '#dc2626',
  hard: '#7f1d1d',
};

const DIFFICULTY_TEXT: Record<BotDifficulty, string> = {
  easy: '#7f1d1d',
  medium: '#fff',
  hard: '#fca5a5',
};

const AVATARS = [
  { initials: 'DK', color: 'bg-purple-600' },
  { initials: 'WC', color: 'bg-orange-500' },
  { initials: 'BC', color: 'bg-pink-600' },
];

interface LobbyPageProps {
  onNavigate: (path: string) => void;
}

export function LobbyPage({ onNavigate }: LobbyPageProps) {
  const { setDifficulty } = useGameStore();
  const [diffIndex, setDiffIndex] = useState(1);

  const currentDiff = DIFFICULTY_LEVELS[diffIndex]!;

  function handlePlay() {
    setDifficulty(currentDiff.value);
    onNavigate('/game');
  }

  return (
    <div className="min-h-screen text-white">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-6 px-4 text-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '500px',
              height: '500px',
              objectFit: 'contain',

            }}
          >
            <source src="./DWC_V4.webm" type="video/webm" />
          </video>
          <h1 className="font-black text-3xl md:text-5xl text-white drop-shadow-lg max-w-xl">
            Bienvenue sur le site officiel du Danish World Championship
          </h1>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-1">
          <motion.svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </motion.svg>
          <span className="text-white/70 text-sm">Scroll</span>
        </div>
      </section>

      {/* ── Cards ──────────────────────────────────────────────── */}
      <section className="w-full px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

          {/* Card 1 — Rules */}
          <LobbyCard style={{ backgroundColor: 'var(--color-card-rules)' }}>
            <h2 className="font-bold text-2xl md:text-3xl">Rules</h2>
            <p className="text-white/80 mt-2 text-sm">
              This game mode will help you start playing Danish
            </p>
            <button
              disabled
              className="mt-auto pt-6 self-start px-5 py-2 rounded-lg bg-white/20 text-white font-semibold opacity-50 cursor-not-allowed text-sm"
            >
              Voir les règles →
            </button>
          </LobbyCard>

          {/* Card 2 — Play */}
          <motion.div
            className="rounded-2xl p-8 shadow-xl flex flex-col min-h-[60vh]"
            animate={{ backgroundColor: DIFFICULTY_BG[currentDiff.value] }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <motion.h2
              className="font-bold text-2xl md:text-3xl"
              animate={{ color: DIFFICULTY_TEXT[currentDiff.value] }}
              transition={{ duration: 0.4 }}
            >
              Play a game
            </motion.h2>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-between text-sm font-semibold">
                {DIFFICULTY_LEVELS.map((d, i) => (
                  <motion.span
                    key={d.value}
                    animate={{
                      color: i === diffIndex
                        ? DIFFICULTY_TEXT[currentDiff.value]
                        : `${DIFFICULTY_TEXT[currentDiff.value]}99`,
                      fontWeight: i === diffIndex ? 700 : 400,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {d.label}
                  </motion.span>
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                value={diffIndex}
                onChange={(e) => setDiffIndex(Number(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            <button
              onClick={handlePlay}
              className="mt-auto pt-6 self-start px-6 py-2.5 rounded-lg bg-white/90 font-semibold text-gray-900 hover:bg-white transition-colors text-sm"
            >
              Jouer →
            </button>
          </motion.div>

          {/* Card 3 — Who are we */}
          <LobbyCard style={{ backgroundColor: 'var(--color-card-who)' }}>
            <h2 className="font-bold text-2xl md:text-3xl">Qui sommes-nous ?</h2>
            <p className="text-white/80 mt-2 text-sm">
              Une communauté de joueurs passionnés. Multijoueur à venir.
            </p>
            <div className="mt-auto pt-6 flex gap-3">
              {AVATARS.map((a) => (
                <div
                  key={a.initials}
                  className={`w-11 h-11 rounded-full ${a.color} flex items-center justify-center font-semibold text-xs text-white`}
                >
                  {a.initials}
                </div>
              ))}
            </div>
          </LobbyCard>

          {/* Card 4 — Profil */}
          <LobbyCard
            style={{ backgroundColor: 'var(--color-card-profil)' }}
            className="opacity-60 pointer-events-none select-none"
          >
            <h2 className="font-bold text-2xl md:text-3xl">Profil</h2>
            <div className="mt-auto pt-6 flex justify-center">
              <span className="italic text-white/70 text-base">Feature incoming</span>
            </div>
          </LobbyCard>

        </div>
      </section>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function LobbyCard({
  children,
  style,
  className = '',
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-8 shadow-xl flex flex-col min-h-[60vh] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
