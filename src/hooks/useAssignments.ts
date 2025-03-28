import { useState, useEffect, useCallback, useMemo } from 'react';
import { AssignmentWithCourse, Course, AssignmentStatus, AssignmentType } from '../types/canvas';
import { useAuth } from '../contexts/AuthContext';

interface FilterOptions {
  courseIds?: number[];
  types?: AssignmentType[];
  statuses?: AssignmentStatus[];
  search?: string;
}

interface AssignmentData {
  allAssignments: AssignmentWithCourse[];
  filteredAssignments: AssignmentWithCourse[];
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  applyFilters: (options: FilterOptions) => void;
  refresh: () => Promise<void>;
}

export const useAssignments = (): AssignmentData => {
  const { assignmentService, isAuthenticated } = useAuth();
  
  const [allAssignments, setAllAssignments] = useState<AssignmentWithCourse[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering state
  const [filters, setFilters] = useState<FilterOptions>({
    courseIds: [],
    types: [],
    statuses: [],
    search: ''
  });

  // Fetch assignments and courses
  const fetchData = useCallback(async () => {
    if (!assignmentService || !isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch courses from the canvasApi via assignmentService
      const coursesData = await assignmentService.canvasApi.getActiveCourses();
      setCourses(coursesData);
      
      // Then fetch assignments using the correct method name
      const assignmentsData = await assignmentService.getAllIncompleteAssignments();
      setAllAssignments(assignmentsData);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to fetch assignments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [assignmentService, isAuthenticated]);

  // Initial data load
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Apply filters function
  const applyFilters = useCallback((options: FilterOptions) => {
    setFilters(prev => ({
      ...prev,
      ...options
    }));
  }, []);

  // Compute filtered assignments
  const filteredAssignments = useMemo(() => {
    return allAssignments.filter(assignment => {
      // Filter by course
      if (filters.courseIds && filters.courseIds.length > 0) {
        if (!filters.courseIds.includes(assignment.course_id)) {
          return false;
        }
      }
      
      // Filter by assignment type
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(assignment.type)) {
          return false;
        }
      }
      
      // Filter by status
      if (filters.statuses && filters.statuses.length > 0) {
        if (!filters.statuses.includes(assignment.status)) {
          return false;
        }
      }
      
      // Filter by search term
      if (filters.search && filters.search.trim().length > 0) {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = assignment.name.toLowerCase().includes(searchTerm);
        const courseMatch = assignment.course_name.toLowerCase().includes(searchTerm);
        if (!titleMatch && !courseMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [allAssignments, filters]);

  // Refresh data
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    allAssignments,
    filteredAssignments,
    courses,
    isLoading,
    error,
    applyFilters,
    refresh
  };
};

export default useAssignments; 