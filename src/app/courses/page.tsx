import type { Metadata } from 'next';

import { CoursesHomeView } from './_components/courses-home-view';
import { popularCourses, recommendedCourses } from './_model/courses.fixtures';

export const metadata: Metadata = {
  title: '코스 | ToDayIt',
  description: '취향에 맞는 코스와 지금 인기있는 코스를 둘러보세요.',
};

/**
 * 코스 홈입니다.
 *
 * 로그인 세션에 따라 비회원·회원 화면을 보여 줍니다.
 * 취향 미설정 화면은 취향 정보 연동 전까지 Storybook `App/Courses/CoursesHomeView`에서 확인합니다.
 */
export default function CoursesPage() {
  return (
    <CoursesHomeView popularCourses={popularCourses} recommendedCourses={recommendedCourses} />
  );
}
