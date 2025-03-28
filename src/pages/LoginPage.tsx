import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { setToken, setBaseURL, baseURL, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [token, setTokenValue] = useState('');
  const [customBaseURL, setCustomBaseURL] = useState(baseURL);
  const [showURLField, setShowURLField] = useState(false);

  // Add useEffect to redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToken(token);
    if (showURLField && customBaseURL) {
      setBaseURL(customBaseURL);
    }
    // Authentication will be handled by the AuthContext
    // Navigation will happen via the useEffect above when isAuthenticated changes
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Canvas Assignments Dashboard
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Sign in with your Canvas API token to view your incomplete assignments
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Canvas API Token"
              fullWidth
              margin="normal"
              variant="outlined"
              value={token}
              onChange={(e) => setTokenValue(e.target.value)}
              required
              type="password"
              helperText="Enter your personal access token from Canvas"
            />

            <Box sx={{ mt: 1, mb: 2 }}>
              <Link 
                component="button"
                type="button"
                variant="body2"
                onClick={() => setShowURLField(!showURLField)}
              >
                {showURLField ? 'Use default Canvas URL' : 'Use custom Canvas URL'}
              </Link>
            </Box>

            {showURLField && (
              <TextField
                label="Canvas API Base URL"
                fullWidth
                margin="normal"
                variant="outlined"
                value={customBaseURL}
                onChange={(e) => setCustomBaseURL(e.target.value)}
                helperText="Only change if you use a custom Canvas instance"
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !token}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }} component="div">
            How to get your Canvas API token:
            <ol>
              <li>Log in to your Canvas account</li>
              <li>Go to Account → Settings</li>
              <li>Scroll to Approved Integrations section</li>
              <li>Click "New Access Token"</li>
              <li>Give it a purpose (e.g., "Assignments Dashboard")</li>
              <li>Copy the token and paste it here</li>
            </ol>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 