// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';

// Сайт опубликован на GitHub Pages в подпапке: https://wiloris.github.io/theravada/
const site = 'https://wiloris.github.io';
const base = '/theravada';

/** Ссылки вида [текст](/section-1/) в Markdown/MDX получают базовый путь сами — автору о нём думать не нужно. */
const baseLinks = {
  name: 'base-links',
  element: {
    filter: ['a'],
    /** @param {any} node @param {any} ctx */
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
        ctx.setProperty(node, 'href', base + href);
      }
    },
  },
};

export default defineConfig({
  site,
  base,
  integrations: [mdx()],
  markdown: {
    processor: satteri({ hastPlugins: [baseLinks] }),
  },
  image: {
    layout: 'constrained',
  },
});
