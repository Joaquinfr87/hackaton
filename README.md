# 🚨 Sistema de Gestión de Emergencias Universitarias

Este proyecto es una plataforma centralizada para el reporte, asignación y seguimiento de incidentes de emergencia (incendios, cortes de energía, accidentes, inundaciones, problemas de seguridad) dentro de un campus universitario.

El proyecto está estructurado como un **Monorepo** usando **Turborepo** y **pnpm** para gestionar de forma eficiente la aplicación frontend, backend y los paquetes compartidos.

---

## 👥 Integrantes del Equipo

*   **Frontend:** Nicolas y Jhoan
*   **Backend:** Joaquin y David

---

## 🛠️ Stack Tecnológico

### Monorepo y Utilidades
*   **Gestor de Monorepo:** [Turborepo](https://turbo.build/)
*   **Gestor de Paquetes:** [pnpm](https://pnpm.io/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Formatters & Linters:** [Prettier](https://prettier.io/) y [ESLint](https://eslint.org/)

### Backend (`apps/backend`)
*   **Framework:** [NestJS](https://nestjs.com/) (arquitectura modular con inyección de dependencias)
*   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/) (tipado estricto y migraciones automatizadas)
*   **Validación:** [Zod](https://zod.dev/)

### Frontend (`apps/frontend`)
*   **Framework:** [React](https://react.dev/) + [Vite](https://vite.dev/)
*   **Estilos y UI:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **Gestión de Estado Asíncrono:** [TanStack Query (React Query)](https://tanstack.com/query/latest) (con estrategias de *polling* para actualizaciones en tiempo real)
*   **Formularios:** [React Hook Form](https://react-hook-form.com/) + validación con [Zod](https://zod.dev/)

### Compartido (`packages/shared`)
*   Esquemas de validación comunes y tipados compartidos entre el Frontend y el Backend (por ejemplo, validaciones de creación/actualización de incidentes y catálogos de tipos/estados/severidades).

---

## 📁 Estructura del Proyecto

```text
├── apps/
│   ├── backend/           # API RESTful desarrollada con NestJS y Prisma
│   └── frontend/          # Panel administrativo de usuario desarrollado en React + Vite + Tailwind
├── packages/
│   ├── shared/            # Modelos, tipos y esquemas de Zod compartidos
│   ├── eslint-config/     # Configuraciones globales de ESLint
│   └── typescript-config/ # Configuraciones globales de tsconfig.json
├── docs/                  # Documentación del proyecto (requisitos, DB, diagramas, etc.)
├── docker-compose.yml     # Contenedores para PostgreSQL y herramientas de administración (Adminer)
└── turbo.json             # Configuración de Turborepo para pipelines de compilación y caché
```

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (Versión `>= 18`)
*   [pnpm](https://pnpm.io/installation) (Versión `>= 9.0.0`)
*   [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

---

### 1. Clonar el repositorio e Instalar Dependencias

```sh
# Instalar todas las dependencias del monorepo
pnpm install
```

### 2. Configurar la Base de Datos

Levanta la base de datos PostgreSQL y la herramienta Adminer usando Docker Compose:

```sh
# Levantar base de datos y adminer en segundo plano
pnpm db:up
```

*   **PostgreSQL:** Corriendo en `localhost:5432`
*   **Adminer (Gestor Web de DB):** Corriendo en `http://localhost:8080` (conéctate usando el host `postgres`, usuario `hackaton`, contraseña `hackaton` y base de datos `hackaton`).

### 3. Configurar Variables de Entorno

#### Backend (`apps/backend/.env`)
Crea el archivo `.env` basado en el archivo `.env.example`:
```env
DATABASE_URL="postgresql://hackaton:hackaton@localhost:5432/hackaton?schema=public"
JWT_ACCESS_SECRET="clave_secreta_para_desarrollo_acceso"
JWT_REFRESH_SECRET="clave_secreta_para_desarrollo_refresco"
PORT=3000
```

#### Frontend (`apps/frontend/.env`)
Asegúrate de que apunte a la URL de tu API del backend:
```env
VITE_API_URL="http://localhost:3000"
```

### 4. Ejecutar Migraciones y Semilla (Seed) de la Base de Datos

Ejecuta las migraciones de Prisma para crear las tablas necesarias e inicializar la base de datos con los roles, áreas de campus e incidentes base:

```sh
# Ejecutar migraciones
pnpm db:migrate

# (Opcional) Abrir Prisma Studio para ver los datos en el navegador
pnpm db:studio
```

### 5. Iniciar en Modo Desarrollo

Para compilar y arrancar tanto el backend como el frontend de forma simultánea con recarga en caliente (Hot Reload):

```sh
pnpm dev
```

*   **Frontend:** Disponible en `http://localhost:5173` (o el puerto indicado en la terminal)
*   **Backend API:** Disponible en `http://localhost:3000`

---

## ⚙️ Comandos de Script Principales

Ejecuta estos comandos desde la raíz del monorepo:

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia todas las aplicaciones (`frontend`, `backend` y `shared`) en modo desarrollo. |
| `pnpm build` | Compila todos los proyectos del monorepo en el orden correcto usando Turborepo. |
| `pnpm lint` | Analiza el código buscando problemas de calidad con ESLint. |
| `pnpm format` | Aplica formato al código automáticamente con Prettier. |
| `pnpm db:up` | Levanta los contenedores de PostgreSQL y Adminer. |
| `pnpm db:down` | Detiene y remueve los contenedores de base de datos. |
| `pnpm db:migrate`| Ejecuta las migraciones de base de datos pendientes mediante Prisma. |
| `pnpm db:studio` | Lanza el visualizador interactivo de base de datos de Prisma Studio. |

---

## 📄 Documentación Adicional
En la carpeta [docs/](file:///home/joaquin/repos/hackaton/docs) encontrarás información detallada del diseño del sistema:
*   [Contexto y Problemática](file:///home/joaquin/repos/hackaton/docs/contexto-problema.md): Situación inicial, equipo y tecnologías.
*   [Requisitos del Sistema](file:///home/joaquin/repos/hackaton/docs/requisitos.md): Detalle de Requisitos Funcionales, No Funcionales y Reglas de Negocio.
*   [Modelo de Base de Datos](file:///home/joaquin/repos/hackaton/docs/modelo-base-datos.md): Esquema de datos y relaciones.
*   [Planificación del Proyecto](file:///home/joaquin/repos/hackaton/docs/planificacion.md): Fases de desarrollo e hitos.
*   [Roles y Autorización](file:///home/joaquin/repos/hackaton/docs/roles-autorizacion.md): Matriz de permisos por tipo de usuario.
