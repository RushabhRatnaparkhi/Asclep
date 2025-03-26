'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    router.push('/');
    router.refresh(); // Force a refresh of the navigation
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
    router.refresh(); // Force a refresh of the navigation
  };

  return { isAuthenticated, isLoading, login, logout };
} 