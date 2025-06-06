import { CanvasCourse } from '@/types/course';

export const getCourses = async (domain: string, token: string): Promise<CanvasCourse[]> => {
  const response = await fetch(
    `https://${domain}/api/v1/courses?per_page=100&enrollment_state=active&state[]=current_and_concluded&include[]=banner_image&include[]=course_image&include[]=current_grading_period_scores&include[]=favorites&include[]=permissions&include[]=sections&include[]=syllabus_body&include[]=term&include[]=total_scores&include[]=observed_users&include[]=settings&include[]=grading_scheme&include[]=tabs&no_verifiers=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error(await response.text());
  const courses = await response.json();
  return courses.sort((a: CanvasCourse, b: CanvasCourse) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
};
