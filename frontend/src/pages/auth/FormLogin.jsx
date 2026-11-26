import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import SiteNavbar from '../../components/SiteNavbar';
import { AUTH_MENU_ITEMS } from '../../config/navigation';
import useAuth from '../../hooks/useAuth';
import { getApiError } from '../../utils/apiError';

const loginSchema = z.object({
  email: z.email({ message: 'Ingresa un email válido.' }),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

const FormLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (credentials) => {
    setApiError('');
    try {
      await login(credentials);
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (error) {
      setApiError(getApiError(error, 'No se pudo iniciar sesión.'));
    }
  };

  return (
    <>
      <SiteNavbar items={AUTH_MENU_ITEMS} />
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md items-center px-4 py-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h1 className="mb-1 text-2xl font-bold text-slate-900">Iniciar sesión</h1>
          <p className="mb-6 text-sm text-slate-500">Ingresa con tu cuenta de MiniAula.</p>

          <Alert>{apiError}</Alert>
          <FormInput
            label="Email"
            id="txtEmail"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <FormInput
            label="Contraseña"
            id="txtPassword"
            type="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
          <p className="mt-4 text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-indigo-700 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </main>
    </>
  );
};

export default FormLogin;
