import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }

  // logoutClick se mantiene por compatibilidad con el patrón del proyecto base.
  return { ...context, logoutClick: context.logout };
};

export default useAuth;
