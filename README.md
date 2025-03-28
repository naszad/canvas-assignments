# Canvas Assignments Dashboard - Streamline Your Course Assignment Management

The Canvas Assignments Dashboard is a web application that helps students efficiently manage and track their Canvas LMS assignments. It provides a centralized view of incomplete assignments across all courses with powerful filtering and sorting capabilities.

The application integrates with the Canvas LMS API through a secure proxy server to fetch and display assignment data. Users can view assignments by course, type, and status, with real-time filtering and sorting capabilities. The dashboard highlights overdue assignments and provides quick access to assignment details and direct links to Canvas.

Key features include:
- Unified view of assignments across all active courses
- Real-time filtering by course, assignment type, and status
- Smart sorting capabilities for due dates, courses, and assignment types
- Detailed assignment information with direct Canvas links
- Secure API integration through a proxy server
- Responsive Material UI design for desktop and mobile use

## Repository Structure
```
canvas-assignments/
├── server.js                 # Express proxy server for Canvas API integration
├── package.json             # Project dependencies and scripts
├── src/                     # React application source code
│   ├── api/                 # API integration layer
│   │   ├── assignmentService.ts  # Assignment data management
│   │   └── canvasApi.ts         # Canvas API client implementation
│   ├── components/          # React components
│   │   ├── common/          # Shared components (layouts, routes)
│   │   └── dashboard/       # Dashboard-specific components
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   └── types/              # TypeScript type definitions
└── public/                 # Static assets and HTML template
```

## Usage Instructions
### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Canvas LMS API access token
- Canvas LMS instance URL

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd canvas-assignments
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd canvas-assignments
npm install
```

3. Configure environment variables:
```bash
# Create .env file in root directory
echo "PORT=3001" > .env

# Create .env file in canvas-assignments directory
cd canvas-assignments
echo "REACT_APP_API_URL=http://localhost:3001" > .env
```

### Quick Start
1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`

3. Log in with your Canvas credentials

### More Detailed Examples
#### Filtering Assignments
```typescript
// Using the FilterSidebar component
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
```

#### Accessing Assignment Data
```typescript
// Using the useAssignments hook
const { 
  filteredAssignments, 
  courses, 
  isLoading, 
  error, 
  refresh,
  applyFilters 
} = useAssignments();
```

### Troubleshooting
#### Common Issues
1. API Connection Issues
   - Error: "No Canvas token provided"
   - Solution: Ensure you've properly configured your Canvas API token in the login process
   - Debug: Check browser console for detailed error messages

2. Assignment Loading Issues
   - Error: "Failed to fetch assignments"
   - Solution: Verify your Canvas instance URL and network connectivity
   - Debug: Enable verbose logging in the browser console

3. Authentication Issues
   - Error: "Unauthorized access"
   - Solution: Re-authenticate through the login page
   - Debug: Clear browser cookies and local storage

#### Performance Optimization
- Monitor network requests in the browser's developer tools
- Use the browser's performance profiler to identify bottlenecks
- Implement pagination for large assignment lists
- Cache frequently accessed data using the browser's local storage

## Data Flow
The application follows a unidirectional data flow pattern where Canvas API data is fetched through the proxy server and transformed into a normalized format for the frontend.

```ascii
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Canvas  │ -> │  Proxy   │ -> │  React   │ -> │   UI     │
│   API    │    │  Server  │    │  State   │    │ Components│
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

Component Interactions:
1. Proxy server authenticates and forwards requests to Canvas API
2. React components fetch data through custom hooks
3. Assignment data is normalized and cached in application state
4. UI components receive filtered and sorted assignment data
5. User interactions trigger state updates through context providers
6. Real-time filtering and sorting occur in memory
7. Changes in filter criteria trigger immediate UI updates