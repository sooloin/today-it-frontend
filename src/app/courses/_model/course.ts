/** 코스에 포함된 장소의 요약 정보입니다. */
export interface CoursePlace {
  id: string;
  name: string;
  /** 장소 카테고리 이름 (예: 카페·디저트) */
  category: string;
  /** 동 단위 지역 이름 (예: 성수동) */
  neighborhood: string;
  imageSrc?: string;
}

/** 코스 홈과 목록에서 사용하는 코스 요약 정보입니다. */
export interface CourseSummary {
  id: string;
  title: string;
  /** 코스 지역 표시 이름 (예: 서울 성동구 성수동) */
  region: string;
  /** 소요 시간 표시 이름 (예: 3시간) */
  durationLabel: string;
  /** 코스 콘셉트 이름 목록 */
  concepts: readonly string[];
  coverImageSrc?: string;
  /** 방문 순서대로 정렬한 장소 목록 */
  places: readonly CoursePlace[];
  likeCount: number;
  /** 공개 확정일 (YYYY-MM-DD) */
  publishedAt: string;
}

/** 코스 카드 뒤에 겹쳐 보여 주는 최대 장소 수입니다. 피그마 Course Card의 Place=1~5 변형을 따릅니다. */
export const MAX_COURSE_CARD_PLACES = 5;

/** 코스 카드 태그로 보여 주는 최대 개수입니다. */
const MAX_COURSE_CARD_TAGS = 2;

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * 코스 카드 뒤에 겹쳐 보여 줄 장소를 방문 순서대로 최대 개수까지 반환합니다.
 * @param places 방문 순서대로 정렬한 장소 목록
 */
export function getCourseCardPlaces(places: readonly CoursePlace[]) {
  return places.slice(0, MAX_COURSE_CARD_PLACES);
}

/**
 * 코스 카드에 표시할 태그를 소요 시간, 콘셉트 순서로 반환합니다.
 * @param course 태그를 만들 코스
 */
export function getCourseCardTags(course: Pick<CourseSummary, 'durationLabel' | 'concepts'>) {
  return [course.durationLabel, ...course.concepts]
    .filter((tag) => tag.trim().length > 0)
    .slice(0, MAX_COURSE_CARD_TAGS);
}

/**
 * YYYY-MM-DD 날짜를 카드 표시 형식(YYYY.MM.DD)으로 바꿉니다.
 * @param date 공개 확정일 (YYYY-MM-DD)
 * @returns 형식이 맞지 않으면 빈 문자열
 */
export function formatCourseDate(date: string) {
  const match = isoDatePattern.exec(date);
  return match ? `${match[1]}.${match[2]}.${match[3]}` : '';
}
