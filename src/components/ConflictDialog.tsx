import type { CloudConflict } from '../hooks/useCloudSync'

type Props = {
  conflict: CloudConflict
  onUseRemote: () => void
  onKeepLocal: () => void
}

function totalCharacters(data: CloudConflict['localData']) {
  return data.projects.reduce(
    (sum, project) =>
      sum + project.manuscript.replace(/\s/g, '').length,
    0,
  )
}

export function ConflictDialog({
  conflict,
  onUseRemote,
  onKeepLocal,
}: Props) {
  return (
    <div className="conflict-backdrop">
      <section className="conflict-dialog">
        <span className="pixel-kicker">SYNC CONFLICT</span>
        <h2>다른 기기에서 수정된 내용이 있어요</h2>

        <p>
          자동으로 덮어쓰지 않고 두 버전을 모두 보관했어요.
          사용할 버전을 골라주세요.
        </p>

        <div className="conflict-versions">
          <article>
            <strong>현재 기기본</strong>
            <span>
              작품 {conflict.localData.projects.length}개 ·{' '}
              {totalCharacters(conflict.localData).toLocaleString()}자
            </span>
          </article>

          <article>
            <strong>클라우드 최신본</strong>
            <span>
              작품 {conflict.remoteData.projects.length}개 ·{' '}
              {totalCharacters(conflict.remoteData).toLocaleString()}자
            </span>
            <small>
              저장{' '}
              {new Date(conflict.remoteUpdatedAt).toLocaleString('ko-KR')}
            </small>
          </article>
        </div>

        <div className="conflict-actions">
          <button type="button" onClick={onUseRemote}>
            클라우드본 불러오기
          </button>
          <button type="button" onClick={onKeepLocal}>
            현재 기기본으로 덮어쓰기
          </button>
        </div>

        <small className="conflict-safety-note">
          선택하지 않은 버전도 Supabase 백업 테이블에 보관됩니다.
        </small>
      </section>
    </div>
  )
}
