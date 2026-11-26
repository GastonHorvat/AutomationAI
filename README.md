# AutomationAI (automationai.com.ar)

Sitio de marketing de AutomationAI Solutions, hecho con [Astro](https://astro.build) 5 en salida estática.

## Qué hay

- Páginas: home, soluciones, `approach` (inglés) y `enfoque` (español), about, contacto, directorio de herramientas de IA (`tools`), recursos, políticas y 404.
- Blog: `src/pages/blog/` lee los posts de la vista `posts_view` de Supabase **en el momento del build** (`src/lib/supabase.ts`). Un post nuevo aparece recién en el próximo deploy.
- Contacto: formulario de Formspree (endpoint público en `src/pages/contact.astro`).
- `public/calculadora` y `public/Smart_Living`: páginas estáticas sueltas que se publican tal cual en el dominio.

## Correrlo local

```sh
npm ci
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

Variables (en `.env`, nunca commitear):

| Variable | Para qué |
|---|---|
| `SUPABASE_URL` | Proyecto de Supabase del blog |
| `SUPABASE_ANON_KEY` | Clave anon (solo lectura de `posts_view`) |

Sin esas variables el sitio compila igual, pero sin posts.

## Deploy

GitHub Pages con GitHub Actions: cada push a `main` corre `.github/workflows/astro.yml`, que compila con los secrets `SUPABASE_URL` y `SUPABASE_ANON_KEY` del repo y publica `dist/`. El dominio `automationai.com.ar` sale del archivo `CNAME`.

Para ver si un deploy salió: pestaña Actions del repo, workflow "Deploy Astro site to Pages".
