import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import { Logo, Modal } from '@/shared/ui';

import { SIGNUP_CODE_EXPIRES_SECONDS } from '../model/signup-email';
import { SignupEmailStep } from './signup-email-step';

const meta = {
  title: 'Features/Signup/SignupEmailStep',
  component: SignupEmailStep,
  tags: ['autodocs'],
  decorators: [
    (StoryComponent) => (
      <Modal defaultOpen logo={<Logo />}>
        <StoryComponent />
      </Modal>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 720 } },
  },
  args: {
    phase: 'email',
    loginHref: '/login',
    onEmailChange: fn(),
    onCodeChange: fn(),
    onRequestCode: fn(),
    onVerifyCode: fn(),
    onResendCode: fn(),
    onSocialLogin: fn(),
  },
} satisfies Meta<typeof SignupEmailStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmailFilled: Story = {
  args: { defaultEmail: 'wowowoooo@gmail.com' },
};

export const EmailFormatError: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const email = within(dialog).getByRole('textbox', { name: '이메일' });
    const next = within(dialog).getByRole('button', { name: '다음' });

    await expect(next).toBeDisabled();

    await userEvent.type(email, 'wowowoooo');
    await expect(next).toBeEnabled();

    await userEvent.click(next);
    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '이메일 형식이 올바르지 않아요.',
    );
    await expect(email).toHaveAttribute('aria-invalid', 'true');

    await userEvent.type(email, '@gmail.com');
    await expect(within(dialog).queryByRole('alert')).not.toBeInTheDocument();
  },
};

export const KeepsHeightWhenErrorShows: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const email = within(dialog).getByRole('textbox', { name: '이메일' });
    const heightBefore = dialog.getBoundingClientRect().height;

    // 오류 문구 자리가 미리 확보되어 있어 문구가 나타나도 모달 높이가 변하지 않습니다.
    await userEvent.type(email, 'wowowoooo');
    await userEvent.click(within(dialog).getByRole('button', { name: '다음' }));
    await expect(within(dialog).getByRole('alert')).toBeInTheDocument();

    await expect(dialog.getBoundingClientRect().height).toBe(heightBefore);
  },
};

export const CodePhaseSpacing: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    defaultCode: '123456',
    timerSeconds: 1680,
  },
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const email = within(dialog).getByRole('textbox', { name: '이메일' });
    const code = within(dialog).getByRole('textbox', { name: '인증코드' });

    // 시안: 잠긴 이메일 입력창과 인증코드 입력창 사이는 24px이고, 이메일 아래에는 문구 자리가 없습니다.
    const gap = code.getBoundingClientRect().top - email.getBoundingClientRect().bottom;

    // 입력창 테두리 1px 정도의 오차는 허용합니다. 문구 자리가 있으면 56px 가까이 벌어집니다.
    await expect(gap).toBeGreaterThanOrEqual(24);
    await expect(gap).toBeLessThan(28);
  },
};

export const EmailTooLong: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const email = within(dialog).getByRole('textbox', { name: '이메일' });

    // 서버는 이메일을 100자까지 받으므로 요청 전에 막습니다.
    await userEvent.click(email);
    await userEvent.paste(`${'a'.repeat(95)}@gmail.com`);
    await userEvent.click(within(dialog).getByRole('button', { name: '다음' }));

    await expect(within(dialog).getByRole('alert')).toHaveTextContent(
      '이메일은 100자 이하로 입력해 주세요.',
    );
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(args.onRequestCode).not.toHaveBeenCalled();
  },
};

export const RequestCode: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');

    await userEvent.type(
      within(dialog).getByRole('textbox', { name: '이메일' }),
      'wowowoooo@gmail.com{Enter}',
    );

    await expect(args.onRequestCode).toHaveBeenCalledWith('wowowoooo@gmail.com');
  },
};

export const EmailAlreadyRegistered: Story = {
  args: { defaultEmail: 'poppop@gmail.com', emailError: 'registered' },
};

export const EmailRegisteredWithSocial: Story = {
  args: { defaultEmail: 'poppop@gmail.com', emailError: 'social' },
};

export const CodeRequested: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    timerSeconds: SIGNUP_CODE_EXPIRES_SECONDS,
  },
};

export const CodeFilled: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    defaultCode: '123456',
    timerSeconds: 272,
  },
};

export const CodeInvalid: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    defaultCode: '010000',
    codeError: 'invalid',
    timerSeconds: 272,
  },
};

export const SendLimitExceeded: Story = {
  args: { defaultEmail: 'poppop@gmail.com', emailError: 'limitExceeded' },
};

export const VerificationExpired: Story = {
  args: { defaultEmail: 'poppop@gmail.com', emailError: 'verificationExpired' },
};

export const CodeLimitExceeded: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    codeError: 'limitExceeded',
    isResendDisabled: true,
    timerSeconds: 272,
  },
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    // 발송 횟수 제한(30분 차단) 중에는 재전송을 누를 수 없습니다.
    await expect(within(dialog).getByRole('button', { name: '재전송' })).toBeDisabled();
    await expect(within(dialog).getByText(/발송 횟수를 초과했어요/)).toBeInTheDocument();
  },
};

export const CodeResendTooSoon: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    codeError: 'tooSoon',
    timerSeconds: 272,
  },
};

export const CodeReissued: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    codeError: 'reissued',
    timerSeconds: SIGNUP_CODE_EXPIRES_SECONDS,
  },
};

export const CodeExpired: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    defaultCode: '000000',
    codeError: 'expired',
    timerSeconds: 0,
  },
};

export const VerifyCode: Story = {
  args: {
    phase: 'code',
    defaultEmail: 'wowowoooo@gmail.com',
    timerSeconds: SIGNUP_CODE_EXPIRES_SECONDS,
  },
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog');
    const next = within(dialog).getByRole('button', { name: '다음' });
    const code = within(dialog).getByRole('textbox', { name: '인증코드' });

    await expect(next).toBeDisabled();

    await userEvent.type(code, '12345');
    await expect(next).toBeDisabled();

    await userEvent.type(code, '6');
    await expect(code).toHaveValue('123 - 456');
    await expect(next).toBeEnabled();

    await userEvent.click(next);
    await expect(args.onVerifyCode).toHaveBeenCalledWith('123 - 456');

    await userEvent.click(within(dialog).getByRole('button', { name: '재전송' }));
    await expect(args.onResendCode).toHaveBeenCalledTimes(1);
    await expect(code).toHaveValue('');
  },
};

export const Submitting: Story = {
  args: { defaultEmail: 'wowowoooo@gmail.com', isSubmitting: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog');

    // 요청 중에 이메일을 바꾸면 화면의 값과 실제 요청한 값이 달라지므로 입력을 막습니다.
    await expect(within(dialog).getByRole('textbox', { name: '이메일' })).toBeDisabled();
    await expect(within(dialog).getByRole('button', { name: '다음' })).toBeDisabled();
  },
};

export const RequestError: Story = {
  args: { defaultEmail: 'wowowoooo@gmail.com', requestError: true },
};
