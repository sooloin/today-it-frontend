import { Skeleton } from '@/shared/ui';

import type { CourseCardVariant } from './course-card';

/** 피그마 `State=Loading` 변형의 장소 카드 좌표입니다. CSS 회전 방향 기준입니다. */
const PLACE_SKELETONS = [
  { x: 280, y: 42, rotate: 6 },
  { x: 244, y: 52, rotate: 4 },
  { x: 208, y: 62, rotate: 2 },
] as const;

interface CourseCardSkeletonProps {
  /** `inactive`는 캐러셀 양옆 미리보기 위치의 로딩 카드입니다. (기본값: `active`) */
  variant?: CourseCardVariant;
}

/** 코스 카드의 로딩 상태입니다. */
export function CourseCardSkeleton({ variant = 'active' }: CourseCardSkeletonProps) {
  const isActive = variant === 'active';

  return (
    <div
      aria-hidden="true"
      className="relative h-[580px] w-[760px] shrink-0"
      data-slot="course-card-skeleton"
      data-variant={variant}
    >
      {isActive
        ? PLACE_SKELETONS.map((place) => (
            <div
              className="absolute top-0 left-0 h-[460px] w-place-card-width origin-top-left overflow-hidden rounded-xl bg-surface-default shadow-md"
              key={place.rotate}
              style={{
                transform: `translate(${place.x}px, ${place.y}px) rotate(${place.rotate}deg)`,
              }}
            >
              <Skeleton className="h-place-card-thumbnail-height-lg w-full" />
            </div>
          ))
        : null}
      <div
        className="absolute top-0 left-0 z-10 flex h-[458px] w-place-card-width origin-top-left flex-col rounded-xl bg-surface-default p-20 shadow-md"
        style={{
          transform: `translate(${isActive ? 144.3 : 212}px, 69.1px) rotate(-3deg)`,
        }}
      >
        <Skeleton className="h-[270px] w-full shrink-0 rounded-2xl" />
        <Skeleton className="mt-16 h-28 w-[200px] rounded-lg" />
        <Skeleton className="mt-8 h-16 w-[120px] rounded-lg" />
        <div className="mt-14 flex gap-8">
          <Skeleton className="h-[26px] w-[72px] rounded-lg" />
          <Skeleton className="h-[26px] w-[72px] rounded-lg" />
        </div>
        <Skeleton className="mt-16 h-14 w-[100px] rounded-lg" />
      </div>
    </div>
  );
}
