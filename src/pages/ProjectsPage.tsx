import { useState } from 'react'
import type { WritingProject } from '../types/app'

type Props = {
  projects: WritingProject[]
  activeProjectId: string
  onSelect: (id: string) => void
  onCreate: (title: string) => void
  onDelete: (id: string) => void
  onWrite: () => void
  onHome: () => void
}

export function ProjectsPage({
  projects,
  activeProjectId,
  onSelect,
  onCreate,
  onDelete,
  onWrite,
  onHome,
}: Props) {
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState('')

  function count(text: string) {
    return text.replace(/\s/g, '').length
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = newTitle.trim()

    if (!title) {
      setError('작품 제목을 입력해 주세요.')
      return
    }

    try {
      onCreate(title)
      setNewTitle('')
      setError('')
    } catch (createError) {
      console.error(createError)
      setError('작품을 만들지 못했어요. 다시 시도해 주세요.')
    }
  }

  return (
    <div className="page-shell projects-page-shell">
      <header className="sub-header y2k-sub-header">
        <button type="button" onClick={onHome}>
          ← 홈
        </button>

        <div>
          <span className="pixel-kicker">MY STORIES</span>
          <h1>작품 보관함</h1>
        </div>

        <div className="header-decoration">✦</div>
      </header>

      <main className="content-page projects-content">
        <section className="new-project-card y2k-new-project">
          <div>
            <span>NEW STORY</span>
            <h2>새 이야기를 시작해볼까요?</h2>
          </div>

          <form className="new-project-form" onSubmit={handleCreate}>
            <input
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value)
                if (error) setError('')
              }}
              placeholder="새 작품 제목"
              aria-label="새 작품 제목"
            />

            <button type="submit">＋ 작품 만들기</button>
          </form>

          {error && <p className="project-create-error">{error}</p>}
        </section>

        <div className="projects-grid y2k-projects-grid">
          {projects.map((project, index) => {
            const active = project.id === activeProjectId
            const folderClasses = [
              'folder-pink',
              'folder-mint',
              'folder-purple',
              'folder-yellow',
            ]

            return (
              <article
                key={project.id}
                className={
                  active
                    ? 'project-card y2k-project-card active-project'
                    : 'project-card y2k-project-card'
                }
              >
                <button
                  className="project-main"
                  type="button"
                  onClick={() => onSelect(project.id)}
                >
                  <div className="project-card-topline">
                    <span
                      className={`project-folder ${
                        folderClasses[index % folderClasses.length]
                      }`}
                    >
                      ▱
                    </span>

                    <span className="project-badge">
                      {active ? 'NOW WRITING' : 'STORY'}
                    </span>
                  </div>

                  <h2>{project.title}</h2>
                  <p>{count(project.manuscript).toLocaleString()}자</p>

                  <small>
                    마지막 수정{' '}
                    {new Date(project.updatedAt).toLocaleString('ko-KR', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </button>

                <div className="project-actions">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(project.id)
                      onWrite()
                    }}
                  >
                    ✎ 집필
                  </button>

                  <button
                    type="button"
                    className="danger-text"
                    disabled={projects.length === 1}
                    onClick={() => {
                      if (
                        window.confirm(
                          `“${project.title}” 작품을 삭제할까요?`,
                        )
                      ) {
                        onDelete(project.id)
                      }
                    }}
                  >
                    삭제
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
