// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon"; // Importa la integración

// https://astro.build/config
export default defineConfig({
  output: 'static', // Correcto para GitHub Pages
  
  // Define las variables de entorno que necesitamos
  vite: {
    define: {
      'import.meta.env.AIRTABLE_API_KEY': JSON.stringify(process.env.AIRTABLE_API_KEY),
      'import.meta.env.AIRTABLE_BASE_ID': JSON.stringify(process.env.AIRTABLE_BASE_ID),
      'import.meta.env.AIRTABLE_TABLE_ID': JSON.stringify(process.env.AIRTABLE_TABLE_ID),
      'import.meta.env.AIRTABLE_BLOG_TABLE_ID': JSON.stringify(process.env.AIRTABLE_BLOG_TABLE_ID),
    },
  },
  
  // --- Propiedad 'site' para tu dominio personalizado ---
  site: 'https://automationai.solutions',

  // --- Integraciones ---
  integrations: [
    icon(), // <<< Asegúrate que la integración esté aquí
  ]
  // --- Fin Integraciones ---
});