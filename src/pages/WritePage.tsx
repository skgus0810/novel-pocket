import { useState } from 'react'
import { ThemePicker } from '../components/ThemePicker'
import type { CountMode, SaveStatus, ThemeName } from '../types/app'

type Props = {
  title: string
  manuscript: string
  countMode: CountMode
  theme: ThemeName
  saveStatus: SaveStatus
  lastSavedAt: Date | null
  onTitleChange: (title: string) => void
  onManuscriptChange: (text: string) => void
  onCountModeChange: (mode: CountMode) => void
  onThemeChange: (theme: ThemeName) => void
  onHome: () => void
  onProjects: () => void
  onBackup: () => void
}

export function WritePage(props: Props) {
  const [showTheme, setShowTheme] = useState(false)
  const withSpaces = props.manuscript.length
  const withoutSpaces = props.manuscript.replace(/\s/g, '').length
  const selectedCount =
    props.countMode === 'withSpaces' ? withSpaces : withoutSpaces

  return (
    <div className="writer-page">
      <header className="writer-header">
        <button className="writer-back-button" onClick={props.onHome}>
          ← 홈
        </button>
        <div className={`save-status ${props.saveStatus}`}>
          <span className="save-dot" />
          {props.saveStatus === 'saving'
            ? '저장 중...'
            : props.saveStatus === 'error'
              ? '저장 오류'
              : '자동 저장됨'}
        </div>
        <div className="writer-actions">
          <button onClick={props.onProjects}>작품</button>
          <button onClick={props.onBackup}>백업</button>
          <button onClick={() => setShowTheme((value) => !value)}>
            테마
          </button>
        </div>
      </header>

      {showTheme && (
        <section className="writer-theme-panel">
          <ThemePicker
            selected={props.theme}
            compact
            onSelect={(theme) => {
              props.onThemeChange(theme)
              setShowTheme(false)
            }}
          />
        </section>
      )}

      <main className="writer-main">
        <section className="writer-title-section">
          <input
            className="project-title-input"
            value={props.title}
            onChange={(event) => props.onTitleChange(event.target.value)}
            placeholder="작품 제목"
          />

          <div className="writer-tools">
            <div className="count-option-buttons compact-count">
              <button
                className={
                  props.countMode === 'withoutSpaces' ? 'active' : ''
                }
                onClick={() =>
                  props.onCountModeChange('withoutSpaces')
                }
              >
                공백 제외
              </button>
              <button
                className={
                  props.countMode === 'withSpaces' ? 'active' : ''
                }
                onClick={() => props.onCountModeChange('withSpaces')}
              >
                공백 포함
              </button>
            </div>
            <strong className="writer-count">
              {selectedCount.toLocaleString()}자
            </strong>
          </div>
        </section>

        <textarea
          className="manuscript-editor"
          value={props.manuscript}
          onChange={(event) =>
            props.onManuscriptChange(event.target.value)
          }
          placeholder="이야기를 시작해보세요..."
          spellCheck={false}
          autoFocus
        />

        <footer className="writer-footer">
          <span>공백 제외 {withoutSpaces.toLocaleString()}자</span>
          <span>공백 포함 {withSpaces.toLocaleString()}자</span>
          {props.lastSavedAt && (
            <span>
              마지막 저장{' '}
              {props.lastSavedAt.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </footer>
      </main>
    </div>
  )
}
