import { useRef } from 'react'
import { ThemePicker } from '../components/ThemePicker'
import type { AppData, ThemeName } from '../types/app'

type Props = {
  data: AppData
  onThemeChange: (theme: ThemeName) => void
  onExport: () => void
  onImport: (file: File) => void
  onHome: () => void
}

export function SettingsPage(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="page-shell">
      <header className="sub-header">
        <button onClick={props.onHome}>← 홈</button>
        <div>
          <span className="pixel-kicker">MY SPACE</span>
          <h1>설정</h1>
        </div>
        <div />
      </header>

      <main className="content-page settings-stack">
        <section className="settings-card">
          <h2>테마</h2>
          <ThemePicker
            selected={props.data.theme}
            onSelect={props.onThemeChange}
          />
        </section>

        <section className="settings-card">
          <h2>백업</h2>
          <div className="settings-actions">
            <button className="primary-action" onClick={props.onExport}>
              전체 백업 내보내기
            </button>
            <button onClick={() => inputRef.current?.click()}>
              백업 가져오기
            </button>
            <input
              ref={inputRef}
              hidden
              type="file"
              accept=".json,application/json"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) props.onImport(file)
              }}
            />
          </div>
        </section>

        <section className="settings-card">
  <h2>현재 데이터</h2>
  <p>작품 {props.data.projects.length}개</p>
</section>
      </main>
    </div>
  )
}
