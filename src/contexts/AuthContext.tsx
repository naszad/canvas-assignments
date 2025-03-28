import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CanvasApi from '../api/canvasApi';
import AssignmentService from '../api/assignmentService';
import { User } from '../types/canvas';

interface AuthContextType {
  token: string | null;
  user: User | null;
  canvasApi: CanvasApi | null;
  assignmentService: AssignmentService | null;
  baseURL: string;
  setBaseURL: (url: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('canvas_token');
  });
  const [baseURL, setBaseURLState] = useState<string>(() => {
    return localStorage.getItem('canvas_baseURL') || 'https://canvas.instructure.com/api/v1';
  });
  const [user, setUser] = useState<User | null>(null);
  const [canvasApi, setCanvasApi] = useState<CanvasApi | null>(null);
  const [assignmentService, setAssignmentService] = useState<AssignmentService | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setToken = (newToken: string) => {
    localStorage.setItem('canvas_token', newToken);
    setTokenState(newToken);
    
    if (canvasApi) {
      canvasApi.updateToken(newToken);
    } else {
      const api = new CanvasApi({ baseURL, token: newToken });
      setCanvasApi(api);
      setAssignmentService(new AssignmentService(api));
    }
  };

  const setBaseURL = (url: string) => {
    localStorage.setItem('canvas_baseURL', url);
    setBaseURLState(url);
  };

  const logout = () => {
    localStorage.removeItem('canvas_token');
    setTokenState(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      const api = new CanvasApi({ baseURL, token });
      setCanvasApi(api);
      setAssignmentService(new AssignmentService(api));
      
      setIsLoading(true);
      setError(null);
      
      // Fetch user profile to validate token
      api.getUserProfile()
        .then(userData => {
          setUser(userData);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error authenticating with Canvas:', err);
          setError('Failed to authenticate with Canvas. Please check your token and try again.');
          logout();
          setIsLoading(false);
        });
    }
  }, [token, baseURL]);

  const value = {
    token,
    user,
    canvasApi,
    assignmentService,
    baseURL,
    setBaseURL,
    setToken,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 