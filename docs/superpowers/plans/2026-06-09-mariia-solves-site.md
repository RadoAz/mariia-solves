# Mariia Solves — сайт-визитка. Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать одностраничный сайт-визитку на Astro + Tailwind по готовому макету, с формой заявки, уходящей в Telegram через Netlify-функцию, и задеплоить на бесплатный поддомен Netlify.

**Architecture:** Полностью статичный Astro-сайт (`output: static`), секции — изолированные `.astro`-компоненты, все тексты в одном `src/data/content.ts`. Форма постит JSON на standalone Netlify Function `contact`, которая валидирует данные и шлёт сообщение в Telegram Bot API. Секреты — в env-переменных Netlify.

**Tech Stack:** Astro 5, Tailwind CSS v4 (Vite-плагин), @fontsource-variable (Cormorant Garamond + Montserrat), Netlify (хостинг + Functions), Vitest (тесты функции).

**Подход к верификации:** Для серверной логики (Netlify-функция) — строгий TDD на Vitest. Для визуальных секций реальная проверка — это успешная сборка (`astro build`), отсутствие ошибок типов (`astro check`) и визуальный осмотр в dev-сервере; для каждой секции указан критерий «что должно быть на экране».

**Открытые данные (запросить у Марии до Task 11/13, не блокируют вёрстку — используем плейсхолдеры):** ссылки Instagram / Telegram / WhatsApp / Email; токен Telegram-бота и chat_id для заявок; реальный кейс для «Example of Work».

---

## Структура файлов

```
MariiaSolves/
├─ astro.config.mjs              # output: static, site
├─ netlify.toml                  # build + редирект /api/contact → функция
├─ tsconfig.json                 # strict (из шаблона Astro)
├─ vitest.config.ts              # тесты функции
├─ package.json
├─ .env.example                  # TELEGRAM_BOT_TOKEN=, TELEGRAM_CHAT_ID=
├─ src/
│  ├─ pages/index.astro          # сборка страницы из секций
│  ├─ layouts/BaseLayout.astro   # <html>, <head>, мета, шрифты, global.css
│  ├─ components/
│  │  ├─ Header.astro
│  │  ├─ Hero.astro
│  │  ├─ About.astro
│  │  ├─ Services.astro
│  │  ├─ Work.astro
│  │  ├─ WhyMe.astro
│  │  ├─ Contact.astro          # разметка формы + соцсети
│  │  └─ Footer.astro
│  ├─ data/content.ts            # ВСЕ тексты + конфиг (соцсети, меню)
│  ├─ scripts/contact-form.ts    # клиентский submit + состояния
│  ├─ styles/global.css          # @import tailwindcss + @theme (палитра/шрифты)
│  └─ assets/                     # исходные фото для <Image> (оптимизация)
└─ netlify/functions/
   ├─ contact.ts                  # приём формы → Telegram
   └─ contact.test.ts             # Vitest
```

---

### Task 1: Скаффолд Astro + Tailwind + шрифты

**Files:**
- Create: весь базовый проект Astro (через CLI)
- Modify: `astro.config.mjs`, `package.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Создать Astro-проект в текущей папке**

Папка уже содержит `assets/`, `docs/`, `.git`. Скаффолдим в существующую директорию по пустому шаблону:

```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes .
```

Если CLI откажется из-за непустой папки — создать во временной и перенести: `npm create astro@latest tmp-astro -- --template minimal --no-install --no-git --yes` затем `cp -R tmp-astro/. . && rm -rf tmp-astro`.

- [ ] **Step 2: Установить зависимости**

```bash
npm install
```

- [ ] **Step 3: Добавить Tailwind v4**

```bash
npx astro add tailwind --yes
```

Это ставит `@tailwindcss/vite`, прописывает плагин в `astro.config.mjs` и создаёт/подключает CSS с `@import "tailwindcss"`.

- [ ] **Step 4: Установить шрифты (self-hosted)**

```bash
npm install @fontsource-variable/cormorant-garamond @fontsource-variable/montserrat
```

- [ ] **Step 5: Задать палитру и шрифты в `src/styles/global.css`**

Заменить содержимое файла (путь, созданный шагом 3 — обычно `src/styles/global.css`) на:

```css
@import "tailwindcss";

