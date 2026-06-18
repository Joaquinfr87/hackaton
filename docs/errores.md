# Errores y Soluciones

## Error 1: Clases `border-border`, `bg-background`, `text-foreground` no existen (Tailwind v3 + shadcn/ui v2)

**Errores:**
```
[plugin:vite:css] [postcss] src/index.css: The `border-border` class does not exist.
[plugin:vite:css] [postcss] src/index.css: The `bg-background` class does not exist.
[plugin:vite:css] [postcss] src/index.css: The `text-foreground` class does not exist.
```

**Causa:**
shadcn/ui v2 (estilo `base-nova`) generó código asumiendo **Tailwind CSS v4**, pero el proyecto tenía **Tailwind CSS v3**. Diferencias clave:

| Feature | Tailwind v3 | Tailwind v4 |
|---|---|---|
| Configuración | `tailwind.config.js` | CSS (`@theme`, `@import`) |
| Directivas | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Utilidades desde CSS vars | No genera `border-border` desde `var(--border)` automáticamente | Sí, nativo |
| `@apply` con vars | Solo funciona si la utilidad existe en `content` | Funciona siempre |
| Plugins | PostCSS + `tailwindcss` + `autoprefixer` | Plugin Vite (`@tailwindcss/vite`) |

**Solución:**
Actualizar a **Tailwind CSS v4**, que es lo que shadcn/ui v2 espera.

### Pasos realizados:

1. **Instalar Tailwind v4 y el plugin de Vite:**
   ```bash
   pnpm --filter @hackaton/frontend add tailwindcss@latest @tailwindcss/vite@latest
   ```

2. **Actualizar `vite.config.ts`** — agregar el plugin:
   ```ts
   import tailwindcss from "@tailwindcss/vite";
   // en plugins: [react(), tailwindcss()]
   ```

3. **Reescribir `index.css`** con sintaxis de Tailwind v4:
   - `@import "tailwindcss"` en lugar de `@tailwind base/components/utilities`
   - `@theme { }` para mapear variables CSS a utilidades
   - Sin `@layer base`

4. **Eliminar archivos obsoletos de v3:**
   - `tailwind.config.js` → la configuración va en CSS
   - `postcss.config.js` → ya no se necesita (lo reemplaza `@tailwindcss/vite`)
   - `autoprefixer` y `postcss` como dependencias

### Archivos modificados:

| Archivo | Cambio |
|---|---|
| `apps/frontend/src/index.css` | Reescrito con `@import "tailwindcss"` + `@theme` |
| `apps/frontend/vite.config.ts` | Agregado plugin `@tailwindcss/vite` |
| `apps/frontend/package.json` | `tailwindcss` v4, `@tailwindcss/vite`, removidos `postcss` y `autoprefixer` |
| `apps/frontend/tailwind.config.js` | Eliminado |
| `apps/frontend/postcss.config.js` | Eliminado |

## Error 2: Conflictos al mergear `feature/p1-frontend-base` con `dev`

**Problema:**
Al fusionar la rama `feature/p1-frontend-base` (Nicolás) en `dev` surgieron múltiples conflictos porque `feature/p1-shadcn-setup` (Jhoan/Joaquín) ya había modificado los mismos archivos.

**Archivos en conflicto:**

| Archivo | Conflicto | Resolución |
|---|---|---|
| `apps/frontend/package.json` | Dependencias diferentes (Radix vs Base UI, Tailwind v3 vs v4) | Combinar ambas: mantener Tailwind v4 + agregar Radix y react-router-dom |
| `apps/frontend/src/App.tsx` | Demo de componentes (HEAD) vs routing completo (theirs) | Mantener routing de Nicolás |
| `apps/frontend/src/index.css` | Tailwind v4 (HEAD) vs Tailwind v3 (theirs) | Mantener HEAD (Tailwind v4) |
| `apps/frontend/src/components/ui/button.tsx` | Base UI (HEAD) vs Radix (theirs) | Mantener HEAD (Base UI, shadcn v2) |
| `apps/frontend/src/components/ui/card.tsx` | Base UI (HEAD) vs Radix (theirs) | Mantener HEAD |
| `apps/frontend/src/components/ui/dialog.tsx` | Base UI (HEAD) vs Radix (theirs) | Mantener HEAD |
| `apps/frontend/src/components/ui/input.tsx` | Base UI (HEAD) vs Radix (theirs) | Mantener HEAD |
| `apps/frontend/src/lib/utils.ts` | `cn()` function (HEAD) vs (theirs) | Mantener HEAD |
| `apps/frontend/tailwind.config.js` | Eliminado en HEAD (Tailwind v4), modificado en theirs | Eliminar (Tailwind v4 no lo usa) |

**Causa raíz:**
Dos branches (`p1-shadcn-setup` y `p1-frontend-base`) trabajaron en paralelo sobre los mismos archivos del frontend con enfoques distintos:
- `p1-shadcn-setup` usó shadcn/ui v2 con `@base-ui/react` y Tailwind v4
- `p1-frontend-base` usó shadcn/ui v1 con `@radix-ui/react-*` y Tailwind v3

**Solución:**
1. Para cada conflicto decidir qué versión conservar según el estado actual del proyecto (Tailwind v4 + Base UI)
2. Reinstalar dependencias faltantes después de resolver (`pnpm install`)
3. Verificar que ambos proyectos compilen (`vite build` + `tsc --noEmit`)

## Error 3: Módulos de backend no encontrados tras merge

**Error:**
```
Cannot find module '@nestjs/jwt' or its corresponding type declarations.
Cannot find module 'bcrypt' or its corresponding type declarations.
```

**Causa:**
Las dependencias del P2.1 (auth module) se instalaron pero no quedaron registradas en `pnpm-lock.yaml` porque no se había hecho commit antes del merge.

**Solución:**
Re-ejecutar `pnpm --filter @hackaton/backend add` para cada dependencia faltante para que se actualice el lockfile.
