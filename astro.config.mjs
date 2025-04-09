// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon"; // Importa la integración

// https://astro.build/config
export default defineConfig({
  output: 'static', // Correcto para GitHub Pages

  // --- Propiedad 'site' para tu dominio personalizado ---
  // ¡Esta es la URL final donde vivirá el sitio!
  site: 'https://automationai.solutions',
  // --- FIN Propiedad 'site' ---

  // --- SIN 'base' ---
  // No necesitas 'base' porque el sitio está en la raíz del dominio personalizado,
  // no en una subcarpeta como /AutomationAI/
  // base: '/AutomationAI/', // <<< ELIMINA O COMENTA ESTA LÍNEA

  // --- Integraciones ---
  integrations: [
    icon() // <<< Asegúrate que la integración esté aquí
  ]
  // --- Fin Integraciones ---
});