import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import type { CourseSummary } from '../_model/course';
import { findCourseFixture, recommendedCourses } from '../_model/courses.fixtures';
import { CourseCard } from './course-card';
import { CourseCardSkeleton } from './course-card-skeleton';

const baseCourse = recommendedCourses[0] as CourseSummary;
const fivePlaceCourse = findCourseFixture('euljiro-retro-tour') as CourseSummary;

const meta = {
  title: 'App/Courses/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '코스 표지 뒤에 포함 장소를 겹쳐 보여 주는 카드입니다. 마우스를 올리거나 포커스하면 장소가 펼쳐집니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-max p-24">
        <Story />
      </div>
    ),
  ],
  args: { course: baseCourse, onLikeClick: fn() },
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Liked: Story = { args: { liked: true } };

export const FivePlaces: Story = { args: { course: fivePlaceCourse } };

export const NoCoverImage: Story = {
  args: { course: { ...baseCourse, coverImageSrc: undefined, title: '표지 없는 코스' } },
};

export const LongText: Story = {
  args: {
    course: {
      ...fivePlaceCourse,
      title: '아주 긴 코스 제목이 카드 너비를 넘어가도 한 줄로 말줄임 처리되는지 확인하는 코스',
      region: '서울특별시 성동구 성수동2가 아주 긴 지역 이름',
    },
  },
};

export const Inactive: Story = { args: { variant: 'inactive' } };

export const Loading: Story = {
  render: () => (
    <div className="flex gap-24">
      <CourseCardSkeleton />
      <CourseCardSkeleton variant="inactive" />
    </div>
  ),
};

export const HoverShowsOrderAndTooltip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvasElement.querySelector('[data-slot="course-card"]') as HTMLElement;

    await userEvent.hover(card);
    await expect(card).toHaveAttribute('data-open', 'true');

    const places = canvasElement.querySelectorAll<HTMLElement>('[data-slot="course-card-place"]');
    await userEvent.hover(places[places.length - 2] as HTMLElement);
    const tooltips = canvasElement.querySelectorAll('[data-slot="course-card-tooltip"]');
    await expect(tooltips[1]).toHaveClass('opacity-100');

    await userEvent.unhover(card);
    await expect(card).not.toHaveAttribute('data-open');
    await expect(canvas.getByRole('link', { name: baseCourse.title })).toHaveAttribute(
      'href',
      `/courses/${baseCourse.id}`,
    );
  },
};

export const KeyboardFocusOpensStack: Story = {
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="course-card"]') as HTMLElement;

    await userEvent.tab();
    await expect(card).toHaveAttribute('data-open', 'true');
    await expect(card).toHaveAccessibleDescription(/포함 장소 3곳/);
  },
};

export const LikeClick: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /좋아요 128개/ }));
    await expect(args.onLikeClick).toHaveBeenCalledTimes(1);
  },
};
