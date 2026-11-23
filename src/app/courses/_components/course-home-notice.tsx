import { Button } from '@/shared/ui';

import type { CourseHomeNotice as CourseHomeNoticeContent } from '../_model/course-home';

interface CourseHomeNoticeProps {
  notice: CourseHomeNoticeContent;
  /** 안내 바 버튼 클릭 핸들러. 이동할 화면이 정해지기 전까지는 비워 둘 수 있습니다. */
  onAction?: () => void;
}

/**
 * 비회원이나 취향 미설정 회원에게 추천 기준을 알려 주는 안내 바입니다.
 *
 * 피그마 Notice Bar의 색을 기존 토큰으로 맞춘 1안(회색 배경, primary 버튼)입니다.
 */
export function CourseHomeNotice({ notice, onAction }: CourseHomeNoticeProps) {
  return (
    <div
      className="flex min-h-[44px] w-full flex-wrap items-center justify-between gap-x-12 gap-y-4 rounded-[10px] bg-surface-subtle px-20 py-4"
      data-slot="course-home-notice"
    >
      <p className="text-caption-c1 text-text-primary">{notice.message}</p>
      {notice.actionLabel ? (
        <Button onClick={onAction} size="sm" variant="primary">
          {notice.actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
