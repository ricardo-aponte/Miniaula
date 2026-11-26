# Instrucciones para agentes — MiniAula Frontend

## Descripción

SPA de **MiniAula** en **React 19 + Vite 8 + JavaScript**, con **React Router**, **Context API**, **React Hook Form + Zod**, **Axios** y **Tailwind CSS v4**. Consume la API REST de `../api` (Express + PostgreSQL). El frontend vive hoy en `Miniaula/frontend/`; la entrega final pide que se llame `web/` (ver deuda técnica).

Roles: **estudiante** (catálogo, inscripción, lecciones, cuestionarios, progreso) e **instructor** (cursos, lecciones, preguntas, panel).

## Estado actual

### Implementado

| Archivo | Responsabilidad |
| --- | --- |
| `src/services/TokenService.js` | Único acceso a `localStorage`: token, usuario, sesión y evento `miniaula:session-cleared`. |
| `src/config/axiosClient.js` | Instancia Axios con `baseURL = VITE_API_URL`, header `Authorization` y cierre de sesión ante 401. |
| `src/config/axiosUsuario.js` | Re-export de `axiosClient` por compatibilidad. No crear otra instancia. |
| `src/services/AuthService.js` | `loginUser`, `registerUser`, `getCurrentUser`, `updateProfile`, `logoutUser`. Sin axios directo ni navegación. |
| `src/context/authContext.js` | Definición del contexto (archivo separado para cumplir `react-refresh/only-export-components`). |
| `src/context/AuthProvider.jsx` | Estado de sesión en memoria + persistencia; expone login/registro/logout/refresh/actualización de perfil. |
| `src/hooks/useAuth.jsx` | Consume el contexto; aliases `isLoggedIn`, `isAuthenticated`, `logoutClick`. |
| `src/hooks/useFetch.jsx` | Carga/error/lista vacía/refetch para datos remotos. |
| `src/routes/AuthenticatedRoute.jsx` | Protege por sesión y, con `roles={[...]}`, por rol. |
| `src/routes/HomeRoute.jsx` | En `/`: `HomePage` para visitantes y `Dashboard` para usuarios con sesión. |
| `src/routes/RouterConfig.jsx` | `/login`, `/register`, `/` (HomeRoute), `/perfil` y redirección `*`. |
| `src/pages/HomePage.jsx` | Portada pública: navbar de inicio + mensaje de bienvenida y acceso a la plataforma. |
| `src/pages/auth/*`, `src/pages/dashboard/Perfil.jsx` | Formularios con validación Zod y errores de la API. `FormLogin` incluye el navbar de acceso; `Perfil` no se modifica. |
| `src/config/navigation.js` | `SITE_TITLE` y menús `HOME_MENU_ITEMS` / `AUTH_MENU_ITEMS` (rutas relativas, sin host ni puerto). |
| `src/components/SiteNavbar.jsx` | Navbar reutilizable con título, ítems y submenús plegables; escritorio y móvil. |
| `src/components/*` | `Navbar` (panel/perfil), `SiteNavbar`, `FormInput`, `Button`, `Alert`, `ScreenPage` (paginador). |

### Navbars públicos

- **Inicio** (`/`, visitantes): título a la izquierda; a la derecha `Conociendo la página`, `Investigación ▾` (`Centro de Investigación`, `Investigación Estudiantil`) y `Más ▾` (`Apoyo Docente`, `Plataforma Virtual`). `Plataforma Virtual` usa `<Link to="/login">` (en dev resuelve a `http://localhost:5173/login`); no escribir el host en el código.
- **Acceso** (`/login`, y mismo patrón si se reutiliza en `/register`): título; a la derecha `Presencial`, `Semipresencial` y `Acceso ▾` (`Apoyo Docente`, `Unirse`). Debajo se mantiene el formulario de login sin cambios; la ventana `Perfil` tampoco se modifica.
- Los submenús se abren con `useState` (`openSubmenu`) y se cierran al navegar; en móvil hay un botón hamburguesa con el mismo menú (responsive desde 375 px).
- Alineación: por defecto el panel cae a la izquierda del ítem (`left-0`). Los ítems del extremo derecho (`Más` y `Acceso`) declaran `align: 'right'` en `src/config/navigation.js` y usan `right-0` para desplegarse hacia adentro y no salirse del borde.
- `Navbar.jsx` original sigue siendo el del panel y `Perfil`; no mezclar sus ítems con los menús públicos.

### Contrato de autenticación de la API

Prefijo: `VITE_API_URL` debe terminar en `/api` (ej. `http://localhost:3000/api`).

| Método | Ruta | Respuesta |
| --- | --- | --- |
| POST | `/auth/login` | `200` → `{ user, token }` |
| POST | `/auth/register` | `201` → `{ user, token }` |
| GET | `/users/me` | `200` → `{ user }` |
| PUT | `/users/me` | `200` → `{ user }` |

`user = { id, nombre, email, rol, creadoEn }` con `rol: 'estudiante' | 'instructor'`. La API **nunca** devuelve `passwordHash` ni `indiceCorrecto`.

Errores (todos): `{ error: { code, message, details } }`. Extraer el mensaje con `getApiError(error)` de `src/utils/apiError.js`; no leer `error.response` directamente en componentes.

Códigos relevantes: `400` validación, `401` credenciales/token, `403` sin permiso o lección bloqueada, `404`, `409` email/inscripción duplicados, `422` regla de negocio, `500`.

## Flujo de autenticación (no modificar el orden de responsabilidades)

