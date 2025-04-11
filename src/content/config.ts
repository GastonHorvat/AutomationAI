import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: () => z.object({
    title: z.string(),
    publishDate: z.date(),
    author: z.string().default('AutomationAI Team'),
    description: z.string(),
    category: z.enum(["IA", "Negocios", "Tutoriales", "Casos de Éxito", "Opinión"]),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(), // ← ahora es un string común
    slug: z.string(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
