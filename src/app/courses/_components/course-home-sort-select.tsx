'use client';

import { Select } from '@base-ui/react/select';

import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui';

import {
  type CourseHomeSort,
  courseHomeSortOptions,
  getCourseHomeSortLabel,
  isCourseHomeSort,
} from '../_model/course-home';

interface CourseHomeSortSelectProps {
  /** 섹션 제목에 연결할 DOM ID */
  id?: string;
  value: CourseHomeSort;
  onValueChange: (value: CourseHomeSort) => void;
}

/**
 * 섹션 제목을 눌러 추천 코스와 인기 코스를 바꾸는 드롭다운입니다.
 *
 * 피그마 `Navigation/Section Header`(Type=Dropdown)와 `Input/Dropdown List Panel`을 따릅니다.
 */
export function CourseHomeSortSelect({ id, value, onValueChange }: CourseHomeSortSelectProps) {
  const items = courseHomeSortOptions.map(({ label, value: optionValue }) => ({
    label,
    value: optionValue,
  }));

  return (
    <Select.Root
      items={items}
      onValueChange={(nextValue) => {
        if (isCourseHomeSort(nextValue)) onValueChange(nextValue);
      }}
      value={value}
    >
      <h2 className="w-fit text-heading-h2 text-text-primary" id={id}>
        <Select.Trigger
          aria-label={`${getCourseHomeSortLabel(value)}, 코스 정렬 바꾸기`}
          className="group flex cursor-pointer items-center gap-12 rounded-lg outline-none select-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
          data-slot="course-home-sort-trigger"
        >
          <Select.Value />
          <Select.Icon className="flex size-24 shrink-0 items-center justify-center text-icon-default">
            <Icon className="group-data-popup-open:hidden" name="chevron-down" tone="inherit" />
            <Icon
              className="hidden group-data-popup-open:inline-block"
              name="chevron-up"
              tone="inherit"
            />
          </Select.Icon>
        </Select.Trigger>
      </h2>

      <Select.Portal>
        <Select.Positioner
          align="start"
          alignItemWithTrigger={false}
          className="z-50 outline-none"
          sideOffset={22}
        >
          <Select.Popup
            className="w-dropdown-panel-width overflow-hidden rounded-xl border-sm border-border-default bg-surface-default py-8 text-caption-c1 text-text-primary shadow-dropdown outline-none"
            data-slot="course-home-sort-popup"
          >
            <Select.List className="outline-none">
              {courseHomeSortOptions.map((option) => (
                <Select.Item
                  className={({ highlighted, selected }) =>
                    cn(
                      'flex h-option-row w-full cursor-pointer items-center justify-between px-16 outline-none select-none',
                      selected
                        ? 'bg-state-selected'
                        : highlighted
                          ? 'bg-state-hover'
                          : 'bg-surface-default',
                    )
                  }
                  key={option.value}
                  value={option.value}
                >
                  <Select.ItemText className="min-w-0 truncate">{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="ml-8 flex shrink-0 text-icon-default">
                    <Icon name="check" size={24} tone="inherit" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
