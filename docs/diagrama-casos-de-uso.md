# Diagrama de Casos de Uso

## Actores

| Actor            | Descripción                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| **Usuario**      | Miembro de la universidad (estudiante, docente, personal) que reporta incidentes |
| **Administrador** | Encargado de gestionar el sistema, asignar responsables y supervisar      |
| **Responsable**  | Persona designada para atender y resolver un incidente                    |

## Diagrama
```mermaid
flowchart LR
    %% Definición de Actores (Círculos)
    Usuario((Usuario))
    Administrador((Administrador))
    Responsable((Responsable))

    %% Definición de Casos de Uso (Píldoras)
    UC01([Reportar Incidente])
    UC02([Ver Mis Reportes])
    UC03([Ver Detalle de Incidente])
    UC04([Listar Todos los Incidentes])
    UC05([Asignar Responsable])
    UC06([Actualizar Estado])
    UC07([Filtrar Incidentes])
    UC08([Ver Dashboard])
    UC09([Gestionar Usuarios])

    %% Relaciones Usuario
    Usuario --> UC01
    Usuario --> UC02
    Usuario --> UC03

    %% Relaciones Administrador
    Administrador --> UC03
    Administrador --> UC04
    Administrador --> UC05
    Administrador --> UC07
    Administrador --> UC08
    Administrador --> UC09

    %% Relaciones Responsable
    Responsable --> UC03
    Responsable --> UC06
```
```

```

```mermaid
usecaseDiagram
    actor Usuario as "Usuario"
    actor Administrador as "Administrador"
    actor Responsable as "Responsable"

    usercase UC01 as "Reportar Incidente"
    usercase UC02 as "Ver Mis Reportes"
    usercase UC03 as "Ver Detalle de Incidente"
    usercase UC04 as "Listar Todos los Incidentes"
    usercase UC05 as "Asignar Responsable"
    usercase UC06 as "Actualizar Estado"
    usercase UC07 as "Filtrar Incidentes"
    usercase UC08 as "Ver Dashboard"
    usercase UC09 as "Gestionar Usuarios"

    Usuario --> UC01
    Usuario --> UC02
    Usuario --> UC03

    Administrador --> UC03
    Administrador --> UC04
    Administrador --> UC05
    Administrador --> UC07
    Administrador --> UC08
    Administrador --> UC09

    Responsable --> UC03
    Responsable --> UC06
```

## Matriz Actor – Caso de Uso

| Caso de Uso               | Usuario | Administrador | Responsable |
| ------------------------- | :-----: | :-----------: | :---------: |
| Reportar Incidente        | ✓       |               |             |
| Ver Mis Reportes          | ✓       |               |             |
| Ver Detalle de Incidente  | ✓       | ✓             | ✓           |
| Listar Todos los Incidentes |        | ✓             |             |
| Asignar Responsable       |         | ✓             |             |
| Actualizar Estado         |         |               | ✓           |
| Filtrar Incidentes        |         | ✓             |             |
| Ver Dashboard             |         | ✓             |             |
| Gestionar Usuarios        |         | ✓             |             |
