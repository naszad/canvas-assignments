import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import AssignmentsList from '../components/dashboard/AssignmentsList';
import FilterSidebar from '../components/dashboard/FilterSidebar';
import { useAssignments } from '../hooks/useAssignments';
import { AssignmentStatus, AssignmentType } from '../types/canvas';

const DashboardPage: React.FC = () => {
  const { 
    filteredAssignments, 
    courses, 
    isLoading, 
    error, 
    refresh,
    applyFilters 
  } = useAssignments();

  // Filter states
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<AssignmentType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AssignmentStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Apply filters when they change
  useEffect(() => {
    applyFilters({
      courseIds: selectedCourses.length > 0 ? selectedCourses : undefined,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      search: searchTerm || undefined
    });
  }, [selectedCourses, selectedTypes, selectedStatuses, searchTerm, applyFilters]);

  const handleCourseFilterChange = (courseIds: number[]) => {
    setSelectedCourses(courseIds);
  };

  const handleTypeFilterChange = (types: AssignmentType[]) => {
    setSelectedTypes(types);
  };

  const handleStatusFilterChange = (statuses: AssignmentStatus[]) => {
    setSelectedStatuses(statuses);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleRefresh = () => {
    refresh();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid sx={{ gridColumn: 'span 3' }}>
          <Paper sx={{ p: 2 }}>
            <FilterSidebar
              courses={courses}
              selectedCourses={selectedCourses}
              selectedTypes={selectedTypes}
              selectedStatuses={selectedStatuses}
              onCourseFilterChange={handleCourseFilterChange}
              onTypeFilterChange={handleTypeFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              onSearchChange={handleSearchChange}
              searchTerm={searchTerm}
            />
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: 'span 9' }}>
          <AssignmentsList
            assignments={filteredAssignments}
            isLoading={isLoading}
            error={error}
            onRefresh={handleRefresh}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 