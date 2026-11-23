import type { CourseHomeNotice as CourseHomeNoticeContent } from '../_model/course-home';

interface CourseHomeNoticeProps {
  notice: CourseHomeNoticeContent;
  /** 안내 바 버튼 클릭 핸들러. 이동할 화면이 정해지기 전까지는 비워 둘 수 있습니다. */
  onAction?: () => void;
}

/**
 * 비회원이나 취향 미설정 회원에게 추천 기준을 알려 주는 안내 바입니다.
 *
 * 배경은 피그마 Notice Bar 색을 기존 토큰으로 맞춘 1안(회색 배경)입니다.
 * 버튼은 피그마 Notice Button(110×28, 알약 모양, 13px 굵은 글씨)을 따르며,
 * 공용 Button 규격에 없는 크기라 안내 바 전용으로 둡니다.
 */
export function CourseHomeNotice({ notice, onAction }: CourseHomeNoticeProps) {
  return (
    <div
      className="flex min-h-[44px] w-full flex-wrap items-center justify-between gap-x-12 gap-y-4 rounded-[10px] bg-surface-subtle px-20 py-8"
      data-slot="course-home-notice"
    >
      <p className="text-caption-c1 text-text-primary">{notice.message}</p>
      {notice.actionLabel ? (
        <button
          className="inline-flex h-28 w-[110px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-inverse text-[13px] leading-none font-bold whitespace-nowrap text-text-inverse transition-colors outline-none hover:bg-state-inverse-hover focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 active:bg-state-inverse-pressed"
          data-slot="course-home-notice-action"
          onClick={onAction}
          type="button"
        >
          {notice.actionLabel}
        </button>
      ) : null}
    </div>
  );
}
