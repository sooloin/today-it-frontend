/**
 * 피그마 `Card/Course Card`(1610:5292, 760×580) 안의 카드 좌표입니다.
 *
 * 회전값은 피그마(반시계 방향 양수)와 부호가 반대인 CSS 기준(시계 방향 양수)입니다.
 * CourseCard와 CourseCardSkeleton이 같은 좌표를 쓰도록 이곳에서만 관리합니다.
 */

export type CourseCardPose = 'default' | 'open' | 'inactive';

/** 코스 표지 카드는 항상 반시계 방향으로 3도 기울어져 있습니다. */
export const COURSE_FRONT_ROTATE = -3;

export const COURSE_FRONT_POSITION = {
  default: { x: 144.3, y: 69.1 },
  open: { x: 29.8, y: 61.1 },
  inactive: { x: 212, y: 69.1 },
} as const satisfies Record<CourseCardPose, { x: number; y: number }>;

/** 방문 순서 번호 배지 위치입니다. 장소 1~5번 순서입니다. */
export const COURSE_PLACE_BADGE_POSITION = {
  default: [
    [498, 84],
    [534, 86],
    [568, 88],
    [602, 88],
    [636, 90],
  ],
  open: [
    [448, 74],
    [510, 82],
    [572, 88],
    [632, 96],
    [692, 102],
  ],
} as const;

/** 펼친 상태에서 마우스를 올린 장소 카드가 위로 올라오는 거리 */
export const HOVERED_PLACE_LIFT = 18;
/** 툴팁 오른쪽 끝과 번호 배지 왼쪽 끝 사이 거리 */
export const TOOLTIP_OFFSET_X = 43;
/** 툴팁 아래쪽 끝과 번호 배지 위쪽 끝 사이 거리 */
export const TOOLTIP_OFFSET_Y = 21;

/**
 * 장소 카드의 위치와 회전을 반환합니다.
 * @param index 방문 순서 (0부터 시작)
 * @param open 스택이 펼쳐졌는지 여부
 */
export function getCoursePlaceTransform(index: number, open: boolean) {
  return open
    ? { x: 158 + 64 * index, y: 46 - 10 * index, rotate: 3 * (index + 1) }
    : { x: 208 + 36 * index, y: 62 - 10 * index, rotate: 2 * (index + 1) };
}

/**
 * 장소 카드와 배지의 쌓임 순서를 반환합니다. 앞 순서 장소가 뒤 순서 장소 위에 놓이고,
 * 각 배지는 자기 장소 카드 바로 위에 놓입니다. 표지 카드(z-20)보다는 항상 아래입니다.
 * @param index 방문 순서 (0부터 시작)
 * @param total 표시하는 장소 수 (최대 5)
 */
export function getCoursePlaceLayer(index: number, total: number) {
  const place = (total - index) * 2 - 1;
  return { place, badge: place + 1 };
}

/**
 * 위치와 회전을 CSS transform 값으로 바꿉니다.
 * @param position 카드 왼쪽 위 기준 위치
 * @param rotate 회전 각도 (CSS 기준)
 */
export function toCardTransform(position: { x: number; y: number }, rotate: number) {
  return `translate(${position.x}px, ${position.y}px) rotate(${rotate}deg)`;
}
