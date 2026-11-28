import { Link } from 'react-router';

const NIVEL_STYLES = {
  principiante: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  intermedio: 'border-amber-200 bg-amber-50 text-amber-700',
  avanzado: 'border-rose-200 bg-rose-50 text-rose-700',
};

const CourseCard = ({ curso }) => (
  <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    {/* Imagen por defecto mientras el curso no tenga portada propia. */}
    <div className="flex h-28 items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500">
      <span className="px-4 text-center text-xs font-semibold uppercase tracking-widest text-white/90">
        {curso.categoria}
      </span>
    </div>

    <div className="flex flex-1 flex-col gap-3 p-5">
      <h2 className="text-lg font-semibold text-slate-900">{curso.titulo}</h2>
      <p className="text-sm text-slate-600">
        {curso.instructor?.nombre ?? 'Instructor'} · {curso.totalLecciones ?? 0} lecciones
      </p>

      <div className="mt-auto flex items-center justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            NIVEL_STYLES[curso.nivel] ?? 'border-slate-200 bg-slate-100 text-slate-700'
          }`}
        >
          {curso.nivel}
        </span>
        <Link
          to={`/cursos/${curso.id}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Ver curso
        </Link>
      </div>
    </div>
  </article>
);

export default CourseCard;
