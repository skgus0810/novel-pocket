import { useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { AppData } from '../types/app'

export type CloudStatusName =
  | 'loading'
  | 'synced'
  | 'saving'
  | 'offline'
  | 'error'

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

  const readyRef = useRef(false)
  const skipNextUploadRef = useRef(false)
  const latestDataRef = useRef(data)

  useEffect(() => {
    latestDataRef.current = data
  }, [data])

useEffect(() => {
  if (!session) return

  const userId = session.user.id

  let cancelled = false
  readyRef.current = false
  skipNextUploadRef.current = false
  setStatus('loading')

async function load() {
  const { data: row, error } = await supabase
    .from('user_app_data')
    .select('app_data, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
    
      if (cancelled) return

      if (error) {
        console.error(error)
        setStatus(navigator.onLine ? 'error' : 'offline')
        return
      }

      if (row?.app_data) {
        skipNextUploadRef.current = true
        onRemoteData(row.app_data as AppData)
        setLastSavedAt(new Date(row.updated_at))
      } else {
        const { error: uploadError } = await supabase
          .from('user_app_data')
          .upsert(
            {
              user_id: userId,
              app_data: latestDataRef.current,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          )

        if (uploadError) {
          console.error(uploadError)
          setStatus(navigator.onLine ? 'error' : 'offline')
          return
        }

        setLastSavedAt(new Date())
      }

      readyRef.current = true
      setStatus('synced')
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [session?.user.id, onRemoteData])

  useEffect(() => {
    if (!session || !readyRef.current) return

  const userId = session.user.id
    
    if (skipNextUploadRef.current) {
      skipNextUploadRef.current = false
      return
    }

    if (!navigator.onLine) {
      setStatus('offline')
      return
    }

    setStatus('saving')

    const timer = window.setTimeout(async () => {
      const { error } = await supabase
        .from('user_app_data')
        .upsert(
          {
            user_id: userId,
            app_data: data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        )

      if (error) {
        console.error(error)
        setStatus(navigator.onLine ? 'error' : 'offline')
        return
      }

      setLastSavedAt(new Date())
      setStatus('synced')
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [data, session])

  useEffect(() => {
    function handleOffline() {
      if (session) setStatus('offline')
    }

    function handleOnline() {
      if (session) setStatus('saving')
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [session])

  return { status, lastSavedAt }
}
