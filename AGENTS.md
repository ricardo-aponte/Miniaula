# Instrucciones para agentes — MiniAula API

## Descripción del proyecto

API REST de una plataforma de cursos cortos ("MiniAula"). Backend en **Node.js 20+ con Express 5**, **Sequelize 6 sobre PostgreSQL 16**, autenticación **JWT**, validación con **Zod** y contraseñas con **bcrypt**.

Hay dos roles:

- **Instructor**: crea cursos con lecciones de contenido y cuestionarios, los publica, los archiva y consulta el panel de avance de sus estudiantes.
- **Estudiante**: explora el catálogo de cursos publicados, se inscribe, avanza lección por lección, rinde cuestionarios y consulta su propio progreso.

El reto central es el **avance secuencial**: una lección solo se desbloquea cuando la anterior está completada (y, si la anterior es un cuestionario, cuando está aprobado), y los cuestionarios se califican en el servidor **sin exponer nunca las respuestas correctas**.

El código de la API usa **ES modules** (`"type": "module"` en `api/package.json`), salvo las migraciones y los seeders de Sequelize CLI, que son **CommonJS** (ver más abajo).

## Repositorio y carpetas

- `Miniaula/` (raíz): `docker-compose.yml` con el servicio `db` (PostgreSQL 16, volumen `postgres_data`, healthcheck `pg_isready`), `.env` con variables de Docker y `AGENTS.md`.
- `Miniaula/api/`: aplicación Node con `src/`, `postman/`, `package.json`, `.env`, `.env.example` y `Dockerfile` (sin uso por ahora).

## Estado actual del dominio

### Implementado

| Módulo | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| Usuarios | `GET /api/users/me`, `PUT /api/users/me` |
| Catálogo | `GET /api/cursos?q=&categoria=&page=&limit=`, `GET /api/cursos/categorias`, `GET /api/cursos/:id` |
| Cursos (instructor) | `POST /api/cursos`, `PUT /api/cursos/:id`, `DELETE /api/cursos/:id`, `PATCH /api/cursos/:id/estado` |
| Panel instructor | `GET /api/instructor/cursos`, `GET /api/instructor/cursos/:id`, `GET /api/instructor/cursos/:id/resumen` |
| Lecciones | `POST /api/cursos/:id/lecciones`, `PUT /api/lecciones/:id`, `DELETE /api/lecciones/:id`, `PATCH /api/cursos/:id/lecciones/orden` |
| Preguntas | `POST /api/lecciones/:id/preguntas`, `PUT /api/preguntas/:id`, `DELETE /api/preguntas/:id` |
| Inscripciones | `POST /api/cursos/:id/inscripcion`, `GET /api/inscripciones/mias` |
| Progreso estudiante | `GET /api/lecciones/:id`, `POST /api/lecciones/:id/completar`, `POST /api/lecciones/:id/intentos`, `GET /api/cursos/:id/progreso` |

Estados de curso: `borrador` (todo curso nuevo), `publicado` (visible en el catálogo) y `archivado` (oculto, conserva inscripciones).

### Reglas de negocio implementadas

| Regla | Dónde se aplica |
| --- | --- |
| RN-01 avance secuencial | `src/utils/progress.js` (`buildLessonStates`) + `progreso.service.js` (403 `LESSON_LOCKED`) |
| RN-02 respuestas correctas nunca al cliente | `pregunta.model.js` (`defaultScope` excluye `indiceCorrecto`) + `src/utils/serializers.js` |
| RN-03 máximo 3 intentos y mejor nota | `progreso.service.js` (`MAX_INTENTOS_CUESTIONARIO`) |
| RN-04 inscripción única | constraint `uq_inscripcion_estudiante_curso` + `inscripcion.service.js` (409 `ALREADY_ENROLLED`) |
| RN-05 catálogo solo publicados / no publicar sin lecciones | `curso.repository.js` + `curso.service.js` (422 `COURSE_WITHOUT_LESSONS`) |
| RN-06 curso con inscritos no se elimina | `curso.service.js` (409 `COURSE_HAS_ENROLLMENTS`, sugerir archivar) |
| RN-07 solo el dueño modifica | `ownership.middleware.js` |
| RN-08 cada estudiante ve solo lo suyo | `enrollment.middleware.js` + `req.user.id` |

