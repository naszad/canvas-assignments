import { format, formatDistance, isAfter, isBefore, parseISO } from 'date-fns';

// Format a date string to a readable format
export const formatDate = (dateString: string | null | undefined, formatString: string = 'MMM d, yyyy h:mm a'): string => {
  if (!dateString) return 'No due date';
  
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format due date with relative time
export const formatDueDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No due date';
  
  try {
    const dueDate = parseISO(dateString);
    const now = new Date();
    
    // If due date is in the past
    if (isBefore(dueDate, now)) {
      return `Overdue: Due ${formatDistance(dueDate, now, { addSuffix: true })}`;
    }
    
    // If due date is upcoming
    return `Due ${formatDistance(dueDate, now, { addSuffix: true })}`;
  } catch (error) {
    console.error('Error formatting due date:', error);
    return 'Invalid date';
  }
};

// Check if a date is past
export const isPastDue = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  
  try {
    const dueDate = parseISO(dateString);
    const now = new Date();
    return isBefore(dueDate, now);
  } catch (error) {
    console.error('Error checking if date is past due:', error);
    return false;
  }
};

// Sort dates (can handle null values)
export const sortDates = (dateA: string | null | undefined, dateB: string | null | undefined): number => {
  // Handle null dates (null dates come after valid dates in sorting)
  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;
  
  try {
    const dateObjectA = parseISO(dateA);
    const dateObjectB = parseISO(dateB);
    
    if (isAfter(dateObjectA, dateObjectB)) return 1;
    if (isBefore(dateObjectA, dateObjectB)) return -1;
    return 0;
  } catch (error) {
    console.error('Error sorting dates:', error);
    return 0;
  }
}; 