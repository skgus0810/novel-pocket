import { useMemo, useState } from 'react'
import type { IdeaNote } from '../types/app'

type Props = {
  notes: IdeaNote[]
  onChange: (notes: IdeaNote[]) => void
  onHome: () => void
}

export function NotesPage({ notes, onChange, onHome }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('ko-KR')
    if (!keyword) return notes

    return notes.filter((note) =>
      `${note.title} ${note.content}`
        .toLocaleLowerCase('ko-KR')
        .includes(keyword),
    )
  }, [notes, query])

  function addNote() {
    onChange([
      {
        id: crypto.randomUUID(),
        title: '',
        content: '',
        updatedAt: new Date().toISOString(),
      },
      ...notes,
    ])
  }

  return (
    <div className="page-shell">
      <header className="sub-header">
        <button onClick={onHome}>← 홈</button>
        <div>
          <span className="pixel-kicker">IDEA CLOUD</span>
          <h1>메모</h1>
        </div>
        <button className="primary-mini" onClick={addNote}>
          ＋ 메모
        </button>
      </header>

      <main className="content-page">
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목이나 내용으로 검색"
        />

        <p className="page-guide">
          {query ? `검색 결과 ${filtered.length}개` : `전체 ${notes.length}개`}
        </p>

        <div className="notes-grid">
          {filtered.map((note, index) => (
            <article
              className={`note-card note-${index % 3}`}
              key={note.id}
            >
              <input
                value={note.title}
                onChange={(event) =>
                  onChange(
                    notes.map((item) =>
                      item.id === note.id
                        ? {
                            ...item,
                            title: event.target.value,
                            updatedAt: new Date().toISOString(),
                          }
                        : item,
                    ),
                  )
                }
                placeholder="메모 제목"
              />
              <textarea
                value={note.content}
                onChange={(event) =>
                  onChange(
                    notes.map((item) =>
                      item.id === note.id
                        ? {
                            ...item,
                            content: event.target.value,
                            updatedAt: new Date().toISOString(),
                          }
                        : item,
                    ),
                  )
                }
                placeholder="아이디어를 적어보세요."
              />
              <button
                onClick={() =>
                  onChange(notes.filter((item) => item.id !== note.id))
                }
              >
                삭제
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
