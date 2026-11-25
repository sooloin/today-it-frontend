'use client';

import { Icon } from '@/shared/ui';

import {
  canChangeCourseHomeSort,
  type CourseViewer,
  getCourseHomeNotice,
  getCourseHomeSortLabel,
  getDefaultCourseHomeSort,
} from '../_model/course-home';
import { useCourseViewer } from '../_model/use-course-viewer';
import { CourseHomeLayout } from './course-home-layout';
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
      <CoursesTopHeader viewer={viewerOverride} />
      <CourseHomeLayout busy>
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
      </CourseHomeLayout>
    </>
  );
}
