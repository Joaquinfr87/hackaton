# Sistema de Gestión de Emergencias Universitarias

## contexto

La universidad ha detectado que durante situaciones de emergencia (incendios, cortes de energía, accidentes, inundaciones o problemas de seguridad) no existe una herramienta centralizada para reportar incidentes y coordinar la atención.

La institución necesita una primera versión funcional de un sistema que permita registrar incidentes, asignar responsables y realizar seguimiento hasta su resolución.

## mienbros 

- frontend: Nicolas y Jhoan
- backend: Joaquin y David

## tecnologias
 
### El Backend (La API RESTful)

Framework: NestJS. Al estar escrito en TypeScript, te ofrece una arquitectura modular e inyección de dependencias que facilita mucho escalar el sistema más adelante. Es perfecto para construir APIs robustas y separadas.

Base de Datos: PostgreSQL. Ideal para mantener la integridad relacional entre usuarios, incidentes, áreas del campus y responsables.

ORM: Prisma. Te dará un tipado estricto desde la base de datos hasta los controladores de NestJS. Además, sus migraciones son muy fáciles de manejar desde la terminal.

Validación de entrada: Zod. Puedes compartir los esquemas de Zod entre tu frontend y tu backend (usando un monorepo o paquetes compartidos) para asegurar que el payload de una emergencia siempre tenga la estructura correcta.

### El Frontend (La Interfaz de Usuario)

Core: React + Vite. Vite te dará tiempos de compilación instantáneos, ideal para un desarrollo ágil.

Gestión de estado asíncrono: TanStack Query. Esencial para este proyecto. Te permitirá hacer polling (consultas periódicas) para que el panel de administración vea las nuevas emergencias en tiempo real, además de manejar el caché y los estados de carga sin esfuerzo.

Estilos y UI: Tailwind CSS + shadcn/ui. Te permitirá construir un panel administrativo limpio y profesional muy rápido. Al integrar formularios, puedes aprovechar directamente componentes como el Field nativo que ya incluye shadcn para conectar tus inputs de manera fluida.

Formularios: React Hook Form + Zod. La combinación ganadora para que los reportes de incidentes se validen en el cliente de forma estricta antes de tocar el servidor (ej. asegurar que se envíe la ubicación exacta y el tipo de emergencia).

### Infraestructura y Entorno

Docker y Docker Compose: Perfectos para tu entorno de desarrollo. Puedes armar un docker-compose.yml que levante un contenedor con PostgreSQL y otro con tu backend en NestJS. Esto mantiene tu entorno Linux limpio y asegura que la aplicación funcione exactamente igual cuando la lleves a producción.
