'use client';

import { useSessionStore } from '@/app/_model/session-store';

import { type CourseViewer, getCourseViewer } from './course-home';

/**
 * 로그인 세션을 읽어 코스 화면의 사용자 상태와 닉네임을 반환합니다.
 *
 * 세션은 루트 레이아웃의 LoginModalHost가 저장된 회원 정보를 읽어 채웁니다.
 * @param viewerOverride Storybook처럼 사용자 상태를 직접 지정할 때 사용합니다.
 */
export function useCourseViewer(viewerOverride?: CourseViewer) {
  const member = useSessionStore((state) => state.member);

  return {
    viewer: viewerOverride ?? getCourseViewer(Boolean(member)),
    nickname: member?.nickname,
  };
}
