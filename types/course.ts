export type CanvasCourse = {
  id: number;
  name: string;
  account_id: number;
  uuid: string;
  start_at: string | null;
  end_at: string | null;
  course_code: string;
  workflow_state: 'unpublished' | 'available' | 'completed' | 'deleted';
  enrollments?: CanvasEnrollment[];
  calendar?: {
    ics: string;
  };
  default_view: 'feed' | 'wiki' | 'modules' | 'assignments' | 'syllabus';
  syllabus_body?: string;
  needs_grading_count?: number;
  term?: {
    id: number;
    name: string;
    start_at: string | null;
    end_at: string | null;
  };
  course_progress?: CanvasCourseProgress;
  sis_course_id?: string | null;
  integration_id?: string | null;
  enrollment_term_id?: number;
  grading_standard_id?: number | null;
  created_at: string;
  updated_at: string;
  locale?: string;
  image_download_url?: string | null;
  banner_image_download_url?: string | null;
  position?: number;
  // Add more fields as needed based on your usage
}

export type CanvasEnrollment = {
  type: string; // e.g., 'student', 'teacher', etc.
  role: string; // e.g., 'StudentEnrollment', 'TeacherEnrollment', etc.
  role_id: string;
  user_id: string;
  enrollment_state: 'active' | 'invited' | 'inactive' | 'completed' | string;
  limit_privileges_to_course_section: boolean;
  current_grading_period_id?: number | null;
  current_grading_period_title?: string | null;
  has_grading_periods?: boolean;
  multiple_grading_periods_enabled?: boolean;
  computed_current_grade?: string | null;
  computed_current_score?: number | null;
  computed_current_letter_grade?: string | null;
  computed_final_grade?: string | null;
  computed_final_score?: number | null;
  totals_for_all_grading_periods_option?: boolean;
  current_period_computed_current_score?: number | null;
  current_period_computed_final_score?: number | null;
  current_period_computed_current_grade?: string | null;
  current_period_computed_final_grade?: string | null;
};

export type CanvasCourseProgress = {
  requirement_count: number;
  requirement_completed_count: number;
  next_requirement_url?: string | null;
  completed_at?: string | null;
};
