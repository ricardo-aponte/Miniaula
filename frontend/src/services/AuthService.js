import axiosClient from '../config/axiosClient';
import { clearSession } from './TokenService';

// Única capa que habla con los endpoints de autenticación y perfil.
// No persiste ni navega: eso es responsabilidad de AuthContext y del interceptor.

export const loginUser = async ({ email, password }) => {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data;
};

export const registerUser = async ({ nombre, email, password, rol }) => {
  const { data } = await axiosClient.post('/auth/register', { nombre, email, password, rol });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosClient.get('/users/me');
  return data.user;
};

export const updateProfile = async (changes) => {
  const { data } = await axiosClient.put('/users/me', changes);
  return data.user;
};

export const logoutUser = () => clearSession();
