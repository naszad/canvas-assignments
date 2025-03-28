// Types for Canvas API responses

export interface User {
  id: number;
  name: string;
  avatar_url?: string;
  email?: string;
}

export interface Course {
  id: number;
  name: string;
  course_code: string;
  start_at: string | null;
  end_at: string | null;
  enrollment_term_id: number;
  workflow_state: string;
  term?: {
    id: number;
    name: string;
    start_at: string | null;
    end_at: string | null;
  };
}

export interface Assignment {
  id: number;
  name: string;
  description?: string;
  due_at: string | null;
  points_possible: number;
  course_id: number;
  html_url: string;
  submission_types: string[];
  has_submitted_submissions: boolean;
  published: boolean;
  submission?: Submission;
  quiz_id?: number;
  locked_for_user?: boolean;
  lock_at?: string | null;
  unlock_at?: string | null;
}

export interface Submission {
  id?: number;
  assignment_id: number;
  user_id: number;
  submitted_at: string | null;
  workflow_state: string;
  late: boolean;
  missing: boolean;
  submission_type: string | null;
  score: number | null;
  grade: string | null;
  attempt?: number | null;
  html_url?: string;
}

export enum AssignmentType {
  Assignment = 'Assignment',
  Quiz = 'Quiz',
  Discussion = 'Discussion',
  ExternalTool = 'ExternalTool'
}

export enum AssignmentStatus {
  Overdue = 'overdue',
  Upcoming = 'upcoming',
  Undated = 'undated'
}

// Interface representing a grouped assignment with course information
export interface AssignmentWithCourse extends Assignment {
  course_name: string;
  course_code: string;
  type: AssignmentType;
  status: AssignmentStatus;
} 