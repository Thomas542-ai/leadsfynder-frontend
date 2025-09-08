import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run this effect once on mount
    if (isInitialized) return;
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    console.log('useAuth useEffect - token:', token ? 'exists' : 'missing', 'userData:', userData ? 'exists' : 'missing');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('useAuth useEffect - setting authenticated user:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('useAuth useEffect - error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('useAuth useEffect - no token or user data, setting unauthenticated');
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
    setIsInitialized(true);
  }, [isInitialized]); // Only run when isInitialized changes

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    
    if (result && result.success) {
      // Backend returns token in result.data.token
      const token = result.data?.token || result.token;
      const user = result.data?.user || result.user;
      
      console.log('Login successful, user data:', user);
      console.log('Token received:', token);
      
      // Store in localStorage first
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state immediately
      setUser(user);
      setIsAuthenticated(true);
      console.log('Authentication state updated immediately:', { isAuthenticated: true, user });
      
      return result;
    }
    
    return result;
  };

  const register = async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    company: string;
    phone?: string;
  }) => {
    const result = await authService.register(userData);
    return result;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Logout error handled silently
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
}