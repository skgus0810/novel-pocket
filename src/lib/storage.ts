import type { AppData, WritingProject } from '../types/app'

const STORAGE_KEY = 'what-to-write-data-v2'

export function createProject(title = '새 작품'): WritingProject {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    title,
    manuscript: '',
    dailyGoal: 3000,
    countMode: 'withoutSpaces',
    synopsis: [
      { id: crypto.randomUUID(), title: '기', content: '' },
      { id: crypto.randomUUID(), title: '승', content: '' },
      { id: crypto.randomUUID(), title: '전', content: '' },
      { id: crypto.randomUUID(), title: '결', content: '' },
    ],
    notes: [],
    backups: [],
    createdAt: now,
    updatedAt: now,
  }
}

const firstProject = createProject()

export const defaultData: AppData = {
  theme: 'bubble',
  activeProjectId: firstProject.id,
  projects: [firstProject],
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (
        Array.isArray(parsed.projects) &&
        parsed.projects.length > 0 &&
        typeof parsed.activeProjectId === 'string'
      ) {
        return parsed
      }
    }

    const oldRaw = localStorage.getItem('what-to-write-data-v1')
    if (oldRaw) {
      const old = JSON.parse(oldRaw) as {
        projectTitle?: string
        manuscript?: string
        dailyGoal?: number
        countMode?: 'withoutSpaces' | 'withSpaces'
        theme?: AppData['theme']
        synopsis?: WritingProject['synopsis']
        notes?: WritingProject['notes']
        backups?: WritingProject['backups']
      }

      const migrated = createProject(old.projectTitle || '새 작품')
      migrated.manuscript = old.manuscript || ''
      migrated.dailyGoal = old.dailyGoal || 3000
      migrated.countMode = old.countMode || 'withoutSpaces'
      migrated.synopsis = old.synopsis?.length
        ? old.synopsis
        : migrated.synopsis
      migrated.notes = old.notes || []
      migrated.backups = old.backups || []

      return {
        theme: old.theme || 'bubble',
        activeProjectId: migrated.id,
        projects: [migrated],
      }
    }

    return defaultData
  } catch {
    return defaultData
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function downloadBackup(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `what-to-write-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function readBackupFile(file: File): Promise<AppData> {
  const text = await file.text()
  const parsed = JSON.parse(text) as AppData

  if (
    !Array.isArray(parsed.projects) ||
    parsed.projects.length === 0 ||
    typeof parsed.activeProjectId !== 'string'
  ) {
    throw new Error('지원하지 않는 백업 파일이에요.')
  }

  return parsed
}
