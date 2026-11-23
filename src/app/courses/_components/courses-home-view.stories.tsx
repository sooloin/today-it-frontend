import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { LoginModalHost } from '@/app/_components/login-modal-host';
import { useLoginModalStore } from '@/app/_model/login-modal-store';
import { Footer } from '@/shared/ui';

import { popularCourses, recommendedCourses } from '../_model/courses.fixtures';
import { CourseHomeErrorState } from './course-home-error-state';
import { CourseHomeLoadingView } from './course-home-loading-view';
import { CoursesHomeView } from './courses-home-view';

const meta = {
  title: 'App/Courses/CoursesHomeView',
  component: CoursesHomeView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => {
      useLoginModalStore.setState({ isOpen: false });
      return (
        <div className="flex min-h-screen flex-col">
          <Story />
          <Footer
            contactHref="mailto:contact@example.com"
            privacyHref="/privacy"
            termsHref="/terms"
          />
          <LoginModalHost />
        </div>
      );
    },
  ],
  args: { viewer: 'member', recommendedCourses, popularCourses },
} satisfies Meta<typeof CoursesHomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 취향을 설정한 회원: 추천 코스로 시작하고 인기 코스로 바꿀 수 있습니다. */
export const Member: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('group', { name: '당신을 위한 추천 코스' });

    await expect(within(region).getByText('1 / 12')).toBeInTheDocument();
    await userEvent.click(within(region).getByRole('button', { name: '다음' }));
    await expect(within(region).getByText('2 / 12')).toBeInTheDocument();
    await userEvent.click(within(region).getByRole('button', { name: '이전' }));
    await userEvent.click(within(region).getByRole('button', { name: '이전' }));
    await expect(within(region).getByText('12 / 12')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('combobox', { name: /코스 정렬 바꾸기/ }));
    await userEvent.click(await screen.findByRole('option', { name: '지금 인기있는 코스' }));
    await waitFor(() =>
      expect(canvas.getByRole('group', { name: '지금 인기있는 코스' })).toBeInTheDocument(),
    );
    await expect(canvas.getByText('1 / 12')).toBeInTheDocument();
  },
};

/** 비회원: 로그인 안내와 인기 코스를 보고, 좋아요를 누르면 로그인 모달이 열립니다. */
export const Guest: Story = {
  args: { viewer: 'guest' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText('로그인하면 취향에 맞는 코스를 추천해 드려요'),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: '지금 인기있는 코스' })).toBeInTheDocument();
    await expect(canvas.queryByRole('combobox')).not.toBeInTheDocument();

    const firstPopular = popularCourses[0];
    await userEvent.click(
      canvas.getByRole('button', { name: new RegExp(`${firstPopular?.title} 좋아요`) }),
    );
    await waitFor(() => expect(useLoginModalStore.getState().isOpen).toBe(true));
  },
};

/** 취향 미설정 회원: 취향 설정 안내 바를 보고 인기 코스를 추천 섹션에서 봅니다. */
export const MemberWithoutPreference: Story = {
  args: { viewer: 'member-without-preference' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText('아직 취향 정보가 없어 인기 코스를 보여드려요'),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '취향 설정' })).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: popularCourses[0]?.title ?? '' }),
    ).toBeInTheDocument();
  },
};

/** 회원 좋아요는 API 연결 전까지 화면 안에서만 토글됩니다. */
export const MemberLikeToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = recommendedCourses[0];
    const likeButton = canvas.getByRole('button', {
      name: `${first?.title} 좋아요 ${first?.likeCount}개`,
    });

    await userEvent.click(likeButton);
    await expect(
      canvas.getByRole('button', {
        name: `${first?.title} 좋아요 ${(first?.likeCount ?? 0) + 1}개`,
      }),
    ).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Loading: Story = {
  render: () => <CourseHomeLoadingView viewer="member" />,
};

export const ErrorState: Story = {
  render: () => <CourseHomeErrorState onRetry={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('alert')).toHaveTextContent('코스를 불러오지 못했어요');
    await expect(canvas.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  },
};
