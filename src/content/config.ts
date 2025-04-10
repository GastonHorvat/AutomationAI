// src/content/config.ts
import { defineCollection, z } from 'astro:content';
// 1. Asegúrate que la importación de 'image' está activa:
import { image } from 'astro:assets';

const blogCollection = defineCollection({
  type: 'content', // Archivos Markdown/MDX

  // 2. Pasa el helper 'image' a la función del schema:
  schema: ({ image }) => z.object({
    // --- Campos existentes ---
    title: z.string(),
    publishDate: z.date(),
    author: z.string().default('AutomationAI Team'),
    description: z.string(),
    category: z.enum(["IA", "Negocios", "Tutoriales", "Casos de Éxito", "Opinión"]),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),

    // --- Campo 'image' usando el helper ---
    // 3. Usa la función image() que recibiste como argumento.
    //    Hazlo opcional si no todos los posts tendrán imagen.
    image: image().optional(),

  }),
});

// Exporta la colección
export const collections = {
  'blog': blogCollection,
};