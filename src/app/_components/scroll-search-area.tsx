'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { cn } from '@/shared/lib';
import { Divider, SearchBar } from '@/shared/ui';

interface ScrollSearchAreaProps {
  /** 검색 영역에 표시할 검색 요소 */
  children?: ReactNode;
  /** 검색창 아래에 표시할 필터 바. 높이는 공용 FilterTab 높이를 기준으로 자리를 확보합니다. */
  filterBar?: ReactNode;
}

/** 아래로 스크롤하면 숨고, 위로 스크롤하면 고정 상단 바 아래에 나타납니다. */
export function ScrollSearchArea({ children, filterBar }: ScrollSearchAreaProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let previousScrollY = Math.max(0, window.scrollY);

    function updateVisibility() {
      const currentScrollY = Math.max(0, window.scrollY);

      if (currentScrollY !== previousScrollY) {
        setIsVisible(currentScrollY === 0 || currentScrollY < previousScrollY);
        previousScrollY = currentScrollY;
      }
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return (
    <>
      <div aria-hidden="true" className={cn('pt-18', filterBar ? 'pb-18' : 'pb-36')}>
        <div className="h-search-bar-height" />
        {filterBar ? (
          <div className="mt-12 h-[calc(var(--spacing-filter-tab-height)+2px)]" />
        ) : null}
        <div className="h-divider" />
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-header-height z-40 overflow-hidden">
        <div
          aria-hidden={!isVisible}
          inert={!isVisible}
          className={cn(
            'flex w-full flex-col bg-surface-default transition-transform duration-300 ease-out motion-reduce:transition-none',
            isVisible ? 'pointer-events-auto translate-y-0' : '-translate-y-full',
          )}
        >
          <div
            className={cn(
              'mx-auto flex w-full max-w-header-width justify-center pt-18',
              filterBar ? 'flex-col items-center gap-12 pb-18' : 'pb-36',
            )}
          >
            {children ?? <SearchBar className="w-full" placeholder="검색어를 입력해주세요" />}
            {filterBar}
          </div>
          <Divider />
        </div>
      </div>
    </>
  );
}
