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
