'use client';

import { useEffect } from 'react';

import { TopHeader } from '@/app/_components/top-header';

import { CourseFilterBar } from './_components/course-filter-bar';
import { CourseHomeErrorState } from './_components/course-home-error-state';

interface CoursesErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function CoursesError({ error, retry }: CoursesErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <TopHeader activeSection="courses" auth="guest" searchFilter={<CourseFilterBar />} />
      <CourseHomeErrorState onRetry={retry} />
    </>
  );
}
