import { z } from 'zod';

export type SignupEmailPhase = 'email' | 'code';
type SignupEmailClientError = 'format';
/**
 * `registered`는 이미 가입, `social`은 소셜 로그인으로 가입된 이메일입니다.
 * `tooSoon`은 직전 발송 후 재전송 대기 시간이 지나지 않은 경우, `limitExceeded`는 발송 횟수 제한에 걸린 경우입니다.
 * `verificationExpired`는 가입 요청 때 이메일 인증 정보가 만료되어 인증을 다시 해야 하는 경우입니다.
 */
export type SignupEmailServerError =
  'registered' | 'social' | 'tooSoon' | 'limitExceeded' | 'verificationExpired';
/**
 * `invalid`는 불일치, `expired`는 시간 만료입니다.
 * `reissued`는 3회 연속 틀려서 서버가 새 인증코드를 다시 보낸 경우입니다.
 * `limitExceeded`와 `tooSoon`은 인증코드를 보내려다 막힌 경우로, 코드 입력 단계의 재전송과
 * 3회 실패 후 자동 재발송에서 나옵니다. 코드 단계에서는 가장 최근 오류 하나만 보여줍니다.
 */
export type SignupCodeError = 'invalid' | 'expired' | 'reissued' | 'limitExceeded' | 'tooSoon';

// 이메일 단계의 첫 발송과 코드 단계의 재전송이 같은 문구를 씁니다.
const sendErrorMessages = {
  tooSoon: '인증코드는 1분 후에 다시 요청할 수 있어요.',
  limitExceeded: '인증 요청 횟수를 초과했어요. 30분 후 다시 시도해 주세요.',
} as const;

export const signupEmailErrorMessages = {
  format: '이메일 형식이 올바르지 않아요.',
  registered: '이미 가입된 이메일이에요.',
  social: '소셜 로그인으로 가입된 이메일이에요.',
  tooSoon: sendErrorMessages.tooSoon,
  limitExceeded: sendErrorMessages.limitExceeded,
  verificationExpired: '이메일 인증이 만료되었어요. 인증코드를 다시 받아 인증해 주세요.',
} as const satisfies Record<SignupEmailClientError | SignupEmailServerError, string>;

export const signupCodeErrorMessages = {
  invalid: '올바르지 않은 인증코드예요.',
  expired: '인증코드가 만료되었어요. 재전송 후 다시 입력해주세요.',
  reissued: '3회 잘못 입력하여 인증코드를 다시 보냈어요. 새 코드를 입력해주세요.',
  limitExceeded: sendErrorMessages.limitExceeded,
  tooSoon: sendErrorMessages.tooSoon,
} as const satisfies Record<SignupCodeError, string>;

// 인증코드는 값만 담고, 자릿수는 isCodeComplete로 확인합니다.
export const signupEmailSchema = z.object({
  email: z.string().trim().pipe(z.email(signupEmailErrorMessages.format)),
  code: z.string(),
});

export type SignupEmailValues = z.infer<typeof signupEmailSchema>;

const SIGNUP_CODE_LENGTH = 6;

/** 인증코드의 유효 시간(초). 서버는 30분 동안 유효합니다. */
export const SIGNUP_CODE_EXPIRES_SECONDS = 1800;

/** 인증코드 6자리를 모두 입력했는지 확인합니다. `000 - 000`의 구분자는 무시합니다. */
export function isCodeComplete(value: string) {
  return value.replace(/\D/g, '').length === SIGNUP_CODE_LENGTH;
}
