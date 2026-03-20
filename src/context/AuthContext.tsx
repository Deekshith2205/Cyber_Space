/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ isWeakPassword: boolean }>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string, email: string, designation: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (response.data.status === 'success') {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error("Failed to restore session", error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.status === 'success') {
        const { token, user, isWeakPassword } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        // Do not redirect here if password is weak, or allow the component to handle it
        router.push('/dashboard');
        return { isWeakPassword: !!isWeakPassword };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      if (response.data.status === 'success') {
        router.push('/login');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const updateProfile = async (name: string, email: string, designation: string) => {
    try {
      const response = await axios.put('http://localhost:5000/api/user/update', 
        { name, email, designation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === 'success') {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Update failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