@import "@fontsource-variable/cormorant-garamond";
@import "@fontsource-variable/montserrat";

@theme {
  --color-cream: #f4efe7;
  --color-milk: #fbf8f3;
  --color-sand: #efe7da;
  --color-ink: #2c2622;
  --color-muted: #6b6258;
  --color-bronze: #a8835c;
  --color-bronze-dark: #8c6a45;

  --font-serif: "Cormorant Garamond Variable", Georgia, serif;
  --font-sans: "Montserrat Variable", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: var(--color-ink);
  background-color: var(--color-milk);
}

/* Утилита для «лейблов»: верхний регистр с разрядкой */
.label {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-bronze-dark);
}
```

- [ ] **Step 6: Настроить `astro.config.mjs`**

Убедиться, что конфиг содержит `output: 'static'` и `site`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mariiasolves.com',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 7: Проверить сборку**

Run: `npm run build`
Expected: сборка проходит без ошибок, создаётся `dist/`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: скаффолд Astro + Tailwind v4 + шрифты"
```

---

### Task 2: Контент-данные (`content.ts`)

Все тексты со скриншота макета (`assets/2026-06-09 20.25.49.jpg`) в одном типизированном файле. Соцсети/токены пока плейсхолдеры.

**Files:**
- Create: `src/data/content.ts`

- [ ] **Step 1: Создать `src/data/content.ts`**

```ts
export const site = {
  name: "Mariia Solves",
  tagline: "Personal Assistant, Consultant & Concierge",
  location: "Kyiv / Worldwide",
  year: 2024,
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Example of Work", href: "#work" },
  { label: "About Me", href: "#about-me" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  name: "Mariia Solves",
  subtitle: "Personal Assistant, Consultant & Concierge",
  tags: ["Research", "Hiring", "Travel"],
  tagsLine2: "Business & Lifestyle Support",
  location: "Kyiv / Worldwide",
};

export const intro = {
  heading: "I solve the details,",
  headingEm: "so you can focus on what matters.",
  body:
    "I help busy individuals and businesses save time, simplify complex tasks and achieve their goals through a personalized and thoughtful approach.",
};

export const services = {
  label: "Services",
  heading: "How I can help",
  items: [
    { icon: "plane", title: "Travel Planning", text: "Detailed itineraries, routes, hotels, transfers and local recommendations." },
    { icon: "search", title: "Research", text: "Information search, market analysis, contacts, suppliers and due diligence." },
    { icon: "users", title: "Hiring Support", text: "Candidate search, screening, interviews coordination and onboarding support." },
    { icon: "chart", title: "Business Development", text: "Development plans, expansion strategy, operations and process optimization." },
    { icon: "bell", title: "Concierge Service", text: "Personal tasks, reservations, event planning and daily life organization." },
    { icon: "doc", title: "Content Writing", text: "Texts that inform, inspire and represent your brand professionally." },
  ],
};

export const work = {
  label: "Example of Work",
  heading: "Thoughtful planning creates unforgettable experiences.",
  ctaLabel: "View Example",
  ctaHref: "#contact", // TODO: заменить на реальную ссылку кейса
  caption: "Rome → Naples → Porto San Giorgio",
};

export const whyMe = {
  label: "Why Clients Work With Me",
  items: [
    { icon: "check", title: "Structured Approach", text: "Every project is clear, organized and well planned." },
    { icon: "star", title: "Attention to Detail", text: "I focus on the small things that make a big difference." },
    { icon: "shield", title: "Trust & Confidentiality", text: "Your information is always safe with me." },
    { icon: "user", title: "Personalized Support", text: "I'm with you at every step of the process." },
    { icon: "doc", title: "Official Invoices", text: "Registered business. Official invoices available." },
  ],
};

export const contact = {
  heading: "Every project starts with a conversation.",
  body: "Let's discuss how I can support you.",
  responseNote: "I typically respond within 24 hours.",
  socials: [
    { kind: "instagram", label: "Instagram", href: "https://instagram.com/PLACEHOLDER" },
    { kind: "telegram", label: "Telegram", href: "https://t.me/PLACEHOLDER" },
    { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/PLACEHOLDER" },
    { kind: "email", label: "Email", href: "mailto:PLACEHOLDER@example.com" },
  ],
};
```

