import { useEffect, useMemo, useState } from 'react'
import './index.css'

type ThemeName =
  | 'bubble'
  | 'strawberry'
  | 'mint'
  | 'lavender'
  | 'butter'
  | 'night'

type Theme = {
  id: ThemeName
  name: string
  emoji: string
}

const themes: Theme[] = [
  { id: 'bubble', name: 'Bubble Pop', emoji: '🩷' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
  { id: 'mint', name: 'Mint Soda', emoji: '🌿' },
  { id: 'lavender', name: 'Lavender', emoji: '💜' },
  { id: 'butter', name: 'Butter Star', emoji: '⭐' },
  { id: 'night', name: 'Pixel Night', emoji: '🌙' },
]

function App() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('wtw-theme') as ThemeName | null
    return savedTheme ?? 'bubble'
  })

  const [todayCount] = useState(1247)
  const [dailyGoal] = useState(3000)
  const [showThemes, setShowThemes] = useState(false)

  const progress = useMemo(() => {
    if (dailyGoal <= 0) return 0
    return Math.min(Math.round((todayCount / dailyGoal) * 100), 100)
  }, [todayCount, dailyGoal])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('wtw-theme', theme)
  }, [theme])

  return (
    <div className="app-shell">
      <div className="pixel-stars" aria-hidden="true">
        <span>✦</span>
        <span>★</span>
        <span>✧</span>
        <span>✦</span>
      </div>

      <header className="top-bar">
        <button
          className="icon-button"
          type="button"
          aria-label="메뉴 열기"
        >
          ☰
        </button>

        <button
          className="theme-button"
          type="button"
          onClick={() => setShowThemes((value) => !value)}
        >
          테마 ✦
        </button>
      </header>

      {showThemes && (
        <section className="theme-panel">
          <p className="theme-title">CHOOSE YOUR MOOD</p>

          <div className="theme-grid">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`theme-option ${
                  theme === item.id ? 'selected' : ''
                }`}
                onClick={() => {
                  setTheme(item.id)
                  setShowThemes(false)
                }}
              >
                <span>{item.emoji}</span>
                <small>{item.name}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      <main className="home">
        <section className="brand-card">
          <div className="brand-swoosh" />

          <div className="brand-logo">
            <span className="logo-line">✦ WHAT</span>
            <span className="logo-middle">TO</span>
            <span className="logo-line logo-bottom">WRITE ✦</span>
          </div>

          <p className="brand-copy">
            오늘도 한 줄,
            <br />
            나만의 이야기를 시작해요
          </p>
        </section>

        <section className="writing-card">
          <div className="card-label">TODAY&apos;S WRITING</div>

          <div className="count-row">
            <div>
              <p className="count-caption">오늘 쓴 글</p>
              <strong>{todayCount.toLocaleString()}자</strong>
            </div>

            <div className="goal-box">
              <span>목표</span>
              <b>{dailyGoal.toLocaleString()}자</b>
            </div>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            >
              <span>★</span>
            </div>
          </div>

          <div className="progress-info">
            <span>{progress}% 완료</span>
            <span>
              {(dailyGoal - todayCount).toLocaleString()}자 남음
            </span>
          </div>

          <button className="continue-button" type="button">
            <span className="button-spark">✦</span>
            이어쓰기
            <span className="button-arrow">→</span>
          </button>
        </section>

        <section className="quick-menu">
          <button className="menu-card pink-card" type="button">
            <span className="menu-icon">📚</span>
            <span>
              <b>작품</b>
              <small>내 소설 관리하기</small>
            </span>
            <i>→</i>
          </button>

          <button className="menu-card mint-card" type="button">
            <span className="menu-icon">🧩</span>
            <span>
              <b>시놉시스</b>
              <small>이야기 순서 정리하기</small>
            </span>
            <i>→</i>
          </button>

          <button className="menu-card lavender-card" type="button">
            <span className="menu-icon">💡</span>
            <span>
              <b>메모</b>
              <small>떠오른 생각 기록하기</small>
            </span>
            <i>→</i>
          </button>
        </section>

        <section className="daily-message">
          <span>☆</span>
          <p>
            완벽한 문장보다
            <br />
            오늘의 한 문장이 더 소중해요
          </p>
          <span>☆</span>
        </section>
      </main>

      <nav className="bottom-nav">
        <button className="nav-item active" type="button">
          <span>⌂</span>
          <small>홈</small>
        </button>

        <button className="nav-item" type="button">
          <span>✎</span>
          <small>집필</small>
        </button>

        <button className="quick-add" type="button" aria-label="빠른 메모">
          ＋
        </button>

        <button className="nav-item" type="button">
          <span>☁</span>
          <small>메모</small>
        </button>

        <button className="nav-item" type="button">
          <span>⚙</span>
          <small>설정</small>
        </button>
      </nav>
    </div>
  )
}

export default App