import { Assignment, AssignmentStatus, AssignmentType, AssignmentWithCourse, Course } from '../types/canvas';
import CanvasApi from './canvasApi';

class AssignmentService {
  public readonly canvasApi: CanvasApi;

  constructor(canvasApi: CanvasApi) {
    this.canvasApi = canvasApi;
  }

  // Determine assignment type from submission_types and other properties
  private getAssignmentType(assignment: Assignment): AssignmentType {
    if (assignment.quiz_id) {
      return AssignmentType.Quiz;
    }
    
    if (assignment.submission_types.includes('discussion_topic')) {
      return AssignmentType.Discussion;
    }
    
    if (assignment.submission_types.includes('external_tool')) {
      return AssignmentType.ExternalTool;
    }
    
    return AssignmentType.Assignment;
  }

  // Determine assignment status based on due date and submission status
  private getAssignmentStatus(assignment: Assignment): AssignmentStatus {
    // Check if the assignment has no due date
    if (!assignment.due_at) {
      return AssignmentStatus.Undated;
    }
    
    const now = new Date();
    const dueDate = new Date(assignment.due_at);
    
    // Check if the assignment is overdue
    if (dueDate < now) {
      // If the assignment has a submission that's marked as missing, it's overdue
      if (assignment.submission?.missing) {
        return AssignmentStatus.Overdue;
      }
      
      // If the late submission is allowed, it might still be available
      if (assignment.submission?.workflow_state === 'unsubmitted') {
        return AssignmentStatus.Overdue;
      }
      
      // Default to overdue for any past-due assignment
      return AssignmentStatus.Overdue;
    }
    
    // If due date is in the future, it's upcoming
    return AssignmentStatus.Upcoming;
  }

  // Process assignment to add additional info
  private processAssignment(assignment: Assignment, course: Course): AssignmentWithCourse {
    return {
      ...assignment,
      course_name: course.name,
      course_code: course.course_code,
      type: this.getAssignmentType(assignment),
      status: this.getAssignmentStatus(assignment)
    };
  }

  // Get all incomplete assignments from all active courses
  public async getAllIncompleteAssignments(): Promise<AssignmentWithCourse[]> {
    try {
      // First, get all active courses
      const courses = await this.canvasApi.getActiveCourses();
      
      // For each course, get incomplete assignments
      const assignmentPromises = courses.map(async (course) => {
        try {
          const assignments = await this.canvasApi.getIncompleteAssignments(course.id);
          // Process each assignment to add course info and assignment type
          return assignments.map(assignment => this.processAssignment(assignment, course));
        } catch (error) {
          console.error(`Error fetching assignments for course ${course.id}:`, error);
          return [];
        }
      });
      
      // Wait for all promises to resolve
      const assignmentsByClass = await Promise.all(assignmentPromises);
      
      // Flatten the array of arrays into a single array
      return assignmentsByClass.flat();
    } catch (error) {
      console.error('Error fetching incomplete assignments:', error);
      throw error;
    }
  }

  // Get overdue and upcoming assignments
  public async getOverdueAndUpcomingAssignments(): Promise<{
    overdue: AssignmentWithCourse[];
    upcoming: AssignmentWithCourse[];
  }> {
    try {
      const allAssignments = await this.getAllIncompleteAssignments();
      
      return {
        overdue: allAssignments.filter(assignment => assignment.status === AssignmentStatus.Overdue),
        upcoming: allAssignments.filter(assignment => assignment.status === AssignmentStatus.Upcoming)
      };
    } catch (error) {
      console.error('Error categorizing assignments:', error);
      throw error;
    }
  }
}

export default AssignmentService;