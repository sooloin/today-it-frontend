import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface SignupFieldMessageProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** 오류는 즉시 읽히도록 `alert`, 성공은 `status`로 전달합니다. 기본값은 `error`입니다. */
  tone?: 'error' | 'success';
}

/**
 * 입력창 아래 문구 자리를 미리 확보하는 영역입니다. 문구가 나타나거나 사라져도 모달 높이가 변하지 않게 합니다.
 * 문구가 두 줄 이상이면 그만큼 늘어납니다.
 */
export function SignupFieldMessageSlot({ children }: { children?: ReactNode }) {
  return <div className="min-h-20">{children}</div>;
}

/** 회원가입 입력창 아래에 표시하는 오류·성공 문구입니다. */
export function SignupFieldMessage({
  children,
  className,
  id,
  tone = 'error',
}: SignupFieldMessageProps) {
  return (
    <p
      className={cn(
        'text-caption-c1',
        tone === 'error' ? 'text-text-error' : 'text-text-success',
        className,
      )}
      id={id}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}