## Arquitectura y flujo de una solicitud

```
routes/ (define endpoint y compone middlewares)
  → validate.middleware.js (Zod: body/params/query)
  → auth.middleware.js (JWT + rol)
  → ownership.middleware.js / enrollment.middleware.js (autorización por recurso)
  → controllers/ (solo arma request/response)
  → services/ (reglas de negocio)
  → repositories/ (única capa que consulta modelos Sequelize)
  → db/models/ (modelos y asociaciones)
```

Los controladores **no** contienen lógica de negocio ni consultas: solo llaman al servicio y responden. Los errores de negocio se lanzan como `AppError` y se serializan en `errorHandler.middleware.js` con el formato único:

```json
{ "error": { "code": "CODIGO", "message": "Mensaje", "details": null } }
```

### Estructura de `api/src/`

```
app.js                 Configura helmet, cors, morgan, json, rutas, 404 y errorHandler
server.js              Conecta la BD y recién después escucha en el puerto
config/
  env.js               Variables de entorno con defaults
  database.js          Instancia Sequelize + connectDatabase()
  constants.js         Estados, niveles, tipos y máximo de intentos
  sequelize.config.cjs Config para Sequelize CLI (CommonJS)
controllers/           Una función por endpoint, sin lógica
services/              Reglas de negocio y orquestación de repositorios
repositories/          Consultas Sequelize (incluye resourceAuth.repository.js)
routes/                index.js monta auth, users, cursos, instructor, lecciones, preguntas, inscripciones
middlewares/           auth, validate, ownership, enrollment, rateLimit, errorHandler
validators/            Esquemas Zod por módulo + common.validator.js
db/models/             Usuario, Curso, Leccion, Pregunta, Inscripcion, Progreso, TokenRecuperacion y asociaciones
db/migrations/         Migraciones CommonJS de las 7 tablas
db/seeders/            Seeders CommonJS con datos demo
utils/                 jwt.js, pagination.js, progress.js, serializers.js, text.js
errors/AppError.js     Clase de error de aplicación
```

## Comandos de desarrollo

Requisitos: **Docker Desktop**, **Node.js 20+** y **pnpm 11** (el proyecto fija `pnpm@11.21.0`). Si pnpm no está disponible: `corepack enable` y `corepack prepare pnpm@11.21.0 --activate`.

### Orden de arranque recomendado

1. Abrir **Docker Desktop** y esperar a que el motor esté corriendo.
2. Desde la raíz `Miniaula/`: `docker compose up -d`.
3. Desde `Miniaula/api/`: `pnpm install`.
4. Desde `Miniaula/api/`: `pnpm db:migrate` (solo la primera vez o al agregar migraciones).
5. Desde `Miniaula/api/`: `pnpm db:seed` (solo la primera vez; carga los datos demo).
6. Desde `Miniaula/api/`: `pnpm start` (nodemon, recarga automática).
7. Verificar `http://localhost:3000/api/health`.

### Base de datos (desde la raíz `Miniaula/`)

