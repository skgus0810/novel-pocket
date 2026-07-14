import { useEffect, useMemo, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { ThemePicker } from './components/ThemePicker'
import { useAutosave } from './hooks/useAutosave'
import {
  createProject,
  downloadBackup,
  loadData,
  readBackupFile,
} from './lib/storage'
import { HomePage } from './pages/HomePage'
import { NotesPage } from './pages/NotesPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SynopsisPage } from './pages/SynopsisPage'
import { WritePage } from './pages/WritePage'
import type {
  AppData,
  BackupSnapshot,
  PageName,
  ThemeName,
  WritingProject,
} from './types/app'

const PAGE_KEY = 'what-to-write-last-page-v2'

function App() {
  const [data, setData] = useState<AppData>(loadData)
  const [page, setPage] = useState<PageName>(() => {
    return (localStorage.getItem(PAGE_KEY) as PageName) || 'home'
  })
  const [showThemes, setShowThemes] = useState(false)
  const { saveStatus, lastSavedAt } = useAutosave(data)

  const activeProject =
    data.projects.find(
      (project) => project.id === data.activeProjectId,
    ) || data.projects[0]

  useEffect(() => {
    localStorage.setItem(PAGE_KEY, page)
  }, [page])

  useEffect(() => {
    document.documentElement.dataset.theme = data.theme
  }, [data.theme])

  const countWithoutSpaces = useMemo(
    () => activeProject.manuscript.replace(/\s/g, '').length,
    [activeProject.manuscript],
  )
  const countWithSpaces = activeProject.manuscript.length
  const currentCount =
    activeProject.countMode === 'withSpaces'
      ? countWithSpaces
      : countWithoutSpaces

  function patchData(next: Partial<AppData>) {
    setData((current) => ({ ...current, ...next }))
  }

  function patchActiveProject(next: Partial<WritingProject>) {
    setData((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === current.activeProjectId
          ? {
              ...project,
              ...next,
              updatedAt: new Date().toISOString(),
            }
          : project,
      ),
    }))
  }

  function createNewProject(title: string) {
    const project = createProject(title)

    setData((current) => ({
      ...current,
      activeProjectId: project.id,
      projects: [...current.projects, project],
    }))
  }

  function deleteProject(id: string) {
    setData((current) => {
      const projects = current.projects.filter(
        (project) => project.id !== id,
      )

      if (projects.length === 0) {
        return current
      }

      const activeProjectId =
        current.activeProjectId === id
          ? projects[0].id
          : current.activeProjectId

      return { ...current, projects, activeProjectId }
    })
  }

  function createSnapshot() {
    const snapshot: BackupSnapshot = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: activeProject.title,
      manuscript: activeProject.manuscript,
    }

    patchActiveProject({
      backups: [snapshot, ...activeProject.backups].slice(0, 30),
    })
    window.alert('현재 작품의 복구 스냅샷을 만들었어요.')
  }

  async function importBackup(file: File) {
    try {
      setData(await readBackupFile(file))
      window.alert('백업을 불러왔어요.')
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : '백업을 불러오지 못했어요.',
      )
    }
  }

  let content

  if (page === 'projects') {
    content = (
      <ProjectsPage
        projects={data.projects}
        activeProjectId={data.activeProjectId}
        onSelect={(activeProjectId) => patchData({ activeProjectId })}
        onCreate={createNewProject}
        onDelete={deleteProject}
        onWrite={() => setPage('write')}
        onHome={() => setPage('home')}
      />
    )
  } else if (page === 'write') {
    content = (
      <WritePage
        title={activeProject.title}
        manuscript={activeProject.manuscript}
        countMode={activeProject.countMode}
        theme={data.theme}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        onTitleChange={(title) => patchActiveProject({ title })}
        onManuscriptChange={(manuscript) =>
          patchActiveProject({ manuscript })
        }
        onCountModeChange={(countMode) =>
          patchActiveProject({ countMode })
        }
        onThemeChange={(theme) => patchData({ theme })}
        onHome={() => setPage('home')}
        onProjects={() => setPage('projects')}
        onBackup={createSnapshot}
      />
    )
  } else if (page === 'synopsis') {
    content = (
      <SynopsisPage
        cards={activeProject.synopsis}
        onChange={(synopsis) => patchActiveProject({ synopsis })}
        onHome={() => setPage('home')}
      />
    )
  } else if (page === 'notes') {
    content = (
      <NotesPage
        notes={activeProject.notes}
        onChange={(notes) => patchActiveProject({ notes })}
        onHome={() => setPage('home')}
      />
    )
  } else if (page === 'settings') {
    content = (
      <SettingsPage
        data={data}
        onThemeChange={(theme: ThemeName) => patchData({ theme })}
        onExport={() => downloadBackup(data)}
        onImport={importBackup}
        onHome={() => setPage('home')}
      />
    )
  } else {
    content = (
      <>
        <HomePage
          title={activeProject.title}
          count={currentCount}
          dailyGoal={activeProject.dailyGoal}
          countMode={activeProject.countMode}
          projectCount={data.projects.length}
          onCountModeChange={(countMode) =>
            patchActiveProject({ countMode })
          }
          onDailyGoalChange={(dailyGoal) =>
            patchActiveProject({ dailyGoal })
          }
          onWrite={() => setPage('write')}
          onProjects={() => setPage('projects')}
          onSynopsis={() => setPage('synopsis')}
          onNotes={() => setPage('notes')}
          onTheme={() => setShowThemes(true)}
        />

        {showThemes && (
          <div
            className="modal-backdrop"
            onClick={() => setShowThemes(false)}
          >
            <section
              className="theme-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-heading">
                <h2>오늘의 테마</h2>
                <button onClick={() => setShowThemes(false)}>×</button>
              </div>

              <ThemePicker
                selected={data.theme}
                onSelect={(theme) => {
                  patchData({ theme })
                  setShowThemes(false)
                }}
              />
            </section>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {content}

      {page !== 'write' && (
        <BottomNav
          page={page}
          onNavigate={setPage}
          onQuickNote={() => setPage('notes')}
        />
      )}
    </>
  )
}

export default App
