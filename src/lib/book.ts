import { getCollection, type CollectionEntry } from 'astro:content';

export type Part = CollectionEntry<'parts'>;
export type Section = CollectionEntry<'sections'>;
export type Article = CollectionEntry<'articles'>;
export type Note = CollectionEntry<'notes'>;

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export const roman = (n: number) => ROMAN[n - 1] ?? String(n);

const visible = <T extends Article | Note>(e: T) => !(import.meta.env.PROD && e.data.draft);

const byReadingOrder = (a: Article | Note, b: Article | Note) =>
  (a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
  (a.data.date?.valueOf() ?? 0) - (b.data.date?.valueOf() ?? 0) ||
  a.data.title.localeCompare(b.data.title, 'ru');

/** Раздел и адрес статьи берутся из пути: articles/<раздел>/<статья>/index.mdx */
export function articlePath(article: Article) {
  const [section, slug] = article.id.split('/');
  return { section, slug: slug ?? section };
}

/** Адрес внутри сайта с учётом базового пути (сайт может жить в подпапке, например на GitHub Pages) */
export const url = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;

export const articleUrl = (a: Article) => {
  const { section, slug } = articlePath(a);
  return url(`/${section}/${slug}/`);
};
export const sectionUrl = (s: Section) => url(`/${s.id}/`);
export const noteUrl = (n: Note) => url(`/author/${n.id}/`);

export interface Book {
  parts: { part: Part; sections: Section[] }[];
  sections: Section[];
}

export async function getBook(): Promise<Book> {
  const parts = (await getCollection('parts')).sort((a, b) => a.data.order - b.data.order);
  const sections = (await getCollection('sections')).sort((a, b) => a.data.order - b.data.order);
  return {
    sections,
    parts: parts.map((part) => ({
      part,
      sections: sections.filter((s) => s.data.part.id === part.id),
    })),
  };
}

export async function getSectionArticles(sectionId: string) {
  const all = await getCollection('articles', visible);
  return all.filter((a) => articlePath(a).section === sectionId).sort(byReadingOrder);
}

export async function getNotes() {
  const notes = await getCollection('notes', visible);
  return notes.sort(
    (a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0) || byReadingOrder(a, b),
  );
}

export const formatDate = (d?: Date) =>
  d?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
