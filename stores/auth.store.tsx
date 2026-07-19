/**
 * Auth context provider – centralised auth state for the app.
 * Replaces the scattered localStorage + useState pattern from the web frontend.
 */

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import type { UserDto } from './types';

/* ───── State ───── */

interface AuthState {
  currentUser: UserDto | null;
  userRole: 'guest' | 'user' | 'admin';
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  userRole: 'guest',
  isLoading: true,
  isAuthenticated: false,
};

/* ───── Actions ───── */

type AuthAction =
  | { type: 'SET_USER'; payload: UserDto }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER': {
      const user = action.payload;
      const role =
        user.role === 'admin' || user.role === 'system_manager' ? 'admin' : 'user';
      return {
        ...state,
        currentUser: user,
        userRole: role,
        isAuthenticated: true,
        isLoading: false,
      };
    }
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

/* ───── Context ───── */

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    role?: 'student' | 'expert',
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ───── Provider ───── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Bootstrap – check if user is already logged in
  useEffect(() => {
    (async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const response = await AuthService.login(identifier, password);
    dispatch({ type: 'SET_USER', payload: response.user });
  }, []);

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      role: 'student' | 'expert' = 'student',
    ) => {
      const response = await AuthService.register(fullName, email, password, role);
      dispatch({ type: 'SET_USER', payload: response.user });
    },
    [],
  );

  const logout = useCallback(async () => {
    await AuthService.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      dispatch({ type: 'SET_USER', payload: user });
    }
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ───── Hook ───── */

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