```
Componente (FormLogin/FormRegistro)
  → useAuth() → AuthProvider
    → AuthService → axiosClient → API /api/auth/* o /api/users/me
      → TokenService (persistencia)
```

- **TokenService** guarda `miniaula.token` y `miniaula.user` (JSON). Acepta la clave legacy `token` para no cerrar sesiones antiguas. `clearSession()` emite `miniaula:session-cleared`.
- **axiosClient** adjunta `Bearer <token>` si hay sesión. Ante `401` llama a `clearSession()` y navega a `/login` mediante `navigationRef`. `AuthProvider` escucha el evento y deja `isLoggedIn` en `false`.
- **AuthService** es puro: no escribe en `localStorage` ni navega. Persistir es trabajo de `AuthProvider`.
- **AuthProvider** se monta en `src/main.jsx` dentro de `BrowserRouter`. Hidrata la sesión desde `localStorage` con un inicializador lazy, así que sobrevive recargas (RT-F02).
- **AuthenticatedRoute** redirige a `/login` con `state.from` para volver al destino original; si recibe `roles`, verifica `user.rol`.

## Convenciones obligatorias

- Seguir la capa **componente → hook/contexto → servicio → axiosClient**. Ningún componente usa `fetch`/`axios` directamente (RT-F03).
- Toda entrada de usuario se valida con **Zod** en el formulario y se muestra tanto el error local como el de la API (RT-F05). Usar `z.email()` (Zod 4), no `z.string().email()`.
- Funciones cortas y con una sola responsabilidad; sin lógica duplicada. Extraer helpers a `src/utils/`.
- Usar `req` equivalente del frontend: los datos remotos pasan por `useFetch` y toda vista muestra **carga, error y lista vacía** (RT-F06).
- Estilos **solo con clases de Tailwind** de forma consistente, responsive desde 375 px (RT-F07). Tailwind se registra en `vite.config.js` y se importa en `src/index.css`.
- La URL de la API **solo** en `VITE_API_URL` (RT-F08). Nunca escribir `localhost:3000` en el código. Copiar `.env.example` a `.env` para desarrollar; `.env` está ignorado por Git.
- No agregar dependencias ni cambiar el gestor de paquetes sin una razón ligada al cambio. El repo usa `yarn.lock` y los scripts se llaman con `npm`/`yarn` según disponibilidad.
- No commitear secretos. `.env` y `.env.*` están en `.gitignore` (excepto `.env.example`).
- Evitar nombres de archivo que difieran solo en mayúsculas: en Windows `AuthContext.jsx` y `authContext.js` colisionan y el resolver puede elegir el equivocado. Por eso el componente se llama `AuthProvider.jsx`.

## Comandos

Desde `Miniaula/frontend/`:

- `yarn install` (o `npm install`): instalar dependencias.
- `yarn dev` / `npm run dev`: servidor Vite con HMR.
- `yarn build` / `npm run build`: compilación de producción en `dist/`.
- `yarn lint` / `npm run lint`: ESLint. Debe pasar sin errores antes de commitear.
- `yarn preview` / `npm run preview`: servir `dist/` localmente.

La API debe estar levantada aparte (`../api` con `pnpm start`) y el health check es `http://localhost:3000/api/health`.

## Cómo verificar un cambio de auth

1. `npm run lint && npm run build`.
2. Con la API corriendo, iniciar `npm run dev`.
3. Sin sesión, abrir `/`: debe verse la HomePage con el título y los menús `Conociendo la página`, `Investigación ▾` y `Más ▾`; desplegar `Más` y confirmar que `Plataforma Virtual` lleva a `/login`.
4. En `/login` debe aparecer el navbar de acceso (`Presencial`, `Semipresencial`, `Acceso ▾` con `Apoyo Docente` y `Unirse`) y debajo el formulario de login sin cambios.
5. Registrar un usuario de prueba con `POST /api/auth/register` o usar `ana@miniaula.com` / `Demo1234`.
6. Iniciar sesión, recargar la página (la sesión debe persistir), abrir `/perfil`, actualizar el nombre y cerrar sesión. El panel (`Dashboard`) y `Perfil` conservan su navbar original.
7. Verificar que una respuesta 401 (por ejemplo, un token vencido) limpia la sesión y vuelve a `/login`.

## Deuda técnica / pendiente

- Faltan las pantallas de catálogo, detalle de curso, lección, cuestionario, mis cursos y las vistas del instructor (editor de curso/lecciones/preguntas y panel). `Dashboard.jsx` tiene enlaces todavía sin ruta.
- Las entradas `Conociendo la página`, `Centro de Investigación`, `Investigación Estudiantil`, `Apoyo Docente`, `Presencial` y `Semipresencial` de `src/config/navigation.js` son temporales y apuntan a `/` hasta que existan sus vistas.
- Falta el `Dockerfile` multi-etapa con Nginx (RT-F09) y el `docker-compose.yml` raíz de tres servicios; hoy la API y la BD se levantan por separado.
- El directorio se llama `frontend/`; la entrega pide `web/`.
- No hay tests automatizados.
- `App.jsx`/`App.css` y los assets de la plantilla Vite quedaron sin uso; no eliminar sin revisar con el equipo.
- El `README.md` sigue siendo el de la plantilla; debe documentarse al finalizar la entrega.

## Flujo Git

Desde la raíz `Miniaula/`: `git status` → `git pull origin main` → `git add -A` → `git commit -m "..."` → `git push origin main`. La entrega final es el tag `v1.0.0`.
