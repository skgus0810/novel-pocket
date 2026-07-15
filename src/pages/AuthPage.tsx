import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'signin' | 'signup'

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (mode === 'signup') {
        const redirectUrl = new URL(
          import.meta.env.BASE_URL,
          window.location.origin,
        ).toString()

        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              emailRedirectTo: redirectUrl,
            },
          })

        if (signUpError) throw signUpError

        setMessage(
          data.session
            ? '회원가입과 로그인이 완료됐어요.'
            : '인증 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.',
        )
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

        if (signInError) throw signInError
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : '로그인 처리 중 오류가 생겼어요.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="pixel-kicker">CLOUD WRITING ROOM</span>
        <h1>{mode === 'signin' ? '로그인' : '회원가입'}</h1>

        <p className="auth-description">
          같은 계정으로 로그인하면 노트북·아이폰·아이패드에서
          같은 원고를 이어 쓸 수 있어요.
        </p>

        <form onSubmit={submit}>
          <label>
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              autoComplete={
                mode === 'signin'
                  ? 'current-password'
                  : 'new-password'
              }
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? '처리 중...'
              : mode === 'signin'
                ? '로그인'
                : '계정 만들기'}
          </button>
        </form>

        <button
          type="button"
          className="auth-mode-button"
          onClick={() => {
            setMode((current) =>
              current === 'signin' ? 'signup' : 'signin',
            )
            setError('')
            setMessage('')
          }}
        >
          {mode === 'signin'
            ? '처음이신가요? 회원가입'
            : '이미 계정이 있나요? 로그인'}
        </button>
      </section>
    </main>
  )
}
