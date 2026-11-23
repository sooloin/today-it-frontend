'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type FocusEvent, type MouseEventHandler, useId, useState } from 'react';

import { cn } from '@/shared/lib';
import { Icon, Tag } from '@/shared/ui';

import {
  type CoursePlace,
  type CourseSummary,
  formatCourseDate,
  getCourseCardPlaces,
  getCourseCardTags,
} from '../_model/course';
import {
  COURSE_FRONT_POSITION,
  COURSE_FRONT_ROTATE,
  COURSE_PLACE_BADGE_POSITION,
  type CourseCardPose,
  getCoursePlaceLayer,
  getCoursePlaceTransform,
  HOVERED_PLACE_LIFT,
  toCardTransform,
  TOOLTIP_OFFSET_X,
  TOOLTIP_OFFSET_Y,
} from './course-card-layout';

const compactCount = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const count = new Intl.NumberFormat('en-US');

/**
 * 어떤 동작으로 카드가 움직였는지 나타냅니다.
 * 피그마 프로토타입 기준으로 스택 펼침은 300ms, 장소 강조는 200ms 동안 전환합니다.
 */
type CardTransition = 'stack' | 'place';

const transitionDurationClassName: Record<CardTransition, string> = {
  stack: 'duration-300',
  place: 'duration-200',
};

export type CourseCardVariant = 'active' | 'inactive';

export interface CourseCardProps {
  course: CourseSummary;
  /** `inactive`는 캐러셀 양옆에 놓이는 미리보기 카드입니다. (기본값: `active`) */
  variant?: CourseCardVariant;
  liked?: boolean;
  /** 이미지를 바로 불러올지 여부 */
  eager?: boolean;
  /** 좋아요 버튼 클릭 핸들러 (인증 검사와 상태 갱신은 호출부에서 처리) */
  onLikeClick: MouseEventHandler<HTMLButtonElement>;
}

/**
 * 코스 표지 카드 뒤에 포함 장소 카드를 겹쳐 보여 주는 CourseCard 컴포넌트입니다.
 *
 * 마우스를 올리거나 키보드로 포커스하면 장소 카드가 펼쳐지고 방문 순서 번호가 나타납니다.
 * 펼친 상태에서 장소 카드에 마우스를 올리면 장소 이름과 카테고리 툴팁을 보여 줍니다.
 */