- [ ] **Step 2: Проверить типы**

Run: `npx astro check`
Expected: 0 errors (файл компилируется; пока не используется — это нормально).

- [ ] **Step 3: Commit**

```bash
git add src/data/content.ts
git commit -m "feat: контент-данные сайта в content.ts"
```

---

### Task 3: BaseLayout + перенос фото в assets

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/assets/` (перенос фото из `assets/`)

- [ ] **Step 1: Перенести фото для оптимизации**

```bash
mkdir -p src/assets
cp "assets/2026-06-09 20.25.49.jpg" src/assets/hero.jpg
cp "assets/2026-06-09 20.27.00.jpg" src/assets/about.jpg
cp "assets/2026-06-09 20.26.41.jpg" src/assets/contact.jpg
cp "assets/2026-06-09 20.27.32.jpg" src/assets/portrait.jpg
```

(Первый файл `20.25.49.jpg` — это макет целиком; для hero реально подойдёт один из портретов. Сопоставление: hero = `20.27.00.jpg` (белый верх), about = `20.27.32.jpg`, contact = `20.26.41.jpg`. Уточнить визуально на этапе сборки секций и переименовать при необходимости.)

- [ ] **Step 2: Создать `src/layouts/BaseLayout.astro`**

```astro
---
import "../styles/global.css";
import { site } from "../data/content";
const description =
  "Mariia Solves — Personal Assistant, Consultant & Concierge. Research, hiring, travel, business and lifestyle support. Kyiv / Worldwide.";
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{site.name} — {site.tagline}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={`${site.name} — ${site.tagline}`} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="bg-milk text-ink antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Заменить `src/pages/index.astro` на временную заглушку**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout>
  <main class="grid min-h-screen place-items-center">
    <h1 class="font-serif text-6xl text-bronze">Mariia Solves</h1>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Запустить dev-сервер и проверить**

