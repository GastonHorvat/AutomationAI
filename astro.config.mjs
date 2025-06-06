// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon"; // Importa la integración

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false, // La toolbar está habilitada en general
    // Puedes definir en qué condiciones se muestra
  },
  
  output: 'static', // Correcto para GitHub Pages
  
  // --- Propiedad 'site' para tu dominio personalizado ---
  site: 'https://automationai.solutions',

  // --- Integraciones ---
  integrations: [
    icon(), // <<< Asegúrate que la integración esté aquí
  ]
  // --- Fin Integraciones ---
});