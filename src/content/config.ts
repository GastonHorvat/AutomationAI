import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    publishDate: z.date(),
    author: z.string().default('AutomationAI Team'),
    image: z.string().optional(),
    description: z.string(),
    category: z.enum(["IA", "Negocios", "Tutoriales", "Casos de Éxito", "Opinión"]),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    slug: z.string(), // This should match what's in your markdown files
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
