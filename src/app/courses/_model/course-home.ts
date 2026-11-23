/** 코스 홈을 보는 사용자 상태입니다. */
export type CourseViewer = 'guest' | 'member' | 'member-without-preference';

/** 코스 홈 섹션의 정렬 기준입니다. */
export type CourseHomeSort = 'recommended' | 'popular';

export interface CourseHomeSortOption {
  value: CourseHomeSort;
  label: string;
}

export const courseHomeSortOptions: readonly CourseHomeSortOption[] = [
  { value: 'recommended', label: '당신을 위한 추천 코스' },
  { value: 'popular', label: '지금 인기있는 코스' },
];

export interface CourseHomeNotice {
  message: string;
  /** 안내 바 오른쪽 버튼 문구. 없으면 버튼을 표시하지 않습니다. */
  actionLabel?: string;
}

/**
 * 사용자 상태에 맞는 코스 홈 안내 문구를 반환합니다.
 * @param viewer 코스 홈을 보는 사용자 상태
 * @returns 안내가 필요 없으면 `null`
 */
export function getCourseHomeNotice(viewer: CourseViewer): CourseHomeNotice | null {
  if (viewer === 'guest') {
    return { message: '로그인하면 취향에 맞는 코스를 추천해 드려요' };
  }

  if (viewer === 'member-without-preference') {
    return { message: '아직 취향 정보가 없어 인기 코스를 보여드려요', actionLabel: '취향 설정' };
  }

  return null;
}

/**
 * 비회원은 정렬을 바꿀 수 없고 인기 코스만 봅니다.
 * @param viewer 코스 홈을 보는 사용자 상태
 */
export function canChangeCourseHomeSort(viewer: CourseViewer) {
  return viewer !== 'guest';
}

/**
 * 사용자 상태에 맞는 첫 정렬 기준을 반환합니다.
 * @param viewer 코스 홈을 보는 사용자 상태
 */
export function getDefaultCourseHomeSort(viewer: CourseViewer): CourseHomeSort {
  return canChangeCourseHomeSort(viewer) ? 'recommended' : 'popular';
}

/**
 * 정렬 기준에 맞는 섹션 제목을 반환합니다.
 * @param sort 코스 홈 정렬 기준
 */
export function getCourseHomeSortLabel(sort: CourseHomeSort) {
  return courseHomeSortOptions.find((option) => option.value === sort)?.label ?? '';
}

/**
 * 값이 코스 홈 정렬 기준인지 확인합니다.
 * @param value 확인할 값
 */
export function isCourseHomeSort(value: unknown): value is CourseHomeSort {
  return courseHomeSortOptions.some((option) => option.value === value);
}

/**
 * 순환 캐러셀의 위치를 0 이상 전체 개수 미만으로 맞춥니다.
 * @param index 맞출 위치
 * @param total 전체 카드 수
 */
export function wrapCarouselIndex(index: number, total: number) {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

/**
 * 현재 카드 기준으로 카드가 몇 칸 떨어져 있는지 반환합니다. 음수는 왼쪽, 양수는 오른쪽입니다.
 * @param index 위치를 구할 카드
 * @param current 현재 카드
 * @param total 전체 카드 수
 */
export function getCarouselOffset(index: number, current: number, total: number) {
  if (total <= 0) return 0;
  const offset = wrapCarouselIndex(index - current, total);
  return offset > total / 2 ? offset - total : offset;
}
