import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ButtonLink } from '@/shared/ui';

import { CoursesTopHeader } from '../_components/courses-top-header';
import { findCourseFixture } from '../_model/courses.fixtures';

export const metadata: Metadata = {
  title: '코스 상세 | ToDayIt',
};

/**
 * 코스 상세 화면 자리입니다. 상세 디자인이 확정되면 이 라우트에서 구현합니다.
 */
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = findCourseFixture(decodeURIComponent(courseId));
  if (!course) notFound();

  return (
    <>
      <CoursesTopHeader />
      <main
        className="mx-auto flex w-full max-w-[calc(var(--spacing-header-width)+48px)] flex-1 flex-col items-center gap-24 px-24 pt-48 pb-96 text-center"
        data-slot="course-detail-placeholder"
      >
        <h1 className="text-heading-h2 text-text-primary">{course.title}</h1>
        <p className="text-body-b2 text-text-muted">코스 상세 화면은 준비 중이에요.</p>
        <ButtonLink href="/courses" size="md">
          코스 홈으로
        </ButtonLink>
      </main>
    </>
  );
}
