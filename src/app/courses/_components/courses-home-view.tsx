'use client';

import { useId, useState } from 'react';

import { TopHeader } from '@/app/_components/top-header';
import { useLoginModalStore } from '@/app/_model/login-modal-store';
import { SearchBar } from '@/shared/ui';

import type { CourseSummary } from '../_model/course';
import {
  canChangeCourseHomeSort,
  type CourseHomeSort,
  type CourseViewer,
  getCourseHomeNotice,
  getCourseHomeSortLabel,
  getDefaultCourseHomeSort,
} from '../_model/course-home';
import { CourseFilterBar } from './course-filter-bar';
import { CourseHomeNotice } from './course-home-notice';
import { CourseHomeSortSelect } from './course-home-sort-select';
import { CourseStackCarousel } from './course-stack-carousel';

interface CoursesHomeViewProps {
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

const noLikedCourses: ReadonlySet<string> = new Set();

/**
 * 코스 탭의 홈 화면입니다. Footer는 루트 레이아웃에서 표시합니다.
 *
 * 회원은 추천·인기 코스를 바꿔 볼 수 있고, 비회원은 로그인 안내와 인기 코스를 봅니다.
 * 좋아요는 API 연결 전까지 화면 안에서만 바뀌며, 비회원이 누르면 로그인 모달을 엽니다.
 */
export function CoursesHomeView({
  viewer,
  recommendedCourses,
  popularCourses,
}: CoursesHomeViewProps) {
  const openLogin = useLoginModalStore((state) => state.openLogin);
  const [sort, setSort] = useState<CourseHomeSort>(() => getDefaultCourseHomeSort(viewer));
  const [likedCourseIds, setLikedCourseIds] = useState<ReadonlySet<string>>(noLikedCourses);
  const titleId = useId();
  const notice = getCourseHomeNotice(viewer);
  const canChangeSort = canChangeCourseHomeSort(viewer);
  const activeSort = canChangeSort ? sort : 'popular';
  const sourceCourses =
    activeSort === 'recommended' && viewer === 'member' ? recommendedCourses : popularCourses;
  const courses = applyLikes(sourceCourses, likedCourseIds);
  const title = getCourseHomeSortLabel(activeSort);

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
    <>
      <TopHeader
        activeSection="courses"
        auth={viewer === 'guest' ? 'guest' : 'member'}
        searchContent={<SearchBar className="w-full" placeholder="검색어를 입력해주세요" />}
        searchFilter={<CourseFilterBar />}
      />
      <main className="w-full overflow-x-clip" data-slot="courses-home">
        <section
          aria-labelledby={titleId}
          className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-col items-start gap-28 px-24 pt-48 pb-[90px]"
        >
          {notice ? <CourseHomeNotice notice={notice} /> : null}
          {canChangeSort ? (
            <CourseHomeSortSelect id={titleId} onValueChange={setSort} value={activeSort} />
          ) : (
            <h2 className="text-heading-h2 text-text-primary" id={titleId}>
              {title}
            </h2>
          )}
          <CourseStackCarousel
            courses={courses}
            key={activeSort}
            label={title}
            likedCourseIds={likedCourseIds}
            onLikeClick={toggleLike}
          />
        </section>
      </main>
    </>
  );
}
