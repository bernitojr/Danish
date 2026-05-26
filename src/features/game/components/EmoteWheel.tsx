const EMOTES = ['😊', '😐', '😍', '😵']

interface Props {
  onEmote: (emote: string) => void
}

export function EmoteWheel({ onEmote }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 ">
      {EMOTES.map((e) => (
        <button
          key={e}
          onClick={() => onEmote(e)}
          className="text-3xl p-2 hover:scale-125 transition-transform leading-none flex items-center justify-center w-12 h-12 rounded-lg"
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
        >
          {e}
        </button>
      ))}
    </div>
  )
}
