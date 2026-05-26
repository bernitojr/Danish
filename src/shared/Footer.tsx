import { useState, useEffect } from 'react'
import logoBc from '../assets/logoBernitoCorp.svg'

export function Footer() {
  const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <footer className="relative border-t border-[hsl(var(--border)/0.5)] bg-[hsl(var(--background)/0.5)] backdrop-blur-sm shadow-[0_-8px_20px_-12px_hsl(var(--shadow-color))]">
      <div className="max-w-7xl mx-auto flex items-center justify-end">
        <div className="flex items-center">
          <span className="text-md text-[hsl(var(--foreground))] font-sans font-medium">
            bernitoCorporation production
          </span>
          <img
            src={logoBc}
            alt="Bernito Corpation"
            className="w-[4rem] h-[4rem] object-contain"
            style={{ filter: isDark ? 'invert(1)' : 'none' }}
          />
        </div>
      </div>
    </footer>
  )
}
