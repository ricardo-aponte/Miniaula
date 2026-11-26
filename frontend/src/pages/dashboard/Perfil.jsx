import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { getCurrentUser } from '../../services/AuthService';
import { getApiError } from '../../utils/apiError';

const profileSchema = z
  .object({
    nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    email: z.email({ message: 'Ingresa un email válido.' }),
    password: z.string().optional(),
  })
  .refine((data) => !data.password || data.password.length >= 8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
    path: ['password'],
  });

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const [apiError, setApiError] = useState('');
  const [saved, setSaved] = useState(false);
  const fetchProfile = useCallback(() => getCurrentUser(), []);
  const { data: perfil, loading, error, isEmpty, refetch } = useFetch(fetchProfile, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre ?? '',
      email: user?.email ?? '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setApiError('');
    setSaved(false);
    const changes = values.password ? values : { nombre: values.nombre, email: values.email };
    try {
      await updateUser(changes);
      setSaved(true);
      refetch();
    } catch (updateError) {
      setApiError(getApiError(updateError, 'No se pudo actualizar el perfil.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Mi perfil</h1>

        {loading && <p className="text-sm text-slate-500">Cargando perfil…</p>}
        {error && <Alert>{getApiError(error, 'No se pudo cargar el perfil.')}</Alert>}
        {isEmpty && <Alert type="info">No hay datos de perfil disponibles.</Alert>}

        {perfil && (
          <>
            <p className="mb-6 text-sm text-slate-600">
              Miembro desde {new Date(perfil.creadoEn).toLocaleDateString()}
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Alert>{apiError}</Alert>
              <Alert type="success">{saved && 'Perfil actualizado correctamente.'}</Alert>
              <FormInput
                label="Nombre"
                id="profileNombre"
                error={errors.nombre?.message}
                {...register('nombre')}
              />
              <FormInput
                label="Email"
                id="profileEmail"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <FormInput
                label="Nueva contraseña (opcional)"
                id="profilePassword"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default Perfil;
