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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    
    if (result && result.success) {
      // Backend returns token in result.data.token
      const token = result.data?.token || result.token;
      const user = result.data?.user || result.user;
      
      console.log('Login successful, user data:', user);
      console.log('Token received:', token);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state immediately and return a promise that resolves when state is updated
      setUser(user);
      setIsAuthenticated(true);
      console.log('Authentication state updated:', { isAuthenticated: true, user });
      
      // Return a promise that resolves after state update
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(result);
        }, 100);
      });
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