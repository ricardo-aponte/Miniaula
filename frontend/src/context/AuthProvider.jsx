import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from '../services/AuthService';
import {
  SESSION_CLEARED_EVENT,
  getSession,
  setSession,
  setUser,
} from '../services/TokenService';

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession());

  const user = session?.user ?? null;
  const token = session?.token ?? null;

  const applyUser = useCallback((nextUser) => {
    setUser(nextUser);
    setSessionState((current) => (current ? { ...current, user: nextUser } : null));
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await loginUser(credentials);
      setSession(data);
      setSessionState({ token: data.token, user: data.user ?? null });
      return data.user;
    },
    []
  );

  const register = useCallback(
    async (data) => {
      const result = await registerUser(data);
      setSession(result);
      setSessionState({ token: result.token, user: result.user ?? null });
      return result.user;
    },
    []
  );

  const logout = useCallback(() => {
    logoutUser();
    setSessionState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const nextUser = await getCurrentUser();
    applyUser(nextUser);
    return nextUser;
  }, [applyUser]);

  const updateUser = useCallback(
    async (changes) => {
      const nextUser = await updateProfile(changes);
      applyUser(nextUser);
      return nextUser;
    },
    [applyUser]
  );

  useEffect(() => {
    const handleSessionCleared = () => setSessionState(null);
    window.addEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
    return () => window.removeEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: Boolean(token),
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshUser,
      updateUser,
      hasRole: (role) => user?.rol === role,
    }),
    [user, token, login, register, logout, refreshUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
