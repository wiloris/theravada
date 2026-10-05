import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Две большие части книги. */
const parts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/parts' }),
  schema: z.object({
    order: z.number(),
    /** Подпись вида «Часть первая» */
    label: z.string(),
    title: z.string(),
  }),
});

/** Шесть глав (разделов). Имя файла = адрес раздела: section-1.md → /section-1/ */
const sections = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sections' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      part: reference('parts'),
      title: z.string(),
      summary: z.string(),
      cover: image(),
      coverAlt: z.string(),
      coverCaption: z.string().optional(),
      /** CSS object-position для кадрирования обложки, напр. "50% 30%" */
      coverPosition: z.string().default('50% 50%'),
      /** Акцентный цвет главы */
      accent: z.string().optional(),
    }),
});

const articleSchema = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    excerpt: z.string().optional(),
    date: z.coerce.date().optional(),
    /** Порядок внутри раздела; без него — по дате */
    order: z.number().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    coverCaption: z.string().optional(),
    draft: z.boolean().default(false),
  });

/** Статьи. Папка = раздел: articles/section-1/<статья>/index.mdx */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: articleSchema,
});

/** Авторские материалы (не привязаны к главам). */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: articleSchema,
});

/** Отдельные страницы: об авторе и т. п. */
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      portrait: image().optional(),
      portraitAlt: z.string().optional(),
    }),
});

export const collections = { parts, sections, articles, notes, pages };
