'use client';

import { useState } from 'react';

import { type SignupTermId } from '@/app/_model/signup-terms';
import { Button, Modal } from '@/shared/ui';

import { SignupTermsStep } from './signup-terms-step';

/** 임시 확인용 컴포넌트, 회원가입 모달 조립 시 삭제 예정 */
export function TempTermsPreview() {
  const [open, setOpen] = useState(true);
  const [agreedIds, setAgreedIds] = useState<SignupTermId[]>([]);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        시작하기
      </Button>
      <Modal onOpenChange={setOpen} open={open}>
        <SignupTermsStep
          agreedIds={agreedIds}
          loginHref="/login"
          onAgreedIdsChange={setAgreedIds}
          onNext={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