Run: `npm run dev` (открыть напечатанный localhost-URL)
Expected: по центру кремового фона бронзовый серифный заголовок «Mariia Solves». Это подтверждает, что Tailwind-токены (`bg-milk`, `text-bronze`, `font-serif`) и шрифты работают.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: BaseLayout, мета-теги и фото в src/assets"
```

---

### Task 4: Иконки (общий компонент)

Секции Services и WhyMe используют простые line-иконки. Один компонент-словарь inline-SVG, без внешних зависимостей.

**Files:**
- Create: `src/components/Icon.astro`

- [ ] **Step 1: Создать `src/components/Icon.astro`**

```astro
---
interface Props { name: string; class?: string }
const { name, class: cls = "h-7 w-7" } = Astro.props;
// Все пути — stroke-иконки 24x24 (стиль line, как на макете).
const paths: Record<string, string> = {
  plane: '<path d="M2 12l20-7-7 20-3-8-10-5z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  users: '<circle cx="9" cy="9" r="3"/><path d="M3 20a6 6 0 0112 0M17 7a3 3 0 010 6M21 20a6 6 0 00-4-5.6"/>',
  chart: '<path d="M3 21h18M6 17v-5M11 17V9M16 17v-8M20 7l-4 2-3-3-4 3"/>',
  bell: '<path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6M10 21h4"/>',
  doc: '<path d="M7 3h7l5 5v13H7zM14 3v5h5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  star: '<path d="M12 3l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 17l-5.6 3 1.5-6.3L3 9.5 9.4 9z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
};
const inner = paths[name] ?? "";
---
<svg class={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
  set:html={inner} aria-hidden="true"></svg>
```

- [ ] **Step 2: Проверить типы**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Icon.astro
git commit -m "feat: компонент Icon с line-иконками"
```

---

### Task 5: Header

**Files:**
- Create: `src/components/Header.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/Header.astro`**

```astro
---
import { site, nav } from "../data/content";
---
<header class="sticky top-0 z-50 border-b border-bronze/15 bg-milk/80 backdrop-blur">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="#top" class="font-serif text-xl leading-none tracking-wide">
      MARIIA<br /><span class="text-bronze-dark">SOLVES</span>
    </a>
    <nav class="hidden gap-7 md:flex">
      {nav.map((i) => (
        <a href={i.href} class="label hover:text-bronze">{i.label}</a>
      ))}
    </nav>
    <a href="#contact"
       class="rounded-sm border border-bronze px-4 py-2 text-xs uppercase tracking-widest text-bronze-dark transition hover:bg-bronze hover:text-milk">
      Book a Consultation
    </a>
  </div>
</header>
```

- [ ] **Step 2: Подключить в `index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
---
<BaseLayout>
  <span id="top"></span>
  <Header />
  <main></main>
</BaseLayout>
```

- [ ] **Step 3: Проверить в dev-сервере**

Run: `npm run dev`
Expected: липкая шапка — слева лого в две строки, по центру меню (на широком экране), справа рамочная кнопка «Book a Consultation», которая на hover заливается бронзой.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Header с навигацией и CTA"
```

---

### Task 6: Hero

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/Hero.astro`**

```astro
---
import { Image } from "astro:assets";
import heroImg from "../assets/hero.jpg";
import { hero } from "../data/content";
---
<section class="grid items-stretch md:grid-cols-2">
  <div class="min-h-[60vh] md:min-h-[88vh]">
    <Image src={heroImg} alt="Mariia" widths={[480, 800, 1200]}
      class="h-full w-full object-cover" loading="eager" />
  </div>
  <div class="flex flex-col items-center justify-center gap-5 bg-cream px-6 py-16 text-center">
    <h1 class="font-serif text-6xl tracking-tight md:text-7xl">{hero.name}</h1>
    <p class="label">{hero.subtitle}</p>
    <div class="h-px w-10 bg-bronze"></div>
    <p class="label">{hero.tags.join(" • ")}</p>
    <p class="label">{hero.tagsLine2}</p>
    <p class="label mt-2">{hero.location}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a href="#contact" class="rounded-sm bg-bronze px-6 py-3 text-xs uppercase tracking-widest text-milk transition hover:bg-bronze-dark">Book a Consultation</a>
      <a href="#contact" class="rounded-sm border border-bronze px-6 py-3 text-xs uppercase tracking-widest text-bronze-dark transition hover:bg-bronze hover:text-milk">Send a Request</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Подключить `<Hero />` в `index.astro`** (внутри `<main>`, после `<Header />`).

- [ ] **Step 3: Проверить в dev-сервере**

Run: `npm run dev`
Expected: две колонки — слева фото на всю высоту, справа на кремовом фоне крупное серифное имя, лейблы, разделитель-черта и две кнопки. На мобильном — колонки складываются в стопку.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Hero-секция"
```

---

### Task 7: About / Intro

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/About.astro`**

```astro
---
import { Image } from "astro:assets";
import aboutImg from "../assets/about.jpg";
import { intro } from "../data/content";
---
<section id="about" class="bg-sand">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
    <div>
      <h2 class="font-serif text-4xl leading-tight md:text-5xl">
        {intro.heading}<br /><em>{intro.headingEm}</em>
      </h2>
      <p class="mt-6 max-w-md text-sm leading-relaxed text-muted">{intro.body}</p>
    </div>
    <Image src={aboutImg} alt="Mariia at work" widths={[480, 800]}
      class="h-72 w-full rounded-sm object-cover md:h-96" />
  </div>
</section>
```

- [ ] **Step 2: Подключить `<About />` в `index.astro`** (после `<Hero />`).

- [ ] **Step 3: Проверить в dev-сервере**

Expected: на тёплом беже слева серифный заголовок (вторая строка курсивом) и абзац приглушённым текстом, справа фото.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: About/Intro секция"
```

---

### Task 8: Services («How I can help»)

**Files:**
- Create: `src/components/Services.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/Services.astro`**

```astro
---
import Icon from "./Icon.astro";
import { services } from "../data/content";
---
<section id="services" class="bg-milk">
  <div class="mx-auto max-w-6xl px-6 py-20 text-center">
    <p class="label">{services.label}</p>
    <h2 class="mt-2 font-serif text-4xl md:text-5xl">{services.heading}</h2>
    <div class="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {services.items.map((s) => (
        <div class="flex flex-col items-center gap-3 px-2">
          <Icon name={s.icon} class="h-8 w-8 text-bronze" />
          <h3 class="label">{s.title}</h3>
          <p class="max-w-xs text-sm leading-relaxed text-muted">{s.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Подключить `<Services />` в `index.astro`** (после `<About />`).

- [ ] **Step 3: Проверить в dev-сервере**

Expected: заголовок «How I can help», ниже сетка из 6 карточек (3 в ряд на десктопе, 2 на планшете, 1 на мобильном), каждая с бронзовой иконкой, заголовком-лейблом и описанием.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Services секция с 6 карточками"
```

---

### Task 9: Example of Work

Портфолио-блок. Без реального кейса используем фото-плейсхолдеры и подпись из `content.ts`.

**Files:**
- Create: `src/components/Work.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/Work.astro`**

```astro
---
import { work } from "../data/content";
---
<section id="work" class="bg-sand">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1fr_1.4fr]">
    <div>
      <p class="label">{work.label}</p>
      <h2 class="mt-3 font-serif text-4xl leading-tight md:text-5xl">{work.heading}</h2>
      <a href={work.ctaHref}
         class="mt-8 inline-block rounded-sm border border-bronze px-6 py-3 text-xs uppercase tracking-widest text-bronze-dark transition hover:bg-bronze hover:text-milk">
        {work.ctaLabel}
      </a>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-1 grid place-items-center rounded-sm bg-bronze/15 p-4 text-center font-serif text-lg text-bronze-dark aspect-[3/4]">
        {work.caption}
      </div>
      <div class="rounded-sm bg-milk shadow-sm aspect-[3/4]"></div>
      <div class="rounded-sm bg-milk shadow-sm aspect-[3/4]"></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Подключить `<Work />` в `index.astro`** (после `<Services />`).

- [ ] **Step 3: Проверить в dev-сервере**

Expected: слева заголовок + кнопка «View Example», справа ряд из трёх карточек-плейсхолдеров (первая с подписью маршрута). Реальные изображения кейса подставляются позже.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Example of Work секция (плейсхолдер кейса)"
```

---

### Task 10: Why Clients Work With Me

**Files:**
- Create: `src/components/WhyMe.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/WhyMe.astro`**

```astro
---
import Icon from "./Icon.astro";
import { whyMe } from "../data/content";
---
<section id="about-me" class="bg-milk">
  <div class="mx-auto max-w-6xl px-6 py-20">
    <p class="label text-center">{whyMe.label}</p>
    <div class="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
      {whyMe.items.map((w) => (
        <div class="flex flex-col items-center gap-3 text-center">
          <Icon name={w.icon} class="h-7 w-7 text-bronze" />
          <h3 class="label">{w.title}</h3>
          <p class="max-w-[14rem] text-sm leading-relaxed text-muted">{w.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Подключить `<WhyMe />` в `index.astro`** (после `<Work />`).

- [ ] **Step 3: Проверить в dev-сервере**

Expected: ряд из 5 пунктов (на десктопе в одну строку, схлопывается на узких экранах), каждый — иконка + заголовок + текст.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Why Clients Work With Me секция"
```

---

### Task 11: Contact (разметка формы + соцсети)

Только разметка и состояния-узлы. Логика отправки — Task 14. Форма постит на `/api/contact`.

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/Contact.astro`**

```astro
---
import { Image } from "astro:assets";
import contactImg from "../assets/contact.jpg";
import Icon from "./Icon.astro";
import { contact } from "../data/content";
---
<section id="contact" class="bg-cream">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-3">
    <div class="md:col-span-1">
      <h2 class="font-serif text-4xl leading-tight md:text-5xl">{contact.heading}</h2>
      <p class="mt-4 text-sm text-muted">{contact.body}</p>
      <Image src={contactImg} alt="Mariia" widths={[400, 700]}
        class="mt-6 h-64 w-full rounded-sm object-cover" />
    </div>

    <div class="md:col-span-1">
      <p class="label">Get in Touch</p>
      <ul class="mt-4 space-y-3">
        {contact.socials.map((s) => (
          <li>
            <a href={s.href} target="_blank" rel="noopener"
               class="flex items-center gap-3 text-sm text-ink transition hover:text-bronze">
              <Icon name={s.kind === "email" ? "doc" : "user"} class="h-5 w-5 text-bronze" />
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p class="mt-6 text-xs text-muted">{contact.responseNote}</p>
    </div>

    <form id="contact-form" class="md:col-span-1 space-y-3">
      <input type="text" name="company" tabindex="-1" autocomplete="off"
             class="hidden" aria-hidden="true" />
      <input required name="name" placeholder="Your name"
             class="w-full rounded-sm border border-bronze/30 bg-milk px-4 py-3 text-sm outline-none focus:border-bronze" />
      <input required type="email" name="email" placeholder="Your email"
             class="w-full rounded-sm border border-bronze/30 bg-milk px-4 py-3 text-sm outline-none focus:border-bronze" />
      <textarea required name="message" rows="4" placeholder="How can I help you?"
             class="w-full rounded-sm border border-bronze/30 bg-milk px-4 py-3 text-sm outline-none focus:border-bronze"></textarea>
      <button type="submit"
             class="w-full rounded-sm bg-bronze px-6 py-3 text-xs uppercase tracking-widest text-milk transition hover:bg-bronze-dark disabled:opacity-60">
        Send a Request
      </button>
      <p id="form-status" role="status" aria-live="polite" class="hidden text-sm"></p>
    </form>
  </div>
</section>
```

- [ ] **Step 2: Подключить `<Contact />` в `index.astro`** (после `<WhyMe />`).

- [ ] **Step 3: Проверить в dev-сервере**

Expected: три колонки — заголовок+фото, список соцсетей, форма с полями имя/email/сообщение и кнопкой. Honeypot-поле `company` скрыто. Кнопка «Send a Request» пока ничего не отправляет.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Contact секция (разметка формы + соцсети)"
```

---

### Task 12: Footer + сборка страницы

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Создать `src/components/Footer.astro`**

```astro
---
import { site } from "../data/content";
---
<footer class="border-t border-bronze/15 bg-cream">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center">
    <p class="font-serif text-lg tracking-wide">MARIIA SOLVES</p>
    <p class="label">{site.location}</p>
    <p class="mt-2 text-xs text-muted">© {site.year} Mariia Solves. All rights reserved.</p>
  </div>
</footer>
```

- [ ] **Step 2: Финальный `src/pages/index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import Services from "../components/Services.astro";
import Work from "../components/Work.astro";
import WhyMe from "../components/WhyMe.astro";
import Contact from "../components/Contact.astro";
import Footer from "../components/Footer.astro";
---
<BaseLayout>
  <span id="top"></span>
  <Header />
  <main>
    <Hero />
    <About />
    <Services />
    <Work />
    <WhyMe />
    <Contact />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Полная проверка**

Run: `npx astro check && npm run build`
Expected: 0 ошибок типов, сборка успешна. Затем `npm run dev` — прокрутить всю страницу сверху вниз, проверить якорные ссылки меню (плавный скролл к секциям).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Footer и финальная сборка index"
```

---

### Task 13: Netlify-функция `contact` (TDD)

Чистая логика отправки в Telegram. Тестируем валидацию, honeypot и формирование запроса с замоканным `fetch`.

**Files:**
- Create: `netlify/functions/contact.ts`
- Test: `netlify/functions/contact.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json` (скрипт `test`)

- [ ] **Step 1: Установить Vitest и типы Netlify**

```bash
npm install -D vitest @netlify/functions
```

- [ ] **Step 2: Создать `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "node" } });
```

Добавить в `package.json` в `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 3: Написать падающий тест `netlify/functions/contact.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { handler } from "./contact";

const ctx = {} as any;
const evt = (body: unknown, method = "POST") =>
  ({ httpMethod: method, body: JSON.stringify(body) } as any);

beforeEach(() => {
  vi.restoreAllMocks();
  process.env.TELEGRAM_BOT_TOKEN = "T";
  process.env.TELEGRAM_CHAT_ID = "C";
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ ok: true }) })) as any);
});

