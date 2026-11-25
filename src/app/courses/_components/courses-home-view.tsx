'use client';

import { useId, useState } from 'react';

import { useLoginModalStore } from '@/app/_model/login-modal-store';

import type { CourseSummary } from '../_model/course';
import {
  canChangeCourseHomeSort,
  type CourseHomeSort,
  type CourseViewer,
  getCourseHomeCourses,
  getCourseHomeNotice,
  getCourseHomeSortLabel,
  getDefaultCourseHomeSort,
} from '../_model/course-home';
import { useCourseViewer } from '../_model/use-course-viewer';
import { CourseHomeLayout } from './course-home-layout';
import { CourseHomeNotice } from './course-home-notice';
import { CourseHomeSortSelect } from './course-home-sort-select';
import { CourseStackCarousel } from './course-stack-carousel';
import { CoursesTopHeader } from './courses-top-header';

interface CoursesHomeViewProps {
  /** Storybook처럼 사용자 상태를 직접 지정할 때 사용합니다. 없으면 로그인 세션을 따릅니다. */
  viewer?: CourseViewer;
  recommendedCourses: readonly CourseSummary[];
  popularCourses: readonly CourseSummary[];
}

/**
 * 코스 탭의 홈 화면입니다. Footer는 루트 레이아웃에서 표시합니다.
 *
 * 로그인 세션을 따라 헤더와 섹션이 바뀝니다. 로그인하거나 로그아웃하면
 * 정렬과 화면 안 좋아요 상태를 새 사용자 상태의 처음 값으로 되돌립니다.
 */
export function CoursesHomeView({
  viewer: viewerOverride,
  recommendedCourses,
  popularCourses,
}: CoursesHomeViewProps) {
  const { viewer } = useCourseViewer(viewerOverride);

  return (
    <>
      <CoursesTopHeader viewer={viewerOverride} />
      <CourseHomeSection
        key={viewer}
        popularCourses={popularCourses}
        recommendedCourses={recommendedCourses}
        viewer={viewer}
      />
    </>
  );
}

interface CourseHomeSectionProps {
  viewer: CourseViewer;
  recommendedCourses: readonly CourseSummary[];
  popularCourses: readonly CourseSummary[];
}

/**
 * 화면에서 누른 좋아요를 좋아요 수에 반영합니다. API 연결 전 임시 처리입니다.
 * @param courses 원본 코스 목록
 * @param likedCourseIds 화면에서 좋아요한 코스 ID
 */
function applyLikes(courses: readonly CourseSummary[], likedCourseIds: ReadonlySet<string>) {
  return courses.map((course) =>
    likedCourseIds.has(course.id) ? { ...course, likeCount: course.likeCount + 1 } : course,
  );
}

/**
 * 회원은 추천·인기 코스를 바꿔 볼 수 있고, 비회원은 로그인 안내와 인기 코스를 봅니다.
 * 좋아요는 API 연결 전까지 화면 안에서만 바뀌며, 비회원이 누르면 로그인 모달을 엽니다.
 */
function CourseHomeSection({ viewer, recommendedCourses, popularCourses }: CourseHomeSectionProps) {
  const openLogin = useLoginModalStore((state) => state.openLogin);
  const [sort, setSort] = useState<CourseHomeSort>(() => getDefaultCourseHomeSort(viewer));
  const [likedCourseIds, setLikedCourseIds] = useState<ReadonlySet<string>>(() => new Set());
  const titleId = useId();
  const notice = getCourseHomeNotice(viewer);
  const title = getCourseHomeSortLabel(sort);
  const courses = applyLikes(
    getCourseHomeCourses(viewer, sort, {
      recommended: recommendedCourses,
      popular: popularCourses,
    }),
    likedCourseIds,
  );

  function toggleLike(course: CourseSummary) {
    if (viewer === 'guest') {
      openLogin();
      return;
    }

    setLikedCourseIds((current) => {
      const next = new Set(current);
      if (next.has(course.id)) next.delete(course.id);
      else next.add(course.id);
      return next;
    });
  }

  return (
    <CourseHomeLayout titleId={titleId}>
      {notice ? <CourseHomeNotice notice={notice} /> : null}
      {canChangeCourseHomeSort(viewer) ? (
        <CourseHomeSortSelect id={titleId} onValueChange={setSort} value={sort} />
      ) : (
        <h2 className="text-heading-h2 text-text-primary" id={titleId}>
          {title}
        </h2>
      )}
      <CourseStackCarousel
        courses={courses}
        key={sort}
        label={title}
        likedCourseIds={likedCourseIds}
        onLikeClick={toggleLike}
      />
    </CourseHomeLayout>
  );
}
