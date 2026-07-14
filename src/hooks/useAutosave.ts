import { useEffect, useState } from 'react'
import { saveData } from '../lib/storage'
import type { AppData, SaveStatus } from '../types/app'

export function useAutosave(data: AppData) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    setSaveStatus('saving')

    const timer = window.setTimeout(() => {
      try {
        saveData(data)
        setLastSavedAt(new Date())
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    }, 500)

    return () => window.clearTimeout(timer)
  }, [data])

  return { saveStatus, lastSavedAt }
}