describe("contact handler", () => {
  it("rejects non-POST with 405", async () => {
    const res = await handler(evt({}, "GET"), ctx);
    expect(res.statusCode).toBe(405);
  });

  it("returns 400 when required fields missing", async () => {
    const res = await handler(evt({ name: "", email: "", message: "" }), ctx);
    expect(res.statusCode).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("silently accepts (200) but does not send when honeypot filled", async () => {
    const res = await handler(evt({ name: "A", email: "a@b.co", message: "hi", company: "bot" }), ctx);
    expect(res.statusCode).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sends to Telegram and returns 200 on valid input", async () => {
    const res = await handler(evt({ name: "Anna", email: "a@b.co", message: "Need help" }), ctx);
    expect(res.statusCode).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe("https://api.telegram.org/botT/sendMessage");
    const sent = JSON.parse(init.body);
    expect(sent.chat_id).toBe("C");
    expect(sent.text).toContain("Anna");
    expect(sent.text).toContain("a@b.co");
    expect(sent.text).toContain("Need help");
  });

  it("returns 502 when Telegram call fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, json: async () => ({ ok: false }) })) as any);
    const res = await handler(evt({ name: "Anna", email: "a@b.co", message: "Need help" }), ctx);
    expect(res.statusCode).toBe(502);
  });
});
```

- [ ] **Step 4: Запустить тест — убедиться, что падает**

Run: `npm test`
Expected: FAIL — модуль `./contact` ещё не экспортирует `handler`.

- [ ] **Step 5: Реализовать `netlify/functions/contact.ts`**

```ts
import type { Handler } from "@netlify/functions";

const json = (statusCode: number, data: object) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(data),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });

  let data: Record<string, string> = {};
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  // honeypot: бот заполнил скрытое поле — делаем вид, что всё ок
  if (data.company) return json(200, { ok: true });

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();
  if (!name || !email || !message) return json(400, { error: "Missing fields" });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return json(500, { error: "Server not configured" });

  const text =
    `🟤 New request — Mariia Solves\n\n` +
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });

  if (!res.ok) return json(502, { error: "Failed to deliver" });
  return json(200, { ok: true });
};
```

- [ ] **Step 6: Запустить тесты — убедиться, что проходят**

Run: `npm test`
Expected: PASS — все 5 тестов зелёные.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Netlify-функция contact → Telegram (TDD)"
```

