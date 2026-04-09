import { useEffect, useState } from 'react';
import type { Player } from '@/features/game/utils/types';

interface Props {
  players: Player[];
  finishOrder: string[];
  humanId: string;
  onHide: () => void;
  onReplay: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣'];
const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff9f1c'];

export function EndScreen({ players, finishOrder, humanId, onHide, onReplay }: Props) {
  const placement = finishOrder.indexOf(humanId) + 1;
  const human = players.find(p => p.id === humanId);
  const [counts, setCounts] = useState({ played: 0, wins: 0, podiums: 0 });

  useEffect(() => {
    if (!human) return;
    const target = {
      played: human.stats.gamesPlayed,
      wins: human.stats.placements[0],
      podiums: human.stats.placements[0] + human.stats.placements[1] + human.stats.placements[2],
    };
    let frame = 0;
    const steps = 40;
    const id = setInterval(() => {
      frame++;
      const t = frame / steps;
      setCounts({ played: Math.round(target.played * t), wins: Math.round(target.wins * t), podiums: Math.round(target.podiums * t) });
      if (frame >= steps) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [human]);

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 overflow-hidden">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="absolute w-2 h-2 rounded-sm pointer-events-none"
          style={{ background: COLORS[i % COLORS.length], left: `${(i * 5.3) % 100}%`, top: '-8px',
            animation: `fall ${2 + (i % 3) * 0.65}s ${(i * 0.18) % 1.2}s linear infinite` }} />
      ))}
      <div className="bg-white rounded-xl p-7 text-center min-w-[280px] z-10 relative shadow-2xl">
        <div className="text-5xl mb-2">{MEDALS[placement - 1] ?? '🎮'}</div>
        <h2 className="text-xl font-bold mb-1">{placement <= 3 ? 'Félicitations !' : 'Partie terminée'}</h2>
        <p className="text-gray-500 text-sm mb-4">Vous êtes <strong>{placement}ème</strong> !</p>
        <div className="flex justify-center gap-5 text-xs text-gray-400 mb-4">
          <span>Parties&nbsp;{counts.played}</span>
          <span>Victoires&nbsp;{counts.wins}</span>
          <span>Podiums&nbsp;{counts.podiums}</span>
        </div>
        <div className="text-left mb-5">
          {finishOrder.map((id, i) => (
            <p key={id} className="text-gray-700 py-0.5 text-sm">{MEDALS[i]} {players.find(p => p.id === id)?.name}</p>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={onHide} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm">Voir la fin</button>
          <button onClick={onReplay} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-sm">Rejouer</button>
        </div>
      </div>
    </div>
  );
}
