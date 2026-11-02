import { type SignupApi } from '../model/signup-api';

/**
 * Storybook 전용 응답입니다. 서버 없이 가입 모달의 전체 흐름을 확인할 때만 사용하며 앱 코드에서는 쓰지 않습니다.
 *
 * 항상 성공하며, 이메일이 `error@test.com`이면 인증코드 발송이 실패합니다.
 * 오류 응답별 화면은 각 단계 스토리가 props로 확인합니다.
 */
export function createStorySignupApi({ delayMs = 500 }: { delayMs?: number } = {}): SignupApi {
  const wait = () => new Promise<void>((resolve) => setTimeout(resolve, delayMs));

  return {
    async requestCode(email) {
      await wait();

      if (email === 'error@test.com') {
        throw new Error('story request failed');
      }

      return 'sent';
    },

    async verifyCode() {
      await wait();

      return { verificationToken: 'story-verification-token' };
    },

    async checkNickname() {
      await wait();

      return 'available';
    },

    async signup() {
      await wait();

      return 'created';
    },

    async savePreference() {
      await wait();
    },
  };
}
