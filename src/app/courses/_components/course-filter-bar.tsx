import { FilterTab } from '@/shared/ui';

const courseFilterLabels = ['지역', '콘셉트', '시간'] as const;

/**
 * 코스 홈 검색창 아래의 지역·콘셉트·시간 필터 바입니다.
 *
 * 현재는 피그마 `Search/Course Filter Bar`의 모양만 표시합니다. 장소 PlaceFilterBar와 같은
 * 테두리 방식(ring-inset)을 써서 높이가 공용 FilterTab 높이와 같습니다.
 * 필터 패널과 선택 동작은 코스 검색·필터 이슈에서 공통 컴포넌트로 연결합니다.
 */
export function CourseFilterBar() {
  return (
    <div
      aria-label="코스 필터"
      className="flex h-filter-tab-height w-full shrink-0 rounded-full bg-surface-default ring-1 ring-border-default ring-inset"
      data-slot="course-filter-bar"
      role="group"
    >
      {courseFilterLabels.map((label) => (
        // 패널이 연결되기 전까지 눌러도 바뀌지 않으므로 보조 기술에도 사용할 수 없다고 알립니다.
        <FilterTab aria-disabled="true" key={label} label={label} pressed={false} />
      ))}
    </div>
  );
}
