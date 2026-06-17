# Modelo de Base de Datos

## Diagrama Entidad-Relación

```mermaid
erDiagram
    User ||--o{ UserRole : "tiene"
    Role ||--o{ UserRole : "asignado a"
    User ||--o{ Incident : "reporta"
    User ||--o{ Incident : "asignado a"
    User ||--o{ AuditLog : "realiza"
    User ||--o{ RefreshToken : "posee"
    Incident ||--o{ AuditLog : "registra cambios en"
    CampusArea ||--o{ Incident : "contiene"

    User {
        uuid id PK
        varchar name "nombre completo"
        varchar email "correo electrónico"
        varchar password_hash "hash de contraseña"
        varchar phone "teléfono"
        bool is_active "cuenta activa"
        datetime created_at
        datetime updated_at
    }

    Role {
        uuid id PK
        varchar name "nombre del rol"
        varchar description "descripción"
        datetime created_at
    }

    UserRole {
        uuid user_id FK "usuario"
        uuid role_id FK "rol"
    }

    Incident {
        uuid id PK
        varchar title "título del incidente"
        text description "descripción detallada"
        varchar type "fire | power_outage | accident | flood | security | other"
        varchar severity "low | medium | high | critical"
        varchar status "reported | assigned | in_progress | resolved | closed"
        varchar location "ubicación en el campus"
        uuid reported_by_id FK "usuario que reporta"
        uuid assigned_to_id FK "responsable asignado (nullable)"
        uuid area_id FK "área del campus (nullable)"
        datetime created_at
        datetime updated_at
    }

    CampusArea {
        uuid id PK
        varchar name "nombre del área"
        text description "descripción"
        varchar location "ubicación"
        datetime created_at
    }

    AuditLog {
        uuid id PK
        uuid incident_id FK "incidente asociado"
        uuid user_id FK "usuario que realizó la acción"
        varchar action "acción realizada"
        varchar old_status "estado anterior (nullable)"
        varchar new_status "nuevo estado (nullable)"
        text comment "comentario opcional"
        datetime created_at
    }

    RefreshToken {
        uuid id PK
        uuid user_id FK "usuario propietario"
        text token "token JWT"
        datetime expires_at "fecha de expiración"
        datetime created_at
    }
```

## Diccionario de Datos

### Tabla: `users`

| Columna        | Tipo         | Restricciones            | Descripción                          |
| -------------- | ------------ | ------------------------ | ------------------------------------ |
| id             | `uuid`       | PK, DEFAULT gen_random_uuid() | Identificador único              |
| name           | `varchar`    | NOT NULL                 | Nombre completo del usuario          |
| email          | `varchar`    | NOT NULL, UNIQUE         | Correo electrónico institucional     |
| password_hash  | `varchar`    | NOT NULL                 | Hash de contraseña (bcrypt)          |
| phone          | `varchar`    | NULLABLE                 | Teléfono de contacto                 |
| is_active      | `boolean`    | NOT NULL, DEFAULT true   | Indica si la cuenta está activa      |
| created_at     | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha de creación                    |
| updated_at     | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha de última modificación         |

### Tabla: `roles`

| Columna    | Tipo         | Restricciones            | Descripción                    |
| ---------- | ------------ | ------------------------ | ------------------------------ |
| id         | `uuid`       | PK, DEFAULT gen_random_uuid() | Identificador único        |
| name       | `varchar`    | NOT NULL, UNIQUE         | Nombre del rol (admin, responder, user) |
| description| `text`       | NULLABLE                 | Descripción del rol           |
| created_at | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha de creación              |

### Tabla: `user_roles`

| Columna  | Tipo    | Restricciones                               | Descripción        |
| -------- | ------- | ------------------------------------------- | ------------------ |
| user_id  | `uuid`  | PK, FK -> users.id, ON DELETE CASCADE       | Usuario            |
| role_id  | `uuid`  | PK, FK -> roles.id, ON DELETE CASCADE       | Rol asignado       |

### Tabla: `campus_areas`

| Columna    | Tipo         | Restricciones            | Descripción                    |
| ---------- | ------------ | ------------------------ | ------------------------------ |
| id         | `uuid`       | PK, DEFAULT gen_random_uuid() | Identificador único        |
| name       | `varchar`    | NOT NULL, UNIQUE         | Nombre del área o edificio     |
| description| `text`       | NULLABLE                 | Descripción opcional           |
| location   | `varchar`    | NULLABLE                 | Coordenadas o referencia       |
| created_at | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha de registro              |

### Tabla: `incidents`

| Columna        | Tipo         | Restricciones            | Descripción                          |
| -------------- | ------------ | ------------------------ | ------------------------------------ |
| id             | `uuid`       | PK, DEFAULT gen_random_uuid() | Identificador único              |
| title          | `varchar`    | NOT NULL                 | Título corto del incidente           |
| description    | `text`       | NOT NULL                 | Descripción detallada                |
| type           | `varchar`    | NOT NULL                 | Tipo de emergencia                   |
| severity       | `varchar`    | NOT NULL                 | Nivel de gravedad                    |
| status         | `varchar`    | NOT NULL, DEFAULT 'reported' | Estado actual del incidente      |
| location       | `varchar`    | NOT NULL                 | Ubicación dentro del campus          |
| reported_by_id | `uuid`       | FK -> users.id, NOT NULL | Usuario que reportó                  |
| assigned_to_id | `uuid`       | FK -> users.id, NULLABLE | Responsable asignado                 |
| area_id        | `uuid`       | FK -> campus_areas.id, NULLABLE | Área del campus               |
| created_at     | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha del reporte                    |
| updated_at     | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha de última actualización        |

### Tabla: `audit_logs`

