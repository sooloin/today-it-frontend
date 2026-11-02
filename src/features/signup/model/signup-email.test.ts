import { describe, expect, it } from 'vitest';

import { signupEmailErrorMessages, signupEmailSchema } from './signup-email';

function emailMessage(email: string) {
  const result = signupEmailSchema.safeParse({ email, code: '' });

  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('이메일 검증', () => {
  it('올바른 형식의 이메일은 통과한다', () => {
    expect(emailMessage('user@example.com')).toBeUndefined();
  });

  it('형식이 올바르지 않으면 형식 문구를 보여준다', () => {
    expect(emailMessage('user')).toBe(signupEmailErrorMessages.format);
  });

  it('앞뒤 공백은 제거하고 검사한다', () => {
    expect(emailMessage('  user@example.com  ')).toBeUndefined();
  });

  it('100자는 통과하고 101자부터 길이 문구를 보여준다', () => {
    const domain = '@example.com';

    expect(emailMessage(`${'a'.repeat(100 - domain.length)}${domain}`)).toBeUndefined();
    expect(emailMessage(`${'a'.repeat(101 - domain.length)}${domain}`)).toBe(
      signupEmailErrorMessages.length,
    );
  });

  it('길이와 형식이 모두 틀리면 길이 문구를 먼저 보여준다', () => {
    expect(emailMessage('a'.repeat(101))).toBe(signupEmailErrorMessages.length);
  });
});
