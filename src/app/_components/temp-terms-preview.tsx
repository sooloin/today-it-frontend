'use client';

import { useState } from 'react';

import { type SignupCodeError, type SignupEmailServerError } from '@/app/_model/signup-email';
import {
  type SignupNicknameStatus,
  type SignupPasswordServerError,
  type SignupProfileValues,
} from '@/app/_model/signup-profile';
import { type SignupTermId } from '@/app/_model/signup-terms';
import { useCountdown } from '@/app/_model/use-countdown';
import { Button, Logo, Modal } from '@/shared/ui';

import { type SignupEmailPhase, SignupEmailStep } from './signup/signup-email-step';
import { SignupPreferenceStep } from './signup/signup-preference-step';
import { SignupProfileStep } from './signup/signup-profile-step';
import { SignupTermsStep } from './signup/signup-terms-step';

/**
 * 임시 확인용 컴포넌트입니다. 회원가입 모달 조립 시 삭제합니다.
 *
 * 테스트 입력: registered@test.com(이미 가입), social@test.com(소셜 가입),
 * 인증코드 111111(불일치), 000000(만료), 그 외 6자리는 성공,
 * 닉네임 중복확인(중복), 시스템관리자(사용 불가), 그 외는 사용 가능, 비밀번호 1234567890(차단)
 */
export function TempTermsPreview() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<'terms' | 'email' | 'profile' | 'preference'>('terms');
  const [agreedIds, setAgreedIds] = useState<SignupTermId[]>([]);
  const [phase, setPhase] = useState<SignupEmailPhase>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<SignupEmailServerError>();
  const [codeError, setCodeError] = useState<SignupCodeError>();
  const [nicknameStatus, setNicknameStatus] = useState<SignupNicknameStatus>();
  const [passwordError, setPasswordError] = useState<SignupPasswordServerError>();
  const { isExpired, secondsLeft, start } = useCountdown(300);

  function requestCode(requestedEmail: string) {
    if (requestedEmail === 'registered@test.com') {
      setEmailError('registered');
      return;
    }

    if (requestedEmail === 'social@test.com') {
      setEmailError('social');
      return;
    }

    setEmail(requestedEmail);
    setPhase('code');
    setCodeError(undefined);
    start();
  }

  function verifyCode(code: string) {
    const digits = code.replace(/\D/g, '');

    if (isExpired || digits === '000000') {
      setCodeError('expired');
      return;
    }

    if (digits === '111111') {
      setCodeError('invalid');
      return;
    }

    setStep('profile');
  }

  function checkNickname(value: string) {
    setNicknameStatus('checking');
    setTimeout(() => {
      setNicknameStatus(
        value === '중복확인' ? 'duplicated' : value === '시스템관리자' ? 'forbidden' : 'available',
      );
    }, 500);
  }

  function submitProfile({ password }: SignupProfileValues) {
    if (password === '1234567890') {
      setPasswordError('blocked');
      return;
    }

    setStep('preference');
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        시작하기
      </Button>
      <Modal logo={<Logo />} onOpenChange={setOpen} open={open}>
        {step === 'preference' ? (
          <SignupPreferenceStep onSkip={() => setOpen(false)} onSubmit={() => setOpen(false)} />
        ) : step === 'profile' ? (
          <SignupProfileStep
            nicknameStatus={nicknameStatus}
            onCheckNickname={checkNickname}
            onNicknameChange={() => setNicknameStatus(undefined)}
            onPasswordChange={() => setPasswordError(undefined)}
            onSubmit={submitProfile}
            passwordError={passwordError}
          />
        ) : step === 'terms' ? (
          <SignupTermsStep
            defaultAgreedIds={agreedIds}
            loginHref="/login"
            onNext={(nextAgreedIds) => {
              setAgreedIds(nextAgreedIds);
              setStep('email');
            }}
          />
        ) : (
          <SignupEmailStep
            codeError={codeError ?? (isExpired ? 'expired' : undefined)}
            defaultEmail={email}
            emailError={emailError}
            loginHref="/login"
            onCodeChange={() => setCodeError(undefined)}
            onEmailChange={() => setEmailError(undefined)}
            onRequestCode={requestCode}
            onResendCode={() => {
              setCodeError(undefined);
              start();
            }}
            onVerifyCode={verifyCode}
            phase={phase}
            timerSeconds={secondsLeft}
          />
        )}
      </Modal>
    </>
  );
}
