# CLAUDE.md

Digital author's book about old Aurangabad. Astro 7 + MDX, static, Russian-language content.

- Read `docs/DESIGN-BRIEF.md` and look at `docs/design-reference.png` before any design work. The reference sets mood and composition only; it is not a mockup.
- It must stay a *book*, not a blog template: 2 parts × 3 chapters, each chapter with its own cover. Part and chapter titles are placeholders — never invent final names.
- Content model lives in `src/content.config.ts` (mirror field changes in the CMS config `public/admin/config.yml`, Sveltia CMS); helpers (ordering, URLs) in `src/lib/book.ts`; MDX components in `src/components/mdx/`; all styles in `src/styles/global.css` (design tokens at the top).
- Article section is derived from its folder: `src/content/articles/<section-id>/<slug>/index.mdx`.
- Don't pass `position` to `<Image>` (sharp rejects percentage positions); crop with CSS `object-position` instead.
- Deployed to GitHub Pages under `base: '/theravada'`: in `.astro`/`.ts` build internal links with `url()` from `src/lib/book.ts`, never a bare `"/..."`; Markdown/MDX links are prefixed by the `baseLinks` plugin in `astro.config.mjs`.
- Verify with `npm run build`. The authoring guide for the site owner is in `README.md`.
