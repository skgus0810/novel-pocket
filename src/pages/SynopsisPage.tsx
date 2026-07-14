import type { SynopsisCard } from '../types/app'

type Props = {
  cards: SynopsisCard[]
  onChange: (cards: SynopsisCard[]) => void
  onHome: () => void
}

export function SynopsisPage({ cards, onChange, onHome }: Props) {
  function update(id: string, field: 'title' | 'content', value: string) {
    onChange(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card,
      ),
    )
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= cards.length) return
    const next = [...cards]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="page-shell">
      <header className="sub-header">
        <button onClick={onHome}>← 홈</button>
        <div>
          <span className="pixel-kicker">STORY FLOW</span>
          <h1>시놉시스</h1>
        </div>
        <button
          className="primary-mini"
          onClick={() =>
            onChange([
              ...cards,
              {
                id: crypto.randomUUID(),
                title: '새 단계',
                content: '',
              },
            ])
          }
        >
          ＋ 추가
        </button>
      </header>

      <main className="content-page">
        <div className="synopsis-list">
          {cards.map((card, index) => (
            <article className="synopsis-card" key={card.id}>
              <div className="drag-controls">
                <button onClick={() => move(index, -1)}>↑</button>
                <button onClick={() => move(index, 1)}>↓</button>
              </div>

              <div className="synopsis-fields">
                <input
                  value={card.title}
                  onChange={(event) =>
                    update(card.id, 'title', event.target.value)
                  }
                />
                <textarea
                  value={card.content}
                  onChange={(event) =>
                    update(card.id, 'content', event.target.value)
                  }
                  placeholder="이 단계에서 일어나는 일을 적어보세요."
                />
              </div>

              <button
                className="delete-button"
                onClick={() =>
                  onChange(cards.filter((item) => item.id !== card.id))
                }
              >
                ×
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
