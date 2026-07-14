import type { PageName } from '../types/app'

type Props = {
  page: PageName
  onNavigate: (page: PageName) => void
  onQuickNote: () => void
}

export function BottomNav({
  page,
  onNavigate,
  onQuickNote,
}: Props) {
  return (
    <nav className="bottom-nav y2k-bottom-nav">
      <button
        type="button"
        className={page === 'home' ? 'nav-item active' : 'nav-item'}
        onClick={() => onNavigate('home')}
      >
        <span>♡</span>
        <small>홈</small>
      </button>

      <button
        type="button"
        className={
          page === 'projects' || page === 'write'
            ? 'nav-item active'
            : 'nav-item'
        }
        onClick={() => onNavigate('projects')}
      >
        <span>▱</span>
        <small>작품</small>
      </button>

      <button
        className="quick-add"
        type="button"
        onClick={onQuickNote}
        aria-label="빠른 메모"
      >
        ＋
      </button>

      <button
        type="button"
        className={page === 'notes' ? 'nav-item active' : 'nav-item'}
        onClick={() => onNavigate('notes')}
      >
        <span>▤</span>
        <small>메모</small>
      </button>

      <button
        type="button"
        className={
          page === 'settings' ? 'nav-item active' : 'nav-item'
        }
        onClick={() => onNavigate('settings')}
      >
        <span>⚙</span>
        <small>설정</small>
      </button>
    </nav>
  )
}
