import * as Cards from '@letele/playing-cards';
import type { Card } from '@/features/game/utils/types';

// Maps our suit/rank to the @letele/playing-cards component name
function getCardComponentName(card: Card): string {
  const suitMap: Record<string, string> = {
    hearts: 'H', diamonds: 'D', clubs: 'C', spades: 'S',
  };
  const rankMap: Record<string, string> = {
    A: 'a', J: 'j', Q: 'q', K: 'k',
  };
  const suit = suitMap[card.suit];
  const rank = rankMap[card.rank] ?? card.rank;
  return `${suit}${rank}`;
}

type CardComponent = React.FC<React.SVGProps<SVGSVGElement>>;
const cardMap = Cards as unknown as Record<string, CardComponent>;

interface GameCardProps {
  card: Card | null;
  state?: 'normal' | 'selected' | 'optimal' | 'chosen' | 'hidden' | 'empty';
  onClick?: () => void;
  disabled?: boolean;
}

export function GameCard({ card, state = 'normal', onClick, disabled = false }: GameCardProps) {
  const ringClass =
    state === 'selected' ? 'ring-2 ring-green-400' :
    state === 'optimal'  ? 'ring-2 ring-yellow-400' :
    state === 'chosen'   ? 'ring-2 ring-blue-400' :
    '';

  const baseClass = 'w-16 h-[89px] rounded-md select-none flex-shrink-0';
  const cursorClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : onClick
    ? 'cursor-pointer hover:scale-105 transition-transform'
    : '';

  if (state === 'empty') {
    return (
      <div className={`${baseClass} border-2 border-dashed border-white/20 bg-white/5`} />
    );
  }

  if (state === 'hidden' || card === null) {
    const Back = cardMap['B1'];
    return (
      <div
        className={`${baseClass} ${ringClass} ${cursorClass} overflow-hidden`}
        onClick={disabled ? undefined : onClick}
      >
        <Back className="w-full h-full" />
      </div>
    );
  }

  const name = getCardComponentName(card);
  const CardSvg = cardMap[name];

  if (!CardSvg) {
    return (
      <div className={`${baseClass} ${ringClass} ${cursorClass} bg-white/10 flex items-center justify-center text-xs text-white`}>
        {card.rank}
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} ${ringClass} ${cursorClass} overflow-hidden`}
      onClick={disabled ? undefined : onClick}
    >
      <CardSvg className="w-full h-full" />
    </div>
  );
}
