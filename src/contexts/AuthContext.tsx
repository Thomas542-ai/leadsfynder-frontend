import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider useEffect - checking localStorage on mount');
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    console.log('AuthProvider useEffect - token:', token ? 'exists' : 'missing', 'userData:', userData ? 'exists' : 'missing');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthProvider useEffect - setting authenticated user:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('AuthProvider useEffect - error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('AuthProvider useEffect - no token or user data, setting unauthenticated');
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://leadsfynder-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log('AuthProvider login - response:', result);

      if (result && result.success) {
        const token = result.data?.token || result.token;
        const userData = result.data?.user || result.user;
        
        console.log('AuthProvider login - storing token and user data');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        console.log('AuthProvider login - authentication state updated');
      }
      
      return result;
    } catch (error) {
      console.error('AuthProvider login - error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch('https://leadsfynder-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AuthProvider register - error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('https://leadsfynder-backend.onrender.com/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('AuthProvider logout - error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
