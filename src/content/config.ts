// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Definir el esquema para la colección 'blog'
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    author: z.string(),
    image: z.string().optional(), // Hazlo opcional si algunos posts no tienen imagen
    description: z.string(),
    category: z.string(),
    draft: z.boolean().default(false), // Puedes poner un valor por defecto
    tags: z.array(z.string()).optional(), // Array de strings, opcional
    // 👇 ¡IMPORTANTE! Define el campo slug aquí también 👇
    slug: z.string().optional(), // Hazlo opcional si a veces usas el del filename
    // Añade cualquier otro campo que tengas en tu frontmatter
  })
});

// Exportar un objeto 'collections' con tus colecciones definidas.
export const collections = {
  'blog': blogCollection,
  // 'otra-coleccion': otraCollection, // Si tuvieras más
};