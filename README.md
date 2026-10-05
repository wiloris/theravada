# Старый Аурангабад — цифровая авторская книга

Статический сайт на [Astro](https://astro.build) + MDX. Концепция и визуальный референс: [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md), [`docs/design-reference.png`](docs/design-reference.png).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # готовый сайт в dist/
```

## Устройство книги

| Что | Где | Адрес |
| --- | --- | --- |
| Название, подзаголовок, имя автора | `src/config.ts` | — |
| Обложка главной | `src/assets/covers/home.jpg` | `/` |
| Две части книги | `src/content/parts/part-1.md`, `part-2.md` | — |
| Шесть глав | `src/content/sections/section-N.md` | `/section-N/` |
| Обложки глав | `src/content/sections/covers/` | — |
| Статьи главы | `src/content/articles/section-N/<статья>/index.mdx` | `/section-N/<статья>/` |
| Авторские материалы | `src/content/notes/<заметка>.mdx` | `/author/<заметка>/` |
| Об авторе | `src/content/pages/about.md` | `/author/#about` |

Все названия частей и глав — временные заглушки. Чтобы переименовать, достаточно поменять `title` в файле. Адрес главы задаётся именем файла: `section-1.md` → `/section-1/`. Если переименовать файл, переименуйте и папку статей `articles/section-1/`.

### Глава

```yaml
---
order: 1                 # порядок в книге
part: part-1             # к какой части относится
title: Раздел 1
summary: Одно-два предложения о главе.
cover: ./covers/section-1.jpg
coverAlt: Описание изображения
coverCaption: Подпись на обложке (необязательно)
coverPosition: "50% 40%" # какая часть кадра видна при обрезке
accent: "#8a5a2b"        # цвет главы (необязательно)
---
Вступительный текст главы.
```

### Статья

Каждая статья — отдельная папка: в ней `index.mdx` и изображения.

```mdx
---
title: Заголовок
subtitle: Подзаголовок (необязательно)
excerpt: Короткое описание для оглавления главы
date: 2026-09-18
order: 1            # порядок в главе
cover: ./cover.jpg  # изображение в начале статьи (необязательно)
draft: true         # черновик: виден в dev, не публикуется
---

import gate from './gate.jpg';
import a from './a.jpg';
import b from './b.jpg';

Текст...

<Figure src={gate} alt="Ворота" caption="Подпись" credit="Источник" />

Текст...
```

Компоненты доступны в любой статье без импорта:

- `<Figure src alt caption credit layout>` — иллюстрация. `layout`: `text` (по колонке, по умолчанию), `wide` (шире колонки), `full` (во всю ширину), `left` / `right` (вертикальное изображение с обтеканием).
- `<Gallery images={[{ src, alt, caption }]} caption columns={2|3} />` — галерея с сохранением пропорций.
- `<Document date source>…</Document>` — выписка из архивного документа, надпись.
- `<AuthorNote label>…</AuthorNote>` — авторский комментарий.
- Обычный Markdown: `##` заголовки, `>` цитаты, списки, ссылки, `![alt](./img.jpg)`.

Любое изображение открывается на весь экран по нажатию. Astro сам сжимает изображения и готовит размеры под разные экраны, поэтому оригиналы можно класть в хорошем качестве.

Полный пример всех элементов: `src/content/articles/section-1/kak-ustroena-statya/index.mdx`.

## Временные изображения

Все обложки и иллюстрации сейчас — фрагменты референса. Их нужно заменить реальными материалами: положите новые файлы с теми же именами или укажите новые пути в `cover:`.
