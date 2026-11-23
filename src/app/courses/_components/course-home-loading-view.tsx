'use client';

import { Icon, SearchBar } from '@/shared/ui';

import {
  canChangeCourseHomeSort,
  type CourseViewer,
  getCourseHomeNotice,
  getCourseHomeSortLabel,
  getDefaultCourseHomeSort,
} from '../_model/course-home';
import { useCourseViewer } from '../_model/use-course-viewer';
import { CourseFilterBar } from './course-filter-bar';
import { CourseHomeNotice } from './course-home-notice';
import { CourseStackCarouselLoading } from './course-stack-carousel';
import { CoursesTopHeader } from './courses-top-header';

interface CourseHomeLoadingViewProps {
  /** Storybook처럼 사용자 상태를 직접 지정할 때 사용합니다. 없으면 로그인 세션을 따릅니다. */
  viewer?: CourseViewer;
}

/** 코스 홈 로딩 화면입니다. Footer는 루트 레이아웃에서 표시합니다. */
export function CourseHomeLoadingView({ viewer: viewerOverride }: CourseHomeLoadingViewProps) {
  const { viewer } = useCourseViewer(viewerOverride);
  const notice = getCourseHomeNotice(viewer);
  const title = getCourseHomeSortLabel(getDefaultCourseHomeSort(viewer));

  return (
    <>
      <CoursesTopHeader
        searchContent={<SearchBar className="w-full" placeholder="검색어를 입력해주세요" />}
        searchFilter={<CourseFilterBar />}
        viewer={viewerOverride}
      />
      <main aria-busy="true" className="w-full overflow-x-clip" data-slot="courses-home-loading">
        <section className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-col items-start gap-28 px-24 pt-48 pb-[90px]">
          {notice ? <CourseHomeNotice notice={notice} /> : null}
          <h2 className="flex items-center gap-12 text-heading-h2 text-text-primary">
            {title}
            {canChangeCourseHomeSort(viewer) ? (
              <Icon className="text-icon-default" name="chevron-down" tone="inherit" />
            ) : null}
          </h2>
          <p className="sr-only" role="status">
            코스를 불러오고 있어요.
          </p>
          <CourseStackCarouselLoading />
        </section>
      </main>
    </>
  );
}