| Columna     | Tipo         | Restricciones            | Descripción                          |
| ----------- | ------------ | ------------------------ | ------------------------------------ |
| id          | `uuid`       | PK, DEFAULT gen_random_uuid() | Identificador único              |
| incident_id | `uuid`       | FK -> incidents.id, NOT NULL | Incidente asociado                |
| user_id     | `uuid`       | FK -> users.id, NOT NULL | Usuario que realizó la acción        |
| action      | `varchar`    | NOT NULL                 | Acción: created, assigned, status_changed, comment_added, etc. |
| old_status  | `varchar`    | NULLABLE                 | Estado anterior                      |
| new_status  | `varchar`    | NULLABLE                 | Nuevo estado                         |
| comment     | `text`       | NULLABLE                 | Comentario opcional                  |
| created_at  | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha de la acción                   |

### Tabla: `refresh_tokens`

| Columna    | Tipo         | Restricciones            | Descripción                    |
| ---------- | ------------ | ------------------------ | ------------------------------ |
| id         | `uuid`       | PK, DEFAULT gen_random_uuid() | Identificador único        |
| user_id    | `uuid`       | FK -> users.id, ON DELETE CASCADE, NOT NULL | Usuario propietario |
| token      | `text`       | NOT NULL, UNIQUE         | Token JWT de refresco          |
| expires_at | `timestamptz`| NOT NULL                 | Fecha de expiración            |
| created_at | `timestamptz`| NOT NULL, DEFAULT now()  | Fecha de creación              |

## Índices

| Tabla              | Índice                              | Tipo    | Columnas                |
| ------------------ | ----------------------------------- | ------- | ----------------------- |
| incidents          | idx_incidents_status                | BTREE   | status                  |
| incidents          | idx_incidents_type                  | BTREE   | type                    |
| incidents          | idx_incidents_severity              | BTREE   | severity                |
| incidents          | idx_incidents_reported_by           | BTREE   | reported_by_id          |
| incidents          | idx_incidents_assigned_to           | BTREE   | assigned_to_id          |
| incidents          | idx_incidents_created_at            | BTREE   | created_at              |
| audit_logs         | idx_audit_logs_incident             | BTREE   | incident_id             |
| audit_logs         | idx_audit_logs_user                 | BTREE   | user_id                 |
| refresh_tokens     | idx_refresh_tokens_token            | UNIQUE  | token                   |
| refresh_tokens     | idx_refresh_tokens_user             | BTREE   | user_id                 |
| users              | idx_users_email                     | UNIQUE  | email                   |
| user_roles         | idx_user_roles_user                 | BTREE   | user_id                 |

## Iniciar la Base de Datos con Prisma + PostgreSQL

### 1. Levantar PostgreSQL con Docker

```bash
# Desde la raíz del proyecto
docker compose up -d postgres
```

Esto levanta un contenedor con PostgreSQL 16 en `localhost:5432`, con:
- Base de datos: `hackaton`
- Usuario: `hackaton`
- Contraseña: `hackaton`

### 2. Configurar la variable de entorno

Crear un archivo `.env` en `apps/backend/`:

```env
DATABASE_URL="postgresql://hackaton:hackaton@localhost:5432/hackaton"
```

### 3. Definir el esquema en Prisma

El archivo `apps/backend/prisma/schema.prisma` contiene la definición de todas las tablas. Ejemplo:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  phone        String?
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  roles        UserRole[]
  incidents    Incident[]      @relation("reportedBy")
  assignments  Incident[]      @relation("assignedTo")
  auditLogs    AuditLog[]
  refreshTokens RefreshToken[]

  @@map("users")
}

model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  users       UserRole[]

  @@map("roles")
}

model UserRole {
  userId String @map("user_id")
  roleId String @map("role_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role   @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@map("user_roles")
}

// ... resto de modelos
```

### 4. Generar el cliente de Prisma y ejecutar migraciones

```bash
# Generar el cliente Prisma basado en el schema
pnpm --filter @hackaton/backend prisma:generate

# Crear la primera migración y aplicarla a la base de datos
pnpm --filter @hackaton/backend prisma:migrate --name init

# (Opcional) Abrir Prisma Studio para explorar los datos
pnpm --filter @hackaton/backend prisma:studio
```

### 5. Sembrar datos iniciales (seed)

Crear `apps/backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear roles
  const admin = await prisma.role.create({ data: { name: "admin", description: "Administrador del sistema" } });
  const responder = await prisma.role.create({ data: { name: "responder", description: "Responsable de atender incidentes" } });
  const user = await prisma.role.create({ data: { name: "user", description: "Usuario regular que reporta incidentes" } });

  // Crear áreas del campus
  await prisma.campusArea.createMany({
    data: [
      { name: "Edificio A - Rectorado", description: "Edificio principal de administración" },
      { name: "Edificio B - Aulas", description: "Edificio de aulas y laboratorios" },
      { name: "Edificio C - Biblioteca", description: "Biblioteca central" },
      { name: "Polideportivo", description: "Complejo deportivo" },
      { name: "Estacionamiento", description: "Estacionamiento principal" },
    ],
  });

  // Crear admin por defecto
  const adminUser = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@universidad.edu",
      passwordHash: "$2b$10$...", // hash de "admin123"
      roles: { create: { roleId: admin.id } },
    },
  });

  console.log("Seed completado:", { adminUser });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

Agregar al `package.json` del backend:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Ejecutar el seed:

```bash
pnpm --filter @hackaton/backend prisma:migrate
```

### 6. Comandos rápidos (desde la raíz del monorepo)

```bash
pnpm db:up        # docker compose up -d postgres
pnpm db:generate  # prisma generate
pnpm db:migrate   # prisma migrate dev (con seed automático)
pnpm db:studio    # abrir Prisma Studio
```
