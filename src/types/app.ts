export type ThemeName =
  | 'bubble'
  | 'strawberry'
  | 'mint'
  | 'lavender'
  | 'butter'
  | 'night'

export type PageName =
  | 'home'
  | 'projects'
  | 'write'
  | 'synopsis'
  | 'notes'
  | 'settings'

export type CountMode = 'withoutSpaces' | 'withSpaces'
export type SaveStatus = 'saved' | 'saving' | 'error'

export type SynopsisCard = {
  id: string
  title: string
  content: string
}

export type IdeaNote = {
  id: string
  title: string
  content: string
  updatedAt: string
}

export type BackupSnapshot = {
  id: string
  createdAt: string
  title: string
  manuscript: string
}

export type WritingProject = {
  id: string
  title: string
  manuscript: string
  dailyGoal: number
  countMode: CountMode
  synopsis: SynopsisCard[]
  notes: IdeaNote[]
  backups: BackupSnapshot[]
  createdAt: string
  updatedAt: string
}

export type AppData = {
  theme: ThemeName
  activeProjectId: string
  projects: WritingProject[]
}