---

### Task 14: Клиентская отправка формы + состояния

**Files:**
- Create: `src/scripts/contact-form.ts`
- Modify: `src/components/Contact.astro` (подключить скрипт)

- [ ] **Step 1: Создать `src/scripts/contact-form.ts`**

```ts
const form = document.getElementById("contact-form") as HTMLFormElement | null;
const status = document.getElementById("form-status") as HTMLParagraphElement | null;
const button = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

function setStatus(text: string, ok: boolean) {
  if (!status) return;
  status.textContent = text;
  status.classList.remove("hidden");
  status.style.color = ok ? "var(--color-bronze-dark)" : "#b4452f";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form || !button) return;
  const payload = Object.fromEntries(new FormData(form).entries());
  button.disabled = true;
  button.textContent = "Sending…";
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    setStatus("Thank you! I'll get back to you within 24 hours.", true);
    button.textContent = "Sent";
  } catch {
    setStatus("Something went wrong. Please try again or message me directly.", false);
    button.disabled = false;
    button.textContent = "Send a Request";
  }
});
```

- [ ] **Step 2: Подключить скрипт в `Contact.astro`**

Добавить в конец файла (после `</section>`):

```astro
<script>
  import "../scripts/contact-form.ts";
</script>
```

- [ ] **Step 3: Проверить сборку**

