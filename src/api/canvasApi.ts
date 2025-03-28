import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Assignment, Course, User } from '../types/canvas';

interface CanvasApiConfig {
  baseURL: string;
  token: string;
}

class CanvasApi {
  private api: AxiosInstance;
  private config: CanvasApiConfig;
  private proxyUrl: string = 'http://localhost:3001/api/canvas'; // Our proxy server URL

  constructor(config: CanvasApiConfig) {
    this.config = config;
    // Create Axios instance pointing to our proxy server
    this.api = axios.create({
      baseURL: this.proxyUrl,
      headers: {
        'Canvas-Token': config.token,
        'Canvas-Base-Url': config.baseURL
      }
    });

    // Add response interceptor for pagination
    this.api.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  // Update token (e.g., when user provides a new one)
  public updateToken(token: string): void {
    this.config.token = token;
    this.api.defaults.headers['Canvas-Token'] = token;
  }

  // Get user profile
  public async getUserProfile(): Promise<User> {
    try {
      const response: AxiosResponse = await this.api.get('/users/self/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Get active courses for current user
  public async getActiveCourses(): Promise<Course[]> {
    try {
      const response: AxiosResponse = await this.api.get('/courses', {
        params: {
          enrollment_state: 'active',
          include: ['term'],
          state: ['available'],
          per_page: 100
        }
      });
      
      // Filter out courses without terms or past courses
      const now = new Date();
      return response.data.filter((course: Course) => {
        // Skip courses without name (might be invalid or placeholder courses)
        if (!course.name || course.name.trim() === '') {
          return false;
        }

        // If course has a term with end date, check if it's in the future or recent past (within 14 days)
        if (course.term?.end_at) {
          const endDate = new Date(course.term.end_at);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          return endDate > twoWeeksAgo; // Include courses that ended within the last 2 weeks
        }
        
        // If course has a published state, check if it's published
        if (course.workflow_state) {
          return ['available', 'completed', 'active'].includes(course.workflow_state);
        }
        
        // If no term or no end date, include it (current courses)
        return true;
      });
    } catch (error) {
      console.error('Error fetching active courses:', error);
      throw error;
    }
  }

  // Get incomplete assignments for a course
  public async getIncompleteAssignments(courseId: number): Promise<Assignment[]> {
    try {
      // First, get unsubmitted assignments
      const unsubmittedResponse: AxiosResponse = await this.api.get(`/courses/${courseId}/assignments`, {
        params: {
          bucket: 'unsubmitted',
          include: ['submission'],
          per_page: 100
        }
      });
      
      // Then, get upcoming assignments
      const upcomingResponse: AxiosResponse = await this.api.get(`/courses/${courseId}/assignments`, {
        params: {
          bucket: 'upcoming',
          include: ['submission'],
          per_page: 100
        }
      });
      
      // Combine and deduplicate assignments from both responses
      const unsubmitted = unsubmittedResponse.data || [];
      const upcoming = upcomingResponse.data || [];
      
      // Create a map to deduplicate assignments by ID
      const assignmentMap = new Map<number, Assignment>();
      
      // Add unsubmitted assignments
      unsubmitted.forEach((assignment: Assignment) => {
        assignmentMap.set(assignment.id, assignment);
      });
      
      // Add upcoming assignments that aren't already in the map
      upcoming.forEach((assignment: Assignment) => {
        if (!assignmentMap.has(assignment.id)) {
          assignmentMap.set(assignment.id, assignment);
        }
      });
      
      // Convert map back to array
      return Array.from(assignmentMap.values());
    } catch (error) {
      console.error(`Error fetching assignments for course ${courseId}:`, error);
      throw error;
    }
  }

  // Get a single assignment
  public async getAssignment(courseId: number, assignmentId: number): Promise<Assignment> {
    try {
      const response: AxiosResponse = await this.api.get(`/courses/${courseId}/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${assignmentId}:`, error);
      throw error;
    }
  }

  // Get overdue assignments for a course
  public async getOverdueAssignments(courseId: number): Promise<Assignment[]> {
    try {
      const response: AxiosResponse = await this.api.get(`/courses/${courseId}/assignments`, {
        params: {
          bucket: 'overdue',
          include: ['submission']
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching overdue assignments for course ${courseId}:`, error);
      throw error;
    }
  }

  // Get upcoming assignments for a course
  public async getUpcomingAssignments(courseId: number): Promise<Assignment[]> {
    try {
      const response: AxiosResponse = await this.api.get(`/courses/${courseId}/assignments`, {
        params: {
          bucket: 'upcoming',
          include: ['submission']
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching upcoming assignments for course ${courseId}:`, error);
      throw error;
    }
  }
}

export default CanvasApi; 