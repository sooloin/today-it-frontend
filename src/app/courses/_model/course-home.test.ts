import { describe, expect, it } from 'vitest';

import {
  formatCourseDate,
  getCourseCardPlaces,
  getCourseCardTags,
  MAX_COURSE_CARD_PLACES,
} from './course';
import {
  canChangeCourseHomeSort,
  getCarouselOffset,
  getCourseHomeNotice,
  getCourseHomeSortLabel,
  getCourseViewer,
  getDefaultCourseHomeSort,
  isCourseHomeSort,
  wrapCarouselIndex,
} from './course-home';
import { findCourseFixture, popularCourses, recommendedCourses } from './courses.fixtures';

describe('코스 카드 표시 값', () => {
  it('뒤쪽 장소 카드는 방문 순서대로 최대 5개까지만 표시한다', () => {
    const course = findCourseFixture('euljiro-retro-tour');
    const extraPlace = { id: 'extra', name: '추가 장소', category: '카페', neighborhood: '동' };
    const sixPlaces = [...(course?.places ?? []), extraPlace];

    expect(getCourseCardPlaces(sixPlaces)).toHaveLength(MAX_COURSE_CARD_PLACES);
    expect(getCourseCardPlaces(sixPlaces).map((place) => place.id)).toEqual(
      sixPlaces.slice(0, 5).map((place) => place.id),
    );
    expect(sixPlaces).toHaveLength(6);
  });

  it('장소가 5개보다 적으면 모두 표시한다', () => {
    const course = findCourseFixture('mangwon-market-picnic');

    expect(getCourseCardPlaces(course?.places ?? [])).toHaveLength(2);
  });

  it('태그는 소요 시간과 콘셉트 순서로 최대 2개만 표시하고 빈 값은 뺀다', () => {
    expect(getCourseCardTags({ durationLabel: '3시간', concepts: ['아늑함', '로맨틱'] })).toEqual([
      '3시간',
      '아늑함',
    ]);
    expect(getCourseCardTags({ durationLabel: ' ', concepts: ['로맨틱'] })).toEqual(['로맨틱']);
  });

  it('공개 확정일을 YYYY.MM.DD 형식으로 바꾸고 형식이 다르면 빈 문자열을 반환한다', () => {
    expect(formatCourseDate('2026-11-05')).toBe('2026.11.05');
    expect(formatCourseDate('2026/11/05')).toBe('');
  });
});

describe('코스 홈 사용자 상태', () => {
  it('로그인 세션이 있으면 회원, 없으면 비회원으로 본다', () => {
    expect(getCourseViewer(true)).toBe('member');
    expect(getCourseViewer(false)).toBe('guest');
  });

  it('비회원은 로그인 안내를 보고 정렬을 바꿀 수 없으며 인기 코스로 시작한다', () => {
    expect(getCourseHomeNotice('guest')).toEqual({
      message: '로그인하면 취향에 맞는 코스를 추천해 드려요',
    });
    expect(canChangeCourseHomeSort('guest')).toBe(false);
    expect(getDefaultCourseHomeSort('guest')).toBe('popular');
  });

  it('취향 미설정 회원은 취향 설정 버튼이 있는 안내를 보고 추천 정렬로 시작한다', () => {
    expect(getCourseHomeNotice('member-without-preference')).toEqual({
      message: '아직 취향 정보가 없어 인기 코스를 보여드려요',
      actionLabel: '취향 설정',
    });
    expect(getDefaultCourseHomeSort('member-without-preference')).toBe('recommended');
  });

  it('취향을 설정한 회원은 안내 없이 추천 정렬로 시작한다', () => {
    expect(getCourseHomeNotice('member')).toBeNull();
    expect(canChangeCourseHomeSort('member')).toBe(true);
    expect(getDefaultCourseHomeSort('member')).toBe('recommended');
  });

  it('정렬 기준을 확인하고 제목을 반환한다', () => {
    expect(isCourseHomeSort('popular')).toBe(true);
    expect(isCourseHomeSort('latest')).toBe(false);
    expect(getCourseHomeSortLabel('recommended')).toBe('당신을 위한 추천 코스');
    expect(getCourseHomeSortLabel('popular')).toBe('지금 인기있는 코스');
  });
});

describe('순환 캐러셀 위치', () => {
  it('처음과 끝을 넘어가면 반대쪽으로 이어진다', () => {
    expect(wrapCarouselIndex(-1, 12)).toBe(11);
    expect(wrapCarouselIndex(12, 12)).toBe(0);
    expect(wrapCarouselIndex(3, 0)).toBe(0);
  });

  it('현재 카드 기준으로 가까운 방향의 거리를 반환한다', () => {
    expect(getCarouselOffset(0, 0, 12)).toBe(0);
    expect(getCarouselOffset(1, 0, 12)).toBe(1);
    expect(getCarouselOffset(11, 0, 12)).toBe(-1);
    expect(getCarouselOffset(0, 11, 12)).toBe(1);
    expect(getCarouselOffset(6, 0, 12)).toBe(6);
  });

  it('카드가 2개면 다른 카드는 오른쪽에 한 장만 놓인다', () => {
    expect(getCarouselOffset(1, 0, 2)).toBe(1);
    expect(getCarouselOffset(0, 1, 2)).toBe(1);
  });
});

describe('임시 코스 데이터', () => {
  it('추천과 인기 목록은 같은 코스를 다른 순서로 담는다', () => {
    expect(popularCourses).toHaveLength(recommendedCourses.length);
    expect(popularCourses[0]?.likeCount).toBeGreaterThanOrEqual(popularCourses[1]?.likeCount ?? 0);
    expect(new Set(popularCourses.map((course) => course.id))).toEqual(
      new Set(recommendedCourses.map((course) => course.id)),
    );
  });
});
