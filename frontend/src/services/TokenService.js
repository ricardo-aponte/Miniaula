// Persistencia de la sesión. Es la única capa que conoce localStorage.
// El evento permite que AuthContext reaccione si el interceptor 401 cierra la sesión.

const TOKEN_KEY = 'miniaula.token';
const USER_KEY = 'miniaula.user';
const LEGACY_TOKEN_KEY = 'token';

export const SESSION_CLEARED_EVENT = 'miniaula:session-cleared';

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function emitSessionCleared() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_CLEARED_EVENT));
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

export const getUser = () => readJSON(USER_KEY);

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getSession = () => {
  const token = getToken();
  return token ? { token, user: getUser() } : null;
};

export const setSession = ({ token, user }) => {
  if (!token) {
    return;
  }
  setToken(token);
  if (user) {
    setUser(user);
  }
};

export const clearSession = () => {
  removeToken();
  removeUser();
  emitSessionCleared();
};

export const hasSession = () => Boolean(getToken());
