import type { ReactNode } from 'react';

interface CourseHomeLayoutProps {
  children: ReactNode;
  /** 섹션 제목의 DOM ID. 있으면 섹션 이름으로 연결합니다. */
  titleId?: string;
  /** 콘텐츠를 불러오는 중인지 여부 */
  busy?: boolean;
}

/**
 * 코스 홈 본문 영역입니다. 홈과 로딩 화면이 같은 간격을 쓰도록 공유합니다.
 *
 * 캐러셀 양옆 카드가 화면 밖으로 나가도 가로 스크롤이 생기지 않도록 본문에서 가로로 잘라 냅니다.
 */
export function CourseHomeLayout({ children, titleId, busy }: CourseHomeLayoutProps) {
  return (
    <main aria-busy={busy || undefined} className="w-full overflow-x-clip" data-slot="courses-home">
      <section
        aria-labelledby={titleId}
        className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-col items-start gap-28 px-24 pt-48 pb-[90px]"
      >
        {children}
      </section>
    </main>
  );
}
