import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articulos' }),
  schema: z.object({
    titulo: z.string().max(70, 'El título SEO se corta pasados ~60-70 caracteres'),
    descripcion: z.string().min(80).max(160, 'La meta descripción se corta a los 160 caracteres'),
    categoria: z.enum([
      'finanzas-personales',
      'cripto-desde-cero',
      'fiscalidad-y-seguridad',
      'actualidad-explicada',
    ]),
    fecha: z.coerce.date(),
    actualizado: z.coerce.date().optional(),
    autor: z.string().default('Alberto'),
    // Borrador: no se publica ni aparece en sitemap/RSS.
    borrador: z.boolean().default(false),
    // Marca los artículos que aún NO tienen tu experiencia personal añadida.
    // Es tu red de seguridad: no publiques nada con esto en true.
    faltaAporteReal: z.boolean().default(true),
    palabraClave: z.string().optional(),
    imagen: z.string().optional(),
  }),
});

export const collections = { articulos };