Run: `npx astro check && npm run build`
Expected: 0 ошибок, скрипт включён в бандл. (Полная проверка отправки — после деплоя в Task 15, т.к. функция работает только на Netlify.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: клиентская отправка формы с состояниями"
```

---

### Task 15: Конфигурация Netlify + деплой

**Files:**
- Create: `netlify.toml`
- Create: `.env.example`

- [ ] **Step 1: Создать `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/contact"
  to = "/.netlify/functions/contact"
  status = 200
```

- [ ] **Step 2: Создать `.env.example`**

```bash
# Скопировать в .env для локали; на Netlify задать в Site settings → Environment variables
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

- [ ] **Step 3: Получить Telegram-данные** (требует действий пользователя — выполнить вне кода)

1. В Telegram написать `@BotFather` → `/newbot` → получить `TELEGRAM_BOT_TOKEN`.
2. Написать своему новому боту любое сообщение.
3. Открыть `https://api.telegram.org/bot<TOKEN>/getUpdates` → взять `chat.id` → это `TELEGRAM_CHAT_ID`.

- [ ] **Step 4: Залить репозиторий на GitHub и подключить к Netlify**

```bash
gh repo create MariiaSolves --private --source=. --remote=origin --push
```

Затем на app.netlify.com: **Add new site → Import from GitHub → выбрать репозиторий**. Build-команда и publish подхватятся из `netlify.toml`. В **Site settings → Environment variables** добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Запустить деплой.

- [ ] **Step 5: Переименовать поддомен (по желанию)**

Site settings → Domain management → Options → Edit site name → `mariiasolves` → сайт доступен на `https://mariiasolves.netlify.app`.

- [ ] **Step 6: Проверить вживую**

Открыть `https://mariiasolves.netlify.app`, отправить тестовую заявку через форму.
Expected: в браузере — сообщение «Thank you…»; в Telegram-чате с ботом приходит заявка с именем, email и текстом.

- [ ] **Step 7: Commit**

```bash
git add netlify.toml .env.example
git commit -m "chore: конфиг Netlify + шаблон env для Telegram"
git push
```

---

### Task 16: README и финальные правки

**Files:**
- Create: `README.md`

- [ ] **Step 1: Создать `README.md`**

```markdown
# Mariia Solves — сайт-визитка

Одностраничный сайт на Astro + Tailwind. Форма заявок уходит в Telegram через Netlify-функцию.

## Локальный запуск
\`\`\`bash
npm install
npm run dev
\`\`\`

## Где что менять
- Тексты, соцсети — `src/data/content.ts`
- Фото — `src/assets/`
- Стиль/палитра — `src/styles/global.css`
- Домен — `site` в `astro.config.mjs`

## Деплой
Авто-деплой на Netlify при пуше в `main`. Env-переменные на Netlify:
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

## Тесты
\`\`\`bash
npm test
\`\`\`
```

- [ ] **Step 2: Финальная проверка всего**

Run: `npx astro check && npm run build && npm test`
Expected: 0 ошибок типов, успешная сборка, все тесты зелёные.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: README проекта"
git push
```

---

## Что осталось за рамками плана (по спеке, YAGNI)

- Подключение собственного домена `mariiasolves.com` (делается в настройках Netlify, когда домен будет готов; в коде — правка `site`).
- Реальный контент кейса для «Example of Work».
- Доставка заявок на e-mail (только Telegram на старте).
- Капча, многоязычность, CMS, онлайн-оплата.
