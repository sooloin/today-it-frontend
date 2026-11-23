'use client';

import { TopHeader, type TopHeaderProps } from '@/app/_components/top-header';

import type { CourseViewer } from '../_model/course-home';
import { useCourseViewer } from '../_model/use-course-viewer';

interface CoursesTopHeaderProps extends Pick<TopHeaderProps, 'searchContent' | 'searchFilter'> {
  /** Storybook처럼 사용자 상태를 직접 지정할 때 사용합니다. 없으면 로그인 세션을 따릅니다. */
  viewer?: CourseViewer;
}

/** 코스 탭이 활성화되고 로그인 세션을 반영하는 상단 헤더입니다. */
export function CoursesTopHeader({ viewer: viewerOverride, ...props }: CoursesTopHeaderProps) {
  const { viewer, nickname } = useCourseViewer(viewerOverride);

  return (
    <TopHeader
      activeSection="courses"
      auth={viewer === 'guest' ? 'guest' : 'member'}
      nickname={nickname}
      {...props}
    />
  );
}
