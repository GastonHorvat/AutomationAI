// astro.config.mjs
// @ts-check  // Puedes mantener esto si usas JSDoc o comentarios TS
import { defineConfig } from "astro/config";
import icon from "astro-icon"; // Importa la integración

// https://astro.build/config
export default defineConfig({
  output: 'static', // Correcto para sitios estáticos como GitHub Pages

  // --- Propiedades para GitHub Pages ---
  // 'site' es la URL base donde vivirá tu sitio desplegado.
  // Reemplaza 'GastonHorvat' con tu usuario/org si es diferente.
  site: 'https://automationai.solutions',

  // 'base' es el nombre de tu repositorio si NO es el repo especial <username>.github.io
  // Debe empezar y terminar con un slash si se define.
  base: '/AutomationAI/',
  // --- Fin Propiedades GitHub Pages ---

  // --- Integraciones ---
  integrations: [
    icon() // <<< Añade la integración aquí dentro del array
    // Puedes añadir otras integraciones aquí si las necesitas, separadas por comas
    // Ejemplo: sitemap(), tailwind(), react(), etc.
  ]
  // --- Fin Integraciones ---

});