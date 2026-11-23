import { useId } from 'react';

import { Button, Icon } from '@/shared/ui';

interface CourseHomeErrorStateProps {
  onRetry: () => void;
}

/** 코스 홈을 불러오지 못했을 때 다시 시도를 안내합니다. */
export function CourseHomeErrorState({ onRetry }: CourseHomeErrorStateProps) {
  const titleId = useId();

  return (
    <main className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-1 flex-col items-center px-24 pt-48 pb-96">
      <section
        aria-labelledby={titleId}
        className="flex h-[376px] w-full flex-col items-center justify-center gap-24 py-96"
        data-slot="course-home-error-state"
        role="alert"
      >
        <Icon className="text-icon-error" name="info" size={36} tone="inherit" />
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-heading-h3 text-text-primary" id={titleId}>
            코스를 불러오지 못했어요
          </h1>
          <p className="text-body-b2 text-text-muted">
            요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <Button onClick={onRetry} size="md" variant="primary">
          다시 시도
        </Button>
      </section>
    </main>
  );
}
