'use client';

import { type KeyboardEvent, useId, useState } from 'react';

import { cn } from '@/shared/lib';
import { CarouselButton, CarouselIndicator } from '@/shared/ui';

import type { CourseSummary } from '../_model/course';
import { getCarouselOffset, wrapCarouselIndex } from '../_model/course-home';
import { CourseCard } from './course-card';
import { CourseCardSkeleton } from './course-card-skeleton';

/**
 * 피그마 코스 홈 Carousel(1440×580) 안의 카드 자리입니다.
 * 양옆 미리보기는 608×464(0.8배), 화면 밖 카드는 다음 이동을 위해 바깥에서 대기합니다.
 */
const SLOTS = {
  hiddenLeft: { x: -640, y: 58, scale: 0.8, opacity: 0 },
  previous: { x: -118, y: 58, scale: 0.8, opacity: 0.5 },
  current: { x: 343, y: 0, scale: 1, opacity: 1 },
  next: { x: 950, y: 58, scale: 0.8, opacity: 0.5 },
  hiddenRight: { x: 1470, y: 58, scale: 0.8, opacity: 0 },
} as const;

/**
 * 현재 카드와의 거리로 카드 자리를 고릅니다.
 * @param offset 현재 카드 기준 거리 (음수는 왼쪽)
 */
function getSlot(offset: number) {
  if (offset === 0) return SLOTS.current;
  if (offset === -1) return SLOTS.previous;
  if (offset === 1) return SLOTS.next;
  return offset < 0 ? SLOTS.hiddenLeft : SLOTS.hiddenRight;
}

const slotClassName =
  'absolute top-0 left-0 origin-top-left will-change-transform motion-safe:transition-[transform,opacity] motion-safe:duration-[450ms] motion-safe:ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-opacity motion-reduce:duration-200';

interface CourseStackCarouselProps {
  /** 캐러셀의 접근성 이름 */
  label: string;
  courses: readonly CourseSummary[];
  /** 좋아요한 코스 ID 목록 */
  likedCourseIds?: ReadonlySet<string>;
  onLikeClick: (course: CourseSummary) => void;
}

/**
 * 가운데 코스 카드와 양옆 미리보기 카드를 이전/다음 버튼으로 순환 이동합니다.
 *
 * 이동할 때 카드가 양옆 자리에서 가운데 자리로 옮겨 가며 커지고 진해집니다.
 * 동작 줄이기 설정에서는 위치를 바로 바꾸고 투명도만 전환합니다.
 */
export function CourseStackCarousel({
  label,
  courses,
  likedCourseIds,
  onLikeClick,
}: CourseStackCarouselProps) {
  const [current, setCurrent] = useState(0);
  const stageId = useId();
  const total = courses.length;
  const activeIndex = wrapCarouselIndex(current, total);
  const canMove = total > 1;

  function move(step: number) {
    setCurrent((index) => wrapCarouselIndex(index + step, total));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!canMove) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  }

  return (
    <div
      aria-label={label}
      aria-roledescription="carousel"
      className="flex w-full flex-col items-center"
      data-slot="course-stack-carousel"
      onKeyDownCapture={handleKeyDown}
      role="group"
    >
      <div className="relative h-[580px] w-header-width shrink-0" id={stageId}>
        {courses.map((course, index) => {
          const offset = getCarouselOffset(index, activeIndex, total);
          const slot = getSlot(offset);
          const isCurrent = offset === 0;

          return (
            <div
              aria-hidden={!isCurrent}
              aria-label={`${index + 1} / ${total}`}
              aria-roledescription="slide"
              className={cn(slotClassName, isCurrent ? 'z-20' : 'z-10')}
              data-offset={offset}
              data-slot="course-stack-carousel-slide"
              inert={!isCurrent}
              key={course.id}
              role="group"
              style={{
                opacity: slot.opacity,
                transform: `translate(${slot.x}px, ${slot.y}px) scale(${slot.scale})`,
              }}
            >
              <CourseCard
                course={course}
                eager={Math.abs(offset) <= 1}
                liked={likedCourseIds?.has(course.id)}
                onLikeClick={() => onLikeClick(course)}
                variant={isCurrent ? 'active' : 'inactive'}
              />
            </div>
          );
        })}
      </div>

      {canMove ? (
        <div
          className="mt-[22px] flex items-center gap-16"
          data-slot="course-stack-carousel-controls"
        >
          <CarouselButton
            aria-controls={stageId}
            className="bg-surface-default"
            direction="left"
            onClick={() => move(-1)}
          />
          <CarouselIndicator aria-live="polite" current={activeIndex + 1} total={total} />
          <CarouselButton
            aria-controls={stageId}
            className="bg-surface-default"
            direction="right"
            onClick={() => move(1)}
          />
        </div>
      ) : null}
    </div>
  );
}

/** 코스 캐러셀의 로딩 상태입니다. */
export function CourseStackCarouselLoading() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full flex-col items-center"
      data-slot="course-stack-carousel-loading"
    >
      <div className="relative h-[580px] w-header-width shrink-0">
        {([-1, 0, 1] as const).map((offset) => {
          const slot = getSlot(offset);

          return (
            <div
              className="absolute top-0 left-0 origin-top-left"
              key={offset}
              style={{ transform: `translate(${slot.x}px, ${slot.y}px) scale(${slot.scale})` }}
            >
              <CourseCardSkeleton variant={offset === 0 ? 'active' : 'inactive'} />
            </div>
          );
        })}
      </div>
      <div className="mt-[22px] flex items-center gap-16">
        <CarouselButton className="bg-surface-default" direction="left" disabled />
        <CarouselButton className="bg-surface-default" direction="right" disabled />
      </div>
    </div>
  );
}
