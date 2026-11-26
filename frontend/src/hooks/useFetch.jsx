import { useCallback, useEffect, useState } from 'react';

const initialState = (key) => ({ key, data: null, loading: true, error: null });

// Hook genérico para vistas con datos remotos: carga, error, lista vacía y refetch.
// `fetcher` debe ser estable (useCallback) o incluirse en `deps`.
export function useFetch(fetcher, deps = []) {
  const [request, setRequest] = useState(() => initialState(null));
  const [reloadCount, setReloadCount] = useState(0);

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);
  const key = JSON.stringify([...deps, reloadCount]);
  const state = request.key === key ? request : initialState(key);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(fetcher)
      .then((data) => {
        if (active) {
          setRequest({ key, data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (active) {
          setRequest({ key, data: null, loading: false, error });
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const isEmpty =
    !state.loading &&
    !state.error &&
    (state.data == null ||
      (Array.isArray(state.data) && state.data.length === 0));

  return { data: state.data, loading: state.loading, error: state.error, isEmpty, refetch };
}

export default useFetch;
