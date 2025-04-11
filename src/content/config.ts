// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: () => z.object({
    title: z.string(),
    publishDate: z.date(),
    author: z.string().default('AutomationAI Team'),
    description: z.string(), 
    category: z.enum(["IA", "Negocios", "Tutoriales", "Casos de Éxito", "Opinión"]),
    draft: z.boolean().default(false),
    slug: z.string().optional().default(() => {
      // Generate a default slug
      return "default-slug";
    }),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};