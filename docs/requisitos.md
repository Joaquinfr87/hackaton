# Requisitos del Sistema de Gestión de Emergencias Universitarias

## 1. Requisitos Funcionales

### Módulo de Incidentes

| ID     | Nombre                     | Descripción                                                                 | Prioridad |
| ------ | -------------------------- | --------------------------------------------------------------------------- | --------- |
| RF-001 | Reportar Incidente         | El usuario debe poder reportar un incidente especificando tipo, severidad, ubicación y descripción | Alta |
| RF-002 | Ver Detalle de Incidente   | El usuario debe poder ver la información completa de un incidente           | Alta |
| RF-003 | Listar Incidentes          | El administrador debe poder listar todos los incidentes con paginación      | Alta |
| RF-004 | Filtrar Incidentes         | El sistema debe permitir filtrar incidentes por tipo, estado, severidad y fecha | Media |
| RF-005 | Actualizar Estado          | El responsable debe poder cambiar el estado de un incidente (reportado → asignado → en_progreso → resuelto → cerrado) | Alta |
| RF-006 | Asignar Responsable        | El administrador debe poder asignar un responsable a un incidente           | Alta |

### Módulo de Usuarios

| ID     | Nombre                     | Descripción                                                                 | Prioridad |
| ------ | -------------------------- | --------------------------------------------------------------------------- | --------- |
| RF-007 | Gestionar Usuarios         | El administrador debe poder crear, editar y desactivar usuarios             | Media |
| RF-008 | Autenticación              | Los usuarios deben poder iniciar sesión en el sistema                       | Alta |

### Módulo de Seguimiento

| ID     | Nombre                     | Descripción                                                                 | Prioridad |
| ------ | -------------------------- | --------------------------------------------------------------------------- | --------- |
| RF-009 | Historial de Cambios       | El sistema debe registrar cada cambio de estado y responsable del incidente | Media |
| RF-010 | Dashboard de Estadísticas  | El administrador debe ver un resumen con incidentes por estado, tipo y severidad | Media |

---

## 2. Requisitos No Funcionales

| ID      | Categoría         | Descripción                                                                 |
| ------- | ----------------- | --------------------------------------------------------------------------- |
| RNF-001 | Rendimiento       | El sistema debe actualizar la vista de incidentes cada 10 segundos (polling) para simular tiempo real |
| RNF-002 | Usabilidad        | La interfaz debe ser responsive y accesible desde dispositivos móviles      |
| RNF-003 | Disponibilidad    | El sistema debe estar disponible al menos el 99% del tiempo en horario universitario |
| RNF-004 | Seguridad         | Solo usuarios autenticados pueden acceder al sistema                        |
| RNF-005 | Seguridad         | Los roles deben restringir el acceso a funcionalidades específicas          |
| RNF-006 | Integridad        | Los datos de incidentes no deben perderse ante fallos del sistema           |
| RNF-007 | Mantenibilidad    | El código debe seguir una arquitectura modular (NestJS) y estar tipado (TypeScript) |
| RNF-008 | Escalabilidad     | La API debe poder escalar horizontalmente ante aumento de reportes          |

---

## 3. Reglas de Negocio

| ID     | Regla                                                                           |
| ------ | ------------------------------------------------------------------------------- |
| RN-001 | Un incidente solo puede ser cerrado si su estado actual es "resuelto"           |
| RN-002 | Solo un administrador puede asignar responsables a un incidente                 |
| RN-003 | El tipo de incidente debe ser uno de: incendio, corte_energía, accidente, inundación, seguridad, otro |
| RN-004 | La severidad debe ser: baja, media, alta, crítica                               |
| RN-005 | El flujo de estados debe seguir: reportado → asignado → en_progreso → resuelto → cerrado |
