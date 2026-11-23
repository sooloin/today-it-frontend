'use client';

import { useEffect } from 'react';

import { CourseFilterBar } from './_components/course-filter-bar';
import { CourseHomeErrorState } from './_components/course-home-error-state';
import { CoursesTopHeader } from './_components/courses-top-header';

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
      <CoursesTopHeader searchFilter={<CourseFilterBar />} />
      <CourseHomeErrorState onRetry={retry} />
    </>
  );
}
