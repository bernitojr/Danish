interface ProgressBarProps {
  value: number // 0-100
  color: string // hsl(var(--gold)) etc
}

export function ProgressBar({ value, color }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-2 rounded-full p-[1px]"
        style={{ border: `1px solid ${color}` }}
      >
        <div className="h-full rounded-full overflow-hidden bg-[hsl(var(--background-dark))]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${value}%`, backgroundColor: color }}
          />
        </div>
      </div>
      <span className="text-[11px] text-[hsl(var(--foreground-muted))] w-8 text-right shrink-0">
        {value}%
      </span>
    </div>
  )
}
