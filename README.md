# Старый Аурангабад — цифровая авторская книга

Статический сайт на [Astro](https://astro.build) + MDX. Концепция и визуальный референс: [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md), [`docs/design-reference.png`](docs/design-reference.png).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # готовый сайт в dist/
```

## Публикация

Сайт живёт на GitHub Pages: **https://wiloris.github.io/theravada/**. Каждый `git push` в ветку `main` сам пересобирает и выкладывает сайт (`.github/workflows/deploy.yml`), ход сборки виден во вкладке Actions репозитория.

Внутренние ссылки в текстах пишите как обычно, от корня: `[глава](/section-2/)` — адрес подпапки подставится сам. Локально (`npm run dev`) сайт открывается по адресу http://localhost:4321/theravada/.

## Редактирование через админку

Тексты можно править в браузере, без редактора кода: **https://wiloris.github.io/theravada/admin/**. Это [Sveltia CMS](https://sveltiacms.app) — совместимая с Decap (Netlify) CMS админка, которая работает прямо с GitHub-репозиторием: каждое «Сохранить» — коммит в `main`, после него сайт пересобирается сам (1–2 минуты). Настройки — `public/admin/config.yml`; поля в нём повторяют схему `src/content.config.ts`, поэтому, меняя одно, поменяйте и другое.

**Вход на опубликованном сайте.** Нажмите «Sign In with Token» и вставьте личный токен GitHub. Создать его: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained token, доступ только к репозиторию `wiloris/theravada`, право *Contents: Read and write*. Токен хранится только в этом браузере; дайте ему срок действия и не пересылайте. Править может лишь тот, у кого есть доступ на запись в репозиторий.

**Доступ для другого редактора.** Владелец репозитория добавляет его в Settings → Collaborators → Add people (у редактора должен быть свой аккаунт GitHub, он принимает приглашение из письма). Fine-grained token не даёт доступа к чужому личному репозиторию, поэтому редактор создаёт **classic token**: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token, галочка `repo`, срок действия 90 дней или год. С ним он входит через «Sign In with Token». Закрыть доступ — удалить редактора из Collaborators. (Кнопку «Sign In with GitHub» без токена можно включить позже: для неё нужен небольшой OAuth-сервис [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) на Cloudflare Workers и строка `base_url:` в `backend` конфига.)

**Локально**, без GitHub и без токена (нужен Chrome, Edge или другой браузер на Chromium):

```sh
npm run dev
```

Откройте http://localhost:4321/theravada/admin/index.html, выберите «Work with Local Repository» и укажите папку проекта. Правки сразу пишутся в файлы, результат виден на http://localhost:4321/theravada/; опубликовать — обычными `git commit` и `git push`.

Что где в админке:

- **Статьи · раздел N** — статьи каждой главы. У новой статьи один раз, при создании, задаётся адрес латиницей (`staryi-gorod`) — из него получится `/section-N/staryi-gorod/`. Изображения, загруженные в статью, кладутся в её папку; в текст их вставляют как `![описание](имя-файла.jpg)`, а для подписи и обтекания используют `<Figure>` (см. ниже).
- **Авторские материалы**, **Главы**, **Части**, **Страницы → Об авторе**. Главы и части в админке только редактируются: их состав задаёт структура книги.
- Текст статей и авторских материалов редактируется как исходный MDX — визуальный режим выключен намеренно, потому что он не понимает компоненты `<Figure>`, `<Gallery>` и строки `import` и мог бы их испортить.
- Отметка «Черновик» прячет материал с опубликованного сайта.

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
