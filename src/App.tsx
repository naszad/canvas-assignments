import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';

// Create a custom theme (optional - can be expanded later)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#e91e63',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
      },
    },
  },
});

// Add custom CSS variable for the lighter error color
theme.components = {
  ...theme.components,
  MuiCssBaseline: {
    styleOverrides: {
      ':root': {
        '--error-lighter': 'rgba(211, 47, 47, 0.05)',
      },
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
            </Route>
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
