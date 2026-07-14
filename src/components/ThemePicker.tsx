import type { ThemeName } from '../types/app'

export const themes: Array<{
  id: ThemeName
  name: string
  emoji: string
}> = [
  { id: 'bubble', name: 'Bubble Pop', emoji: '🩷' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
  { id: 'mint', name: 'Mint Soda', emoji: '🌿' },
  { id: 'lavender', name: 'Lavender', emoji: '💜' },
  { id: 'butter', name: 'Butter Star', emoji: '⭐' },
  { id: 'night', name: 'Pixel Night', emoji: '🌙' },
]

type Props = {
  selected: ThemeName
  onSelect: (theme: ThemeName) => void
  compact?: boolean
}

export function ThemePicker({ selected, onSelect, compact = false }: Props) {
  return (
    <div className={compact ? 'theme-grid compact' : 'theme-grid'}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={
            selected === theme.id
              ? 'theme-option selected'
              : 'theme-option'
          }
          onClick={() => onSelect(theme.id)}
        >
          <span>{theme.emoji}</span>
          <small>{theme.name}</small>
        </button>
      ))}
    </div>
  )
}
