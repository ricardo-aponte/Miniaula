import { buildPageList } from '../utils/pageList';

const BASE_BUTTON =
  'flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40';
const IDLE_BUTTON = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
const ACTIVE_BUTTON = 'bg-indigo-600 text-white';

// Paginación del servidor: los números salen de `pagination` (RT-B09).
const Pagination = ({ page, totalPages, hasPrevPage, hasNextPage, onChange }) => {
  if (!totalPages) {
    return null;
  }

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
      <button
        type="button"
        className={`${BASE_BUTTON} ${IDLE_BUTTON}`}
        onClick={() => onChange(page - 1)}
        disabled={!hasPrevPage}
        aria-label="Página anterior"
      >
        &larr;
      </button>

      {buildPageList(page, totalPages).map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${BASE_BUTTON} ${item === page ? ACTIVE_BUTTON : IDLE_BUTTON}`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className={`${BASE_BUTTON} ${IDLE_BUTTON}`}
        onClick={() => onChange(page + 1)}
        disabled={!hasNextPage}
        aria-label="Página siguiente"
      >
        &rarr;
      </button>
    </nav>
  );
};

export default Pagination;
