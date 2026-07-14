import type { CountMode } from '../types/app'

type Props = {
  title: string
  count: number
  dailyGoal: number
  countMode: CountMode
  projectCount: number
  onCountModeChange: (mode: CountMode) => void
  onDailyGoalChange: (goal: number) => void
  onWrite: () => void
  onProjects: () => void
  onSynopsis: () => void
  onNotes: () => void
  onTheme: () => void
}

export function HomePage({
  title,
  count,
  dailyGoal,
  countMode,
  projectCount,
  onCountModeChange,
  onDailyGoalChange,
  onWrite,
  onProjects,
  onSynopsis,
  onNotes,
  onTheme,
}: Props) {
  const progress = Math.min(
    Math.round((count / Math.max(dailyGoal, 1)) * 100),
    100,
  )
  const remaining = Math.max(dailyGoal - count, 0)

  return (
    <div className="app-shell dashboard-shell">
      <header className="dashboard-topbar">
        <button className="top-pill" type="button" onClick={onTheme}>
          테마 <span>✦</span>
        </button>

        <div className="mini-logo">WTW</div>

        <button
          className="current-project-pill"
          type="button"
          onClick={onProjects}
        >
          <small>현재 작품</small>
          <strong>{title}</strong>
          <span>⌄</span>
        </button>
      </header>

      <main className="dashboard-main">
        <section className="hero-logo" aria-label="What to Write">
          <div className="hero-halftone hero-halftone-left" />
          <div className="hero-halftone hero-halftone-right" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="hero-star star-one">✦</span>
          <span className="hero-star star-two">★</span>
          <span className="hero-star star-three">✧</span>

          <div className="hero-wordmark">
            <span className="hero-word">WHAT</span>
            <span className="hero-to">TO</span>
            <span className="hero-word">WRITE</span>
          </div>

          <p>오늘도 한 줄, 나만의 이야기를 시작해요</p>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel today-panel">
            <div className="panel-heading">
              <h2>☆ TODAY&apos;S WRITING ☆</h2>
            </div>

            <div className="today-content">
              <div className="today-project-row">
                <span className="file-icon pink-file">▤</span>
                <div>
                  <small>현재 작품</small>
                  <strong>{title}</strong>
                </div>
              </div>

              <div className="today-count">
                <strong>{count.toLocaleString()}자</strong>
                <span>작성 중</span>
              </div>

              <label className="goal-control">
                <span>목표</span>
                <input
                  type="number"
                  min="1"
                  value={dailyGoal}
                  onChange={(event) =>
                    onDailyGoalChange(
                      Math.max(Number(event.target.value), 1),
                    )
                  }
                />
                <b>자</b>
              </label>

              <div className="count-mode-block">
                <span>글자 수 기준</span>
                <div className="segmented-control">
                  <button
                    type="button"
                    className={
                      countMode === 'withoutSpaces' ? 'active' : ''
                    }
                    onClick={() => onCountModeChange('withoutSpaces')}
                  >
                    공백 제외
                  </button>

                  <button
                    type="button"
                    className={
                      countMode === 'withSpaces' ? 'active' : ''
                    }
                    onClick={() => onCountModeChange('withSpaces')}
                  >
                    공백 포함
                  </button>
                </div>
              </div>

              <div className="y2k-progress">
                <div className="y2k-progress-track">
                  <div
                    className="y2k-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="y2k-progress-copy">
                  <span>☆ {progress}% 완료</span>
                  <span>{remaining.toLocaleString()}자 남음</span>
                </div>
              </div>

              <button
                className="write-primary-button"
                type="button"
                onClick={onWrite}
              >
                <span>☆</span>
                {count ? '이어쓰기' : '첫 문장 쓰기'}
                <b>→</b>
              </button>
            </div>
          </article>

          <article className="dashboard-panel projects-preview-panel">
            <div className="panel-heading panel-heading-row">
              <h2>☆ MY PROJECTS ☆</h2>
              <button type="button" onClick={onProjects}>
                전체 보기
              </button>
            </div>

            <div className="projects-preview-list">
              <button
                className="preview-project active-preview"
                type="button"
                onClick={onWrite}
              >
                <span className="folder-icon folder-pink">▱</span>
                <div>
                  <strong>{title}</strong>
                  <small>{count.toLocaleString()}자</small>
                </div>
                <span className="preview-status">NOW</span>
              </button>

              <button
                className="preview-project add-preview"
                type="button"
                onClick={onProjects}
              >
                <span className="folder-icon folder-mint">＋</span>
                <div>
                  <strong>새 작품 만들기</strong>
                  <small>현재 {projectCount}개 작품</small>
                </div>
                <span>→</span>
              </button>
            </div>

            <div className="dashboard-shortcuts">
              <button type="button" onClick={onSynopsis}>
                <span className="shortcut-icon shortcut-green">✣</span>
                <b>시놉시스</b>
                <small>현재 작품 흐름 정리</small>
              </button>

              <button type="button" onClick={onNotes}>
                <span className="shortcut-icon shortcut-yellow">◉</span>
                <b>메모</b>
                <small>아이디어 빠르게 기록</small>
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