- `docker compose up -d`: levanta PostgreSQL 16 en segundo plano. Usa el `.env` de la raíz (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`). En esta máquina `DB_PORT=5434` porque 5432 y 5433 ya están ocupados.
- `docker compose ps`: verifica que `miniaula_db` esté `healthy`.
- `docker compose logs -f db`: sigue los logs si la base no arranca.
- `docker compose down`: detiene y elimina el contenedor (los datos persisten en el volumen).
- `docker compose down -v`: **borra también los datos**. Usarlo solo para reiniciar la base desde cero; después hay que volver a migrar y sembrar.

### Dependencias, migraciones y API (desde `Miniaula/api/`)

- `pnpm install`: instala según `pnpm-lock.yaml`. `pnpm-workspace.yaml` habilita el build nativo de `bcrypt`.
- `pnpm db:migrate`: crea las tablas con `sequelize-cli` y `src/config/sequelize.config.cjs`. Es idempotente.
- `pnpm db:migrate:undo`: revierte **todas** las migraciones (borra las tablas). Solo desarrollo.
- `pnpm db:seed`: ejecuta los seeders de `src/db/seeders`.
- `pnpm db:seed:undo`: revierte todos los seeders.
- `pnpm start`: `nodemon src/server.js`. Recomendado en desarrollo; escribir `rs` en la terminal para reiniciar.
- `pnpm dev`: `node src/server.js`, sin recarga.
- Si aparece `EADDRINUSE`, ya hay un servidor en el puerto 3000: verificar con `netstat -ano | findstr :3000`.

Todos los comandos pnpm se ejecutan **dentro de `api/`**, porque `dotenv/config` carga el `.env` del directorio de trabajo actual.

## Usuarios de prueba (seeders)

Contraseña para todos: **`Demo1234`** (definida en el seeder, no en `.env`).

| Rol | Nombre | Email | Datos |
| --- | --- | --- | --- |
| Instructor | Ana Torres | `ana@miniaula.com` | dueña de los cursos 1 y 2 |
| Instructor | Carlos Ruiz | `carlos@miniaula.com` | dueño del curso 3 |
| Estudiante | Juan Pérez | `juan@miniaula.com` | inscripto en cursos 1 y 2, poca actividad |
| Estudiante | María López | `maria@miniaula.com` | inscripta en cursos 1 y 3; en el curso 1 completó las 4 lecciones de contenido (el cuestionario está desbloqueado) |
| Estudiante | Pedro Gómez | `pedro@miniaula.com` | inscripto en cursos 1 y 2 |

El seed crea **3 cursos publicados** (`Fundamentos de Desarrollo Web`, `Bases de Datos Relacionales`, `Diseño de Experiencia de Usuario`), cada uno con **5 lecciones** y **al menos un cuestionario**. Total: 15 lecciones y 7 preguntas.

Los seeders son tolerantes a bases con datos previos: los usuarios se buscan por email, los cursos por título y las lecciones/inscripciones por sus claves naturales, así que no dependen de IDs fijos y pueden volver a ejecutarse sin duplicar filas.

## Variables de entorno

Hay dos `.env` complementarios:

- **Raíz** (`Miniaula/.env`): configura Docker (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`).
- **`api/.env`**: configura la aplicación (`PORT`, `NODE_ENV`, `DB_*`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PASSWORD_RESET_TTL_MINUTES`, `CORS_ORIGIN`).

`DB_*` debe coincidir entre ambos. `DB_HOST` en la API es `localhost` porque el puerto está mapeado al host. Nunca se lee, imprime, copia ni commitea el contenido de un `.env`; usar `api/.env.example` como plantilla.

## ¿Para qué sirven `db/migrations/package.json` y `db/seeders/package.json`?

Ambos contienen únicamente:

```json
{ "type": "commonjs" }
```

La aplicación es ESM (`"type": "module"`), pero **Sequelize CLI carga las migraciones y seeders con `require`** y espera `module.exports`. Ese `package.json` anidado hace que Node trate solo los `.js` de esas carpetas como CommonJS, sin obligar a renombrarlos a `.cjs` ni a cambiar el resto del proyecto. **No los borres ni los cambies a `"module"`**: las migraciones y seeders dejarían de cargar.

## ¿Qué es `errors/AppError.js`?

Es la clase de error propia del proyecto (RT-B05). Recibe `(message, statusCode, code, details)`, marca `isOperational` y captura el stack. Los servicios lanzan `throw new AppError('...', 404, 'COURSE_NOT_FOUND')` y el `errorHandler` central lo convierte en la respuesta uniforme `{ error: { code, message, details } }`. Las respuestas exitosas nunca incluyen `passwordHash` ni `indiceCorrecto`.

## Documentación de la API (Postman)

Importar `api/postman/miniaula.postman_collection.json`. Variable `baseUrl = http://localhost:3000/api`. Orden sugerido:

1. `Auth → Login instructor` y `Login estudiante` (guardan `instructorToken` y `estudianteToken`).
2. `Cursos (catálogo público)`.
3. `Instructor` para crear/editar/publicar y cargar lecciones y preguntas.
4. `Estudiante` para inscribirse, ver lecciones, completar, rendir el cuestionario y consultar progreso.

Las requests de creación guardan `cursoId`, `leccionId`, `leccionCuestionarioId`, `leccionBloqueadaId` y `preguntaId` como variables de colección.

## Convenciones de código (obligatorias)

- Respetar la separación **ruta → middleware/validador → controlador → servicio → repositorio → modelo**.
- Validar **toda** entrada externa con Zod antes del controlador (`req.validated.body/params/query`). En controladores usar `req.validated`, no `req.query`/`req.params` crudos.
- Lanzar `AppError` para errores de negocio; no responder errores desde servicios ni controladores.
- Códigos HTTP: `200` consulta/actualización, `201` creación, `204` borrado, `400` validación/JSON inválido, `401` sin token o credenciales, `403` sin permiso o lección bloqueada, `404` inexistente, `409` conflicto (email, inscripción duplicada, curso con inscritos), `422` regla de negocio no procesable, `500` inesperado.
- Funciones cortas, una responsabilidad, sin lógica duplicada. Los helpers de avance viven en `utils/progress.js`; los de paginación en `utils/pagination.js`; los serializadores seguros en `utils/serializers.js`.
- Las respuestas de usuario se construyen con `toSafeUser`/`defaultScope`. Las preguntas al estudiante usan `toPreguntaPublica`.
- Los cambios de esquema se hacen con **migraciones nuevas**; nunca con `sequelize.sync({ force: true })` ni editando una migración ya aplicada. Actualizar el modelo y la migración correspondiente.
- Operaciones multi-fila (reordenar lecciones) usan transacción en el repositorio.
- No agregar dependencias ni cambiar el gestor de paquetes o el lockfile sin una razón ligada al cambio.

## Deuda técnica conocida

- Los defaults de puertos están desincronizados: `env.js` usa `5701`, `sequelize.config.cjs` usa `5501` y `.env.example`/`docker-compose.yml` usan `5432`. Con ambos `.env` creados no afecta, pero conviene unificarlo a `5434` en esta máquina.
- `CORS_ORIGIN` por defecto es `5701` en `env.js` y `5173` en `.env.example`.
- El `Dockerfile` de la API no está conectado a `docker-compose.yml` y no funciona con el estado actual (`npm ci` sin lockfile; `npm run db:migrate` depende de `pnpm`). La API se ejecuta con pnpm en local. Falta el frontend `web/` y el compose de tres servicios que pide la entrega final.
- El `README.md` de la raíz está vacío y todavía no hay Swagger: la documentación es la colección de Postman.
- No hay tests automatizados configurados.
- **Recuperación de contraseña sin envío de correo**: `POST /api/auth/forgot-password` genera el token y guarda solo su hash en `tokens_recuperacion`, pero no lo envía por email. En desarrollo lo devuelve en la respuesta (`resetToken`) para poder probar el flujo; en producción ese campo se omite y el flujo queda incompleto. Falta integrar un mailer (SMTP) y las pantallas de "olvidé mi contraseña" en `frontend/`.

## Solución de problemas

- **`Error al conectar con PostgreSQL` / `ECONNREFUSED`**: Docker Desktop apagado, contenedor caído o `DB_*` distinto entre los dos `.env`. Revisar `docker compose ps`, `docker compose logs -f db` y ambos `.env`.
- **`password authentication failed for user "postgres"`**: en esta máquina hay un PostgreSQL nativo en 5432 y otro servicio en 5433. MiniAula usa `DB_PORT=5434` en ambos `.env`; si cambia, hacerlo en los dos y recrear el compose.
- **`docker compose ps` se queda colgado**: Docker Desktop no terminó de arrancar. Abrirlo y esperar a que el motor esté activo.
- **Error de compilación de bcrypt**: `pnpm rebuild bcrypt` dentro de `api/`.
- **Sequelize CLI no encuentra la configuración**: usar los scripts `pnpm db:*`, que pasan `--config src/config/sequelize.config.cjs`, `--migrations-path src/db/migrations` y `--seeders-path src/db/seeders`.
- **`EADDRINUSE` / el servidor no obedece cambios**: cerrar el proceso anterior (`netstat -ano | findstr :3000`) y usar `pnpm start` (nodemon).
- **Postman da `Operation timed out`**: casi siempre es URL o proxy. En la colección `baseUrl = http://localhost:3000/api`; health es `{{baseUrl}}/health`. Revisar Settings → Proxy y probar con `127.0.0.1`.
- **Quiero reiniciar todo de cero**: `docker compose down -v` (raíz) → `docker compose up -d` → `pnpm db:migrate` → `pnpm db:seed` → `pnpm start`.


