import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { AppData } from '../types/app'

export type CloudStatusName =
  | 'loading'
  | 'synced'
  | 'saving'
  | 'offline'
  | 'conflict'
  | 'error'

export type CloudConflict = {
  localData: AppData
  remoteData: AppData
  remoteUpdatedAt: string
  remoteRevision: number
}

type CloudRow = {
  app_data: AppData
  updated_at: string
  revision: number
}

type Props = {
  data: AppData
  session: Session | null
  onRemoteData: (data: AppData) => void
}

export function useCloudSync({
  data,
  session,
  onRemoteData,
}: Props) {
  const [status, setStatus] =
    useState<CloudStatusName>('loading')
  const [lastSavedAt, setLastSavedAt] =
    useState<Date | null>(null)
  const [conflict, setConflict] =
    useState<CloudConflict | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const readyRef = useRef(false)
  const skipNextUploadRef = useRef(false)
  const latestDataRef = useRef(data)
  const knownRevisionRef = useRef<number | null>(null)

  useEffect(() => {
    latestDataRef.current = data
  }, [data])

  const createCloudBackup = useCallback(
    async (userId: string, backupData: AppData, source: string) => {
      const { error } = await supabase
        .from('user_app_backups')
        .insert({
          user_id: userId,
          app_data: backupData,
          source,
        })

      if (error) console.error('Cloud backup failed:', error)
    },
    [],
  )

  useEffect(() => {
    if (!session) {
      readyRef.current = false
      knownRevisionRef.current = null
      setConflict(null)
      return
    }

    const userId = session.user.id
    let cancelled = false

    readyRef.current = false
    skipNextUploadRef.current = false
    knownRevisionRef.current = null
    setConflict(null)
    setErrorMessage('')
    setStatus('loading')

    async function load() {
      const { data: row, error } = await supabase
        .from('user_app_data')
        .select('app_data, updated_at, revision')
        .eq('user_id', userId)
        .maybeSingle<CloudRow>()

      if (cancelled) return

      if (error) {
        setErrorMessage(error.message)
        setStatus(navigator.onLine ? 'error' : 'offline')
        return
      }

      if (row?.app_data) {
        skipNextUploadRef.current = true
        knownRevisionRef.current = row.revision
        onRemoteData(row.app_data)
        setLastSavedAt(new Date(row.updated_at))
      } else {
        const now = new Date().toISOString()

        const { error: insertError } = await supabase
          .from('user_app_data')
          .insert({
            user_id: userId,
            app_data: latestDataRef.current,
            updated_at: now,
            revision: 1,
          })

        if (insertError) {
          setErrorMessage(insertError.message)
          setStatus(navigator.onLine ? 'error' : 'offline')
          return
        }

        knownRevisionRef.current = 1
        setLastSavedAt(new Date(now))
      }

      readyRef.current = true
      setStatus('synced')
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [session?.user.id, onRemoteData])

  const saveWithRevisionCheck = useCallback(
    async (nextData: AppData) => {
      if (!session) return false

      const userId = session.user.id
      const knownRevision = knownRevisionRef.current
      if (knownRevision === null) return false

      if (!navigator.onLine) {
        setStatus('offline')
        return false
      }

      setStatus('saving')
      setErrorMessage('')

      const nextRevision = knownRevision + 1
      const now = new Date().toISOString()

      const { data: updatedRows, error } = await supabase
        .from('user_app_data')
        .update({
          app_data: nextData,
          updated_at: now,
          revision: nextRevision,
        })
        .eq('user_id', userId)
        .eq('revision', knownRevision)
        .select('revision, updated_at')

      if (error) {
        setErrorMessage(error.message)
        setStatus('error')
        return false
      }

      if (updatedRows?.length === 1) {
        knownRevisionRef.current = nextRevision
        setLastSavedAt(new Date(now))
        setStatus('synced')
        return true
      }

      const { data: remoteRow, error: remoteError } =
        await supabase
          .from('user_app_data')
          .select('app_data, updated_at, revision')
          .eq('user_id', userId)
          .single<CloudRow>()

      if (remoteError) {
        setErrorMessage(remoteError.message)
        setStatus('error')
        return false
      }

      await createCloudBackup(
        userId,
        nextData,
        'conflict-local-copy',
      )

      setConflict({
        localData: nextData,
        remoteData: remoteRow.app_data,
        remoteUpdatedAt: remoteRow.updated_at,
        remoteRevision: remoteRow.revision,
      })
      setStatus('conflict')
      return false
    },
    [session, createCloudBackup],
  )

useEffect(() => {
  if (!session || !readyRef.current || conflict) {
    return
  }

  if (skipNextUploadRef.current) {
    skipNextUploadRef.current = false
    return
  }

  const timer = window.setTimeout(() => {
    void saveWithRevisionCheck(data)
  }, 1500)

  return () => window.clearTimeout(timer)
}, [data, session, conflict, saveWithRevisionCheck])

  async function resolveWithRemote() {
    if (!session || !conflict) return

    await createCloudBackup(
      session.user.id,
      conflict.localData,
      'conflict-discarded-local',
    )

    knownRevisionRef.current = conflict.remoteRevision
    skipNextUploadRef.current = true
    onRemoteData(conflict.remoteData)
    setLastSavedAt(new Date(conflict.remoteUpdatedAt))
    setConflict(null)
    setStatus('synced')
  }

  async function resolveWithLocal() {
    if (!session || !conflict) return

    const userId = session.user.id
    const nextRevision = conflict.remoteRevision + 1
    const now = new Date().toISOString()

    await createCloudBackup(
      userId,
      conflict.remoteData,
      'conflict-replaced-remote',
    )

    const { data: updatedRows, error } = await supabase
      .from('user_app_data')
      .update({
        app_data: conflict.localData,
        updated_at: now,
        revision: nextRevision,
      })
      .eq('user_id', userId)
      .eq('revision', conflict.remoteRevision)
      .select('revision, updated_at')

    if (error || !updatedRows || updatedRows.length !== 1) {
      setErrorMessage(
        error?.message ||
          '다른 기기에서 데이터가 다시 변경됐어요. 새로고침해 주세요.',
      )
      setStatus('error')
      return
    }

    knownRevisionRef.current = nextRevision
    setLastSavedAt(new Date(now))
    setConflict(null)
    setStatus('synced')
  }

  async function refreshFromCloud() {
    if (!session) return

    const { data: row, error } = await supabase
      .from('user_app_data')
      .select('app_data, updated_at, revision')
      .eq('user_id', session.user.id)
      .single<CloudRow>()

    if (error) {
      setErrorMessage(error.message)
      setStatus('error')
      return
    }

    knownRevisionRef.current = row.revision
    skipNextUploadRef.current = true
    onRemoteData(row.app_data)
    setLastSavedAt(new Date(row.updated_at))
    setConflict(null)
    setStatus('synced')
  }

  return {
    status,
    lastSavedAt,
    conflict,
    errorMessage,
    resolveWithRemote,
    resolveWithLocal,
    refreshFromCloud,
  }
}
