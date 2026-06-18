# Documentación: Sistema de Roles y Autorización (P2.2)

Este documento detalla la estructura, funcionamiento y uso del sistema de roles y autorización basado en roles del backend.

## 1. Modelo de Datos y Roles Disponibles

Los roles están definidos dinámicamente en la base de datos y se gestionan a través de una relación de muchos a muchos (`UserRole`) entre los usuarios y los roles.

Según el script de seeding, existen tres roles por defecto en el sistema:
1. **`admin`**: Administrador del sistema. Tiene acceso total.
2. **`responder`**: Responsable de atender e interactuar con los incidentes.
3. **`user`**: Usuario regular que reporta incidentes en el campus.

En el código TypeScript del backend, estos roles se representan mediante el enum `Role` en [roles.decorator.ts](file:///home/david/Documents/hackaton/hackaton/apps/backend/src/roles/roles.decorator.ts):
```typescript
export enum Role {
  ADMIN = "admin",
  RESPONDER = "responder",
  USER = "user",
}
```

---

## 2. Decorador de Roles (`@Roles`)

Para marcar qué rutas requieren permisos específicos, se debe usar el decorador `@Roles(...)` importado de `@roles/roles.decorator`.

### Ejemplo de Uso:
```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // (Creado en P2.1)
import { RolesGuard } from '../roles/roles.guard';
import { Roles, Role } from '../roles/roles.decorator';

@Controller('admin-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard) // El JwtAuthGuard DEBE ir antes para poblar req.user
@Roles(Role.ADMIN) // Solo usuarios con rol 'admin' pueden acceder a esta clase/ruta
export class AdminController {
  
  @Post('users')
  @Roles(Role.ADMIN) // Opcional si ya se declaró en la clase
  createFakeUser() {
    return 'Usuario creado';
  }
}
```

---

## 3. RolesGuard (`roles.guard.ts`)

El `RolesGuard` intercepta las peticiones HTTP y verifica si el usuario autenticado posee al menos uno de los roles requeridos para el endpoint.

### Características clave de la implementación:
- **Prioridad de Ejecución**: Requiere que la petición haya pasado por un guard de autenticación previo (ej. `JwtAuthGuard`) que popule el objeto `request.user`.
- **Protección contra Fallos**: Si por error se usa el guard sin autenticación previa (donde `req.user` es `undefined`), el guard deniega el acceso de forma segura en lugar de provocar un error de ejecución de TypeScript/NodeJS.
- **Flexibilidad de Formato**: El guard es compatible con los siguientes formatos en el objeto `request.user.roles`:
  - Array de strings (`['admin', 'responder']`) provenientes del token JWT.
  - Relaciones directas de Prisma (`[{ role: { name: 'admin' } }]` o `{ name: 'admin' }`) si el usuario fue consultado de la base de datos con relaciones.

---

## 4. RolesService (`roles.service.ts`)

El `RolesService` encapsula toda la interacción directa de base de datos con Prisma respecto a roles. Ofrece los siguientes métodos de negocio:

- **`findAll()`**: Retorna la lista completa de roles del sistema.
- **`findByName(name: string)`**: Busca un rol por su nombre único (ej. `admin`).
- **`assignRoleToUser(userId: string, roleId: string)`**: Asigna un rol específico a un usuario mediante la tabla puente `UserRole`.
- **`removeRoleFromUser(userId: string, roleId: string)`**: Desasigna un rol a un usuario usando la clave compuesta.
- **`checkUserRole(userId: string, roleName: string)`**: Comprueba de manera rápida en base de datos si el usuario tiene un rol determinado.
