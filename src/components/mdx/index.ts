/** Компоненты, доступные в любой MDX-статье без импорта. */
import Figure from './Figure.astro';
import Gallery from './Gallery.astro';
import AuthorNote from './AuthorNote.astro';
import Document from './Document.astro';

export const mdxComponents = { Figure, Gallery, AuthorNote, Document };
