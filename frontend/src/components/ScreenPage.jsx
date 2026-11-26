import { useNavigate, useSearchParams } from 'react-router';

// Paginador genérico: cada pantalla define { page, path }.
const ScreenPager = ({ screens = [], page = 1 }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const goToScreen = (screen) => {
    if (!screen) {
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set('page', String(screen.page));
    setSearchParams(params);
    navigate(`${screen.path}?page=${screen.page}`);
  };

  return (
    <nav className="mt-4 flex items-center justify-center gap-4" aria-label="Páginas">
      <button
        type="button"
        className="cursor-pointer rounded-full bg-slate-200 px-4 py-2 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => goToScreen(screens.find((screen) => screen.page === page - 1))}
        disabled={page <= 1}
      >
        &larr;
      </button>
      <span className="text-sm font-medium text-slate-700">{page}</span>
      <button
        type="button"
        className="cursor-pointer rounded-full bg-slate-200 px-4 py-2 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => goToScreen(screens.find((screen) => screen.page === page + 1))}
        disabled={!screens.some((screen) => screen.page === page + 1)}
      >
        &rarr;
      </button>
    </nav>
  );
};

export default ScreenPager;