export function CourseCard({
  course,
  variant = 'active',
  liked = false,
  eager = false,
  onLikeClick,
}: CourseCardProps) {
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [hoveredPlace, setHoveredPlace] = useState<number | null>(null);
  const [transition, setTransition] = useState<CardTransition>('stack');
  const placesId = useId();
  const isActive = variant === 'active';
  const isOpen = isActive && (isPointerOver || isFocusWithin);
  const pose: CourseCardPose = isActive ? (isOpen ? 'open' : 'default') : 'inactive';
  const highlightedPlace = isOpen ? hoveredPlace : null;
  const cardPlaces = getCourseCardPlaces(course.places);
  const tags = getCourseCardTags(course);
  const date = formatCourseDate(course.publishedAt);

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusWithin(false);
  }

  function highlightPlace(index: number | null) {
    if (index !== null && !isOpen) return;
    setTransition('place');
    setHoveredPlace(index);
  }

  return (
    <article
      aria-describedby={cardPlaces.length ? placesId : undefined}
      className="relative h-[580px] w-[760px] shrink-0"
      data-open={isOpen || undefined}
      data-slot="course-card"
      data-variant={variant}
      onBlur={handleBlur}
      onFocus={() => setIsFocusWithin(true)}
      onMouseEnter={() => {
        setTransition('stack');
        setIsPointerOver(true);
      }}
      onMouseLeave={() => {
        setTransition('stack');
        setIsPointerOver(false);
        setHoveredPlace(null);
      }}
    >
      {cardPlaces.length ? (
        <p className="sr-only" id={placesId}>
          {`포함 장소 ${cardPlaces.length}곳: `}
          {cardPlaces
            .map((place, index) => `${index + 1}. ${place.name}(${place.category})`)
            .join(', ')}
        </p>
      ) : null}

      {cardPlaces.map((place, index) => (
        <CourseStackPlace
          eager={eager}
          index={index}
          isLifted={highlightedPlace === index}
          key={place.id}
          onHoverChange={(hovered) => highlightPlace(hovered ? index : null)}
          place={place}
          pose={pose}
          total={cardPlaces.length}
          transition={transition}
        />
      ))}

      <div
        className="absolute top-0 left-0 z-20 flex h-[458px] w-place-card-width origin-top-left flex-col rounded-xl bg-surface-default px-12 pt-12 pb-8 shadow-md ease-out motion-safe:transition-transform motion-safe:duration-300"
        data-slot="course-card-front"
        style={{ transform: toCardTransform(COURSE_FRONT_POSITION[pose], COURSE_FRONT_ROTATE) }}
      >
        <div className="relative h-[268px] w-full shrink-0 overflow-hidden rounded-lg bg-surface-placeholder">
          {course.coverImageSrc ? (
            <Image
              alt={`${course.title} 코스 표지`}
              className="object-cover"
              fill
              loading={eager ? 'eager' : 'lazy'}
              sizes="312px"
              src={course.coverImageSrc}
            />
          ) : (
            <div aria-label={`${course.title} 표지 없음`} className="absolute inset-0" role="img" />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-8 px-8 pt-16 pb-8">
          <h3 className="w-full text-heading-h3 text-text-primary" title={course.title}>
            <Link
              className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-border-active focus-visible:after:ring-inset"
              href={`/courses/${encodeURIComponent(course.id)}`}
              tabIndex={isActive ? undefined : -1}
            >
              <span className="block truncate">{course.title}</span>
            </Link>
          </h3>
          <p className="w-full truncate text-body-b3 text-text-secondary">{course.region}</p>
          {tags.length ? (
            <ul aria-label="코스 정보" className="flex gap-6 overflow-hidden">
              {tags.map((tag) => (
                <li className="shrink-0" key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex w-full items-center justify-between pt-4">
            <span className="text-caption-c2 text-text-tertiary">
              {date ? <time dateTime={course.publishedAt}>{date}</time> : null}
            </span>
            {/* 피그마 좋아요 영역(아이콘 20px)보다 누르기 쉽도록 padding을 주고 같은 만큼 바깥 여백을 줄입니다. */}
            <button
              aria-label={`${course.title} 좋아요 ${count.format(course.likeCount)}개`}
              aria-pressed={liked}
              className="relative z-10 -my-4 -mr-4 inline-flex cursor-pointer items-center gap-4 rounded-full p-4 text-caption-c1 text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-active"
              data-slot="course-card-like"
              onClick={onLikeClick}
              tabIndex={isActive ? undefined : -1}
              type="button"
            >
              <Icon
                className={liked ? 'text-icon-liked' : 'text-icon-default'}
                name={liked ? 'favorite-filled' : 'favorite'}
                size={20}
                tone="inherit"
              />
              <span aria-hidden="true">{compactCount.format(course.likeCount)}</span>
            </button>
          </div>
        </div>
      </div>

      {cardPlaces.map((place, index) => (
        <CoursePlaceTooltip
          index={index}
          isVisible={highlightedPlace === index}
          key={place.id}
          place={place}
        />
      ))}
    </article>
  );
}

interface CourseStackPlaceProps {
  place: CoursePlace;
  /** 방문 순서 (0부터 시작) */
  index: number;
  /** 표시하는 장소 수 */
  total: number;
  pose: CourseCardPose;
  /** 마우스를 올려 위로 올라온 상태인지 여부 */
  isLifted: boolean;
  transition: CardTransition;
  eager: boolean;
  onHoverChange: (hovered: boolean) => void;
}

/** 코스 표지 뒤에 겹쳐 놓이는 장소 카드와 방문 순서 번호 배지입니다. */
function CourseStackPlace({
  place,
  index,
  total,
  pose,
  isLifted,
  transition,
  eager,
  onHoverChange,
}: CourseStackPlaceProps) {
  const isOpen = pose === 'open';
  const lift = isLifted ? HOVERED_PLACE_LIFT : 0;
  const transform = getCoursePlaceTransform(index, isOpen);
  const [badgeX, badgeY] = COURSE_PLACE_BADGE_POSITION[isOpen ? 'open' : 'default'][index] ?? [
    0, 0,
  ];
  const layer = getCoursePlaceLayer(index, total);
  const durationClassName = transitionDurationClassName[transition];

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'absolute top-0 left-0 w-place-card-width origin-top-left overflow-hidden rounded-xl bg-surface-default shadow-md ease-out motion-safe:transition-[transform,opacity]',
          durationClassName,
          pose === 'inactive' && 'opacity-0',
        )}
        data-slot="course-card-place"
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        style={{
          zIndex: layer.place,
          transform: toCardTransform({ x: transform.x, y: transform.y - lift }, transform.rotate),
        }}
      >
        <div className="relative h-place-card-thumbnail-height-lg w-full bg-surface-placeholder">
          {place.imageSrc ? (
            <Image
              alt=""
              className="object-cover"
              fill
              loading={eager ? 'eager' : 'lazy'}
              sizes="336px"
              src={place.imageSrc}
            />
          ) : null}
        </div>
        <div className="flex h-place-card-body-height min-w-0 flex-col items-start gap-8 px-20 pt-20 pb-24">
          <Tag type="category">{place.category}</Tag>
          <span className="w-full truncate text-heading-h3 text-text-primary">{place.name}</span>
          <span className="w-full truncate text-body-b3 text-text-secondary">
            {place.neighborhood}
          </span>
        </div>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-0 left-0 flex size-28 items-center justify-center rounded-full bg-surface-inverse text-caption-c1 text-text-inverse shadow-sm ease-out motion-safe:transition-[transform,opacity]',
          durationClassName,
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        data-slot="course-card-order"
        style={{ zIndex: layer.badge, transform: `translate(${badgeX}px, ${badgeY - lift}px)` }}
      >
        {index + 1}
      </span>
    </>
  );
}

interface CoursePlaceTooltipProps {
  place: CoursePlace;
  /** 방문 순서 (0부터 시작) */
  index: number;
  isVisible: boolean;
}

/** 펼친 상태에서 마우스를 올린 장소의 이름과 카테고리를 번호 배지 위에 보여 줍니다. */
function CoursePlaceTooltip({ place, index, isVisible }: CoursePlaceTooltipProps) {
  const [badgeX, badgeY] = COURSE_PLACE_BADGE_POSITION.open[index] ?? [0, 0];

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-0 left-0 z-30 flex -translate-x-full -translate-y-full items-baseline gap-8 rounded-lg bg-surface-inverse px-12 py-8 whitespace-nowrap text-text-inverse shadow-sm motion-safe:transition-opacity motion-safe:duration-200',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
      data-slot="course-card-tooltip"
      style={{
        left: badgeX + TOOLTIP_OFFSET_X,
        top: badgeY - HOVERED_PLACE_LIFT - TOOLTIP_OFFSET_Y,
      }}
    >
      <span className="text-caption-c1 whitespace-pre">{`${index + 1}  ${place.name}`}</span>
      <span className="text-caption-c2">{place.category}</span>
    </div>
  );
}
