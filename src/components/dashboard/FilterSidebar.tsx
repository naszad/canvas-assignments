import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material';
import { AssignmentStatus, AssignmentType, Course } from '../../types/canvas';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

interface FilterSidebarProps {
  courses: Course[];
  selectedCourses: number[];
  selectedTypes: AssignmentType[];
  selectedStatuses: AssignmentStatus[];
  searchTerm: string;
  onCourseFilterChange: (courseIds: number[]) => void;
  onTypeFilterChange: (types: AssignmentType[]) => void;
  onStatusFilterChange: (statuses: AssignmentStatus[]) => void;
  onSearchChange: (term: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  courses,
  selectedCourses,
  selectedTypes,
  selectedStatuses,
  searchTerm,
  onCourseFilterChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchChange
}) => {
  const [expanded, setExpanded] = useState<string | false>('courses');

  // Handle accordion change
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Handle course checkbox change
  const handleCourseChange = (courseId: number) => {
    const newSelectedCourses = selectedCourses.includes(courseId)
      ? selectedCourses.filter(id => id !== courseId)
      : [...selectedCourses, courseId];
    
    onCourseFilterChange(newSelectedCourses);
  };

  // Handle type checkbox change
  const handleTypeChange = (type: AssignmentType) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    onTypeFilterChange(newSelectedTypes);
  };

  // Handle status checkbox change
  const handleStatusChange = (status: AssignmentStatus) => {
    const newSelectedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    onStatusFilterChange(newSelectedStatuses);
  };

  // Handle search input change
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    onSearchChange('');
  };

  // Clear all filters
  const handleClearFilters = () => {
    onCourseFilterChange([]);
    onTypeFilterChange([]);
    onStatusFilterChange([]);
    onSearchChange('');
  };

  // Count total active filters
  const totalActiveFilters = selectedCourses.length + selectedTypes.length + selectedStatuses.length + (searchTerm ? 1 : 0);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" component="h2" display="flex" alignItems="center">
          <FilterListIcon sx={{ mr: 1 }} />
          Filters
          {totalActiveFilters > 0 && (
            <Chip 
              size="small" 
              label={totalActiveFilters} 
              color="primary" 
              sx={{ ml: 1 }} 
            />
          )}
        </Typography>
        {totalActiveFilters > 0 && (
          <Button 
            variant="text" 
            size="small" 
            onClick={handleClearFilters}
            color="primary"
          >
            Clear all
          </Button>
        )}
      </Box>
      
      <TextField
        label="Search assignments"
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={handleSearchInputChange}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="clear search"
                onClick={handleClearSearch}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {totalActiveFilters > 0 && (
        <Box my={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedCourses.map((courseId) => {
              const course = courses.find(c => c.id === courseId);
              return course && (
                <Chip
                  key={`course-${courseId}`}
                  label={course.name}
                  size="small"
                  onDelete={() => handleCourseChange(courseId)}
                  sx={{ mb: 1 }}
                />
              );
            })}
            {selectedTypes.map((type) => (
              <Chip
                key={`type-${type}`}
                label={type}
                size="small"
                onDelete={() => handleTypeChange(type)}
                sx={{ mb: 1 }}
              />
            ))}
            {selectedStatuses.map((status) => (
              <Chip
                key={`status-${status}`}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                size="small"
                onDelete={() => handleStatusChange(status)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}
      
      <Accordion 
        expanded={expanded === 'courses'} 
        onChange={handleAccordionChange('courses')}
        disableGutters
        elevation={0}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          '&:before': { display: 'none' },
          mb: 1
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Courses ({selectedCourses.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {courses.map((course) => (
              <FormControlLabel
                key={course.id}
                control={
                  <Checkbox
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseChange(course.id)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" noWrap title={course.name}>
                    {course.name}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expanded === 'types'} 
        onChange={handleAccordionChange('types')}
        disableGutters
        elevation={0}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          '&:before': { display: 'none' },
          mb: 1
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Assignment Types ({selectedTypes.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {Object.values(AssignmentType).map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    size="small"
                  />
                }
                label={type}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expanded === 'statuses'} 
        onChange={handleAccordionChange('statuses')}
        disableGutters
        elevation={0}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Status ({selectedStatuses.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {Object.values(AssignmentStatus).map((status) => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    checked={selectedStatuses.includes(status)}
                    onChange={() => handleStatusChange(status)}
                    size="small"
                  />
                }
                label={status.charAt(0).toUpperCase() + status.slice(1)}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSidebar; 