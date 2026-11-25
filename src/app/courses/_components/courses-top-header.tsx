'use client';

import { TopHeader } from '@/app/_components/top-header';
import { SearchBar } from '@/shared/ui';

import type { CourseViewer } from '../_model/course-home';
import { useCourseViewer } from '../_model/use-course-viewer';
import { CourseFilterBar } from './course-filter-bar';

interface CoursesTopHeaderProps {
  /** Storybook처럼 사용자 상태를 직접 지정할 때 사용합니다. 없으면 로그인 세션을 따릅니다. */
  viewer?: CourseViewer;
}

/**
 * 코스 탭의 상단 헤더입니다.
 *
 * 피그마 `Search/Search Area`(Type=Course)처럼 검색창 아래에 코스 필터 바를 두고,
 * 로그인 세션에 따라 로그인 버튼이나 프로필을 보여 줍니다.
 */
export function CoursesTopHeader({ viewer: viewerOverride }: CoursesTopHeaderProps) {
  const { viewer, nickname } = useCourseViewer(viewerOverride);

  return (
    <TopHeader
      activeSection="courses"
      auth={viewer === 'guest' ? 'guest' : 'member'}
      nickname={nickname}
      hasFilters
      searchContent={
        <div className="flex w-full max-w-search-bar-width flex-col gap-12">
          <SearchBar className="w-full" placeholder="검색어를 입력해주세요" />
          <CourseFilterBar />
        </div>
      }
    />
  );
}
