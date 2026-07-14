import './index.css'

function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: 'min(100%, 520px)',
          padding: '40px 24px',
          border: '3px solid var(--border)',
          borderRadius: '28px',
          background: 'var(--surface-strong)',
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '42px' }}>
          ✦ WHAT
          <br />
          TO
          <br />
          WRITE ✦
        </h1>

        <p style={{ marginTop: '24px', fontWeight: 700 }}>
          화면 복구 성공!
        </p>
      </section>
    </main>
  )
}

export default App