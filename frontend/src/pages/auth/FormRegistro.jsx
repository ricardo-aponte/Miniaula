import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import useAuth from '../../hooks/useAuth';
import { getApiError } from '../../utils/apiError';

const registerSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.email({ message: 'Ingresa un email válido.' }),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(72, 'La contraseña no puede superar 72 caracteres.'),
  rol: z.enum(['estudiante', 'instructor'], {
    message: 'Selecciona un rol válido.',
  }),
});

const FormRegistro = () => {
  const { register: registerSession } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { nombre: '', email: '', password: '', rol: 'estudiante' },
  });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await registerSession(data);
      navigate('/', { replace: true });
    } catch (error) {
      setApiError(getApiError(error, 'No se pudo registrar la cuenta.'));
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Crear cuenta</h1>
        <p className="mb-6 text-sm text-slate-500">Regístrate como estudiante o instructor.</p>

        <Alert>{apiError}</Alert>
        <FormInput
          label="Nombre"
          id="txtNombre"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          error={errors.nombre?.message}
          {...register('nombre')}
        />
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
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="mb-4">
          <label htmlFor="txtRol" className="mb-1 block text-sm font-medium text-slate-700">
            Rol
          </label>
          <select
            id="txtRol"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            {...register('rol')}
          >
            <option value="estudiante">Estudiante</option>
            <option value="instructor">Instructor</option>
          </select>
          {errors.rol && <p className="mt-1 text-xs text-red-600">{errors.rol.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando…' : 'Registrarse'}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-indigo-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
};

export default FormRegistro;
