import { Skeleton } from '@/shared/ui';

import type { CourseCardVariant } from './course-card';
import {
  COURSE_FRONT_POSITION,
  COURSE_FRONT_ROTATE,
  getCoursePlaceLayer,
  getCoursePlaceTransform,
  toCardTransform,
} from './course-card-layout';

/** 피그마 `State=Loading` 변형은 장소 카드 3장을 기본 위치에 겹쳐 보여 줍니다. */
const SKELETON_PLACE_COUNT = 3;

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
        ? Array.from({ length: SKELETON_PLACE_COUNT }, (_, index) => {
            const transform = getCoursePlaceTransform(index, false);

            return (
              <div
                className="absolute top-0 left-0 h-[460px] w-place-card-width origin-top-left overflow-hidden rounded-xl bg-surface-default shadow-md"
                key={index}
                style={{
                  zIndex: getCoursePlaceLayer(index, SKELETON_PLACE_COUNT).place,
                  transform: toCardTransform(transform, transform.rotate),
                }}
              >
                <Skeleton className="h-place-card-thumbnail-height-lg w-full" />
              </div>
            );
          })
        : null}
      <div
        className="absolute top-0 left-0 z-20 flex h-[458px] w-place-card-width origin-top-left flex-col rounded-xl bg-surface-default p-20 shadow-md"
        style={{
          transform: toCardTransform(
            COURSE_FRONT_POSITION[isActive ? 'default' : 'inactive'],
            COURSE_FRONT_ROTATE,
          ),
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
