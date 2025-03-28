import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { AssignmentWithCourse, AssignmentStatus, AssignmentType } from '../../types/canvas';
import { format, isPast } from 'date-fns';

interface AssignmentsListProps {
  assignments: AssignmentWithCourse[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

// Sort types
type SortDirection = 'asc' | 'desc';
type SortField = 'due_at' | 'course_name' | 'name' | 'type' | 'status';

const AssignmentsList: React.FC<AssignmentsListProps> = ({
  assignments,
  isLoading,
  error,
  onRefresh
}) => {
  // Sort state
  const [sortField, setSortField] = useState<SortField>('due_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Detail dialog state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithCourse | null>(null);

  // Handle sort change
  const handleSortChange = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  // Format date for display
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  // Sort assignments
  const sortedAssignments = React.useMemo(() => {
    if (!assignments) return [];
    
    return [...assignments].sort((a, b) => {
      const factor = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'due_at':
          if (!a.due_at && !b.due_at) return 0;
          if (!a.due_at) return factor;
          if (!b.due_at) return -factor;
          return factor * (new Date(a.due_at).getTime() - new Date(b.due_at).getTime());
          
        case 'course_name':
          return factor * a.course_name.localeCompare(b.course_name);
          
        case 'name':
          return factor * a.name.localeCompare(b.name);
          
        case 'type':
          return factor * a.type.localeCompare(b.type);
          
        case 'status':
          return factor * a.status.localeCompare(b.status);
          
        default:
          return 0;
      }
    });
  }, [assignments, sortField, sortDirection]);

  // Open assignment detail dialog
  const handleOpenDetail = (assignment: AssignmentWithCourse) => {
    setSelectedAssignment(assignment);
    setDetailOpen(true);
  };

  // Close assignment detail dialog
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedAssignment(null);
  };

  // Status chip color
  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case AssignmentStatus.Overdue:
        return 'error';
      case AssignmentStatus.Upcoming:
        return 'primary';
      case AssignmentStatus.Undated:
        return 'default';
      default:
        return 'default';
    }
  };

  // Assignment type chip color
  const getTypeColor = (type: AssignmentType) => {
    switch (type) {
      case AssignmentType.Quiz:
        return 'success';
      case AssignmentType.Discussion:
        return 'info';
      case AssignmentType.ExternalTool:
        return 'warning';
      case AssignmentType.Assignment:
      default:
        return 'default';
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={onRefresh}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  // Render empty state
  if (!assignments || assignments.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No incomplete assignments found
        </Typography>
        <Button onClick={onRefresh} sx={{ mt: 2 }}>
          Refresh
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="assignments table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'course_name'}
                  direction={sortDirection}
                  onClick={() => handleSortChange('course_name')}
                >
                  Course
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortDirection}
                  onClick={() => handleSortChange('name')}
                >
                  Assignment
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'due_at'}
                  direction={sortDirection}
                  onClick={() => handleSortChange('due_at')}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'type'}
                  direction={sortDirection}
                  onClick={() => handleSortChange('type')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'status'}
                  direction={sortDirection}
                  onClick={() => handleSortChange('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAssignments.map((assignment) => (
              <TableRow 
                key={`${assignment.course_id}-${assignment.id}`}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  bgcolor: assignment.status === AssignmentStatus.Overdue ? 'error.lighter' : 'inherit'
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" noWrap>
                    {assignment.course_name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {assignment.course_code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {assignment.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {assignment.points_possible} pts
                  </Typography>
                </TableCell>
                <TableCell>
                  {assignment.due_at ? (
                    <>
                      <Typography 
                        variant="body2" 
                        color={isPast(new Date(assignment.due_at)) ? 'error' : 'textPrimary'}
                      >
                        {formatDueDate(assignment.due_at)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No due date
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={assignment.type}
                    size="small"
                    color={getTypeColor(assignment.type)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    size="small"
                    color={getStatusColor(assignment.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDetail(assignment)}
                    aria-label="details"
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    component="a"
                    href={assignment.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="open in canvas"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assignment Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        aria-labelledby="assignment-detail-dialog-title"
        maxWidth="md"
        fullWidth
      >
        {selectedAssignment && (
          <>
            <DialogTitle id="assignment-detail-dialog-title">
              {selectedAssignment.name}
              <Typography variant="subtitle2" color="textSecondary">
                {selectedAssignment.course_name} ({selectedAssignment.course_code})
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Due Date
                </Typography>
                <Typography variant="body2">
                  {selectedAssignment.due_at 
                    ? formatDueDate(selectedAssignment.due_at)
                    : 'No due date'
                  }
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Type
                </Typography>
                <Chip 
                  label={selectedAssignment.type}
                  color={getTypeColor(selectedAssignment.type)}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Points
                </Typography>
                <Typography variant="body2">
                  {selectedAssignment.points_possible} points possible
                </Typography>
              </Box>

              {selectedAssignment.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Box 
                    className="assignment-description"
                    sx={{ 
                      maxHeight: '300px', 
                      overflow: 'auto', 
                      p: 2, 
                      bgcolor: 'background.default',
                      borderRadius: 1
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedAssignment.description }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetail}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                component="a"
                href={selectedAssignment.html_url}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
              >
                Open in Canvas
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AssignmentsList; 