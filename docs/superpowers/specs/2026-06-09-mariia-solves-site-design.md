# Mariia Solves — сайт-визитка. Дизайн-документ

**Дата:** 2026-06-09
**Статус:** утверждён

## Цель

Одностраничный сайт-визитка для Марии — личного ассистента / консьерж-сервиса /
проджект-менеджера. Эстетика — сдержанный премиум («editorial luxury»). Сайт
презентует услуги и собирает заявки в Telegram.

## Тип и объём

- **Тип:** статичный одностраничный лендинг + одна форма обратной связи.
- **CMS не нужен** — контент правит владелец проекта в коде, обновления редкие.
- **Дизайн:** готовый макет от ChatGPT (скриншот в `assets/`) + 3 фотографии Марии.
  Вёрстка пишется с нуля по макету.

## Стек

- **Astro** (режим `static`) — контентный фреймворк, near-zero JS на выходе.
- **Tailwind CSS** — вёрстка.
- **@fontsource** — self-hosted шрифты (Cormorant Garamond + Montserrat).
- **Netlify** — хостинг (бесплатный тариф) + Netlify Functions для формы.
- Встроенная оптимизация изображений Astro (resize, WebP/AVIF, lazy-load).

## Архитектура формы (Telegram)

Сайт статичный, но заявки должны уходить в Telegram, а токен бота нельзя держать
в публичном коде. Решение:

- Одна serverless-функция `netlify/functions/contact.ts`.
- Поток: посетитель заполняет форму → клиентский `fetch` POST на `/api/contact`
  (редирект на функцию через `netlify.toml`) → функция вызывает Telegram Bot API
  `sendMessage` → Мария видит заявку в чате.
- Секреты (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) — в переменных окружения
  Netlify. В репозиторий не попадают; в проекте только `.env.example`.
- Защита от спама: honeypot-поле + серверная валидация полей. Капчи нет (YAGNI).
- UX: состояния формы — отправка / успех / ошибка.

## Структура страницы (секции из макета)

1. **Header** — лого `MARIIA SOLVES`, меню (About, Services, Example of Work,
   About Me, Contact), кнопка «Book a Consultation» (скролл к форме).
2. **Hero** — портрет слева; имя «Mariia Solves»; подзаголовок «Personal
   Assistant, Consultant & Concierge»; теги (Research • Hiring • Travel /
   Business & Lifestyle Support); «Kyiv / Worldwide»; кнопки «Book a
   Consultation» и «Send a Request».
3. **Intro/About** — «I solve the details, so you can focus on what matters» +
   абзац + фото.
4. **Services «How I can help»** — 6 карточек с иконками: Travel Planning,
   Research, Hiring Support, Business Development, Concierge Service, Content
   Writing.
5. **Example of Work** — «Thoughtful planning creates unforgettable experiences»
   + карточки-портфолио (пример travel-маршрута) + «View Example».
6. **Why clients work with me** — 5 пунктов: Structured Approach, Attention to
   Detail, Trust & Confidentiality, Personalized Support, Official Invoices.
7. **Contact** — «Every project starts with a conversation» + фото + соцсети
   (Instagram, Telegram, WhatsApp, Email) + форма «Send a Request» +
   «I typically respond within 24 hours».
8. **Footer** — `MARIIA SOLVES / Kyiv / Worldwide` + копирайт.

Все тексты берутся из макета. Контент секции «Example of Work» на старте может
быть на плейсхолдерах, если реального кейса нет.

## Оформление

**Палитра** (снята с макета):
- Фон: кремовый `#F4EFE7`, молочный `#FBF8F3`; секции чередуются для ритма.
- Текст: тёмно-коричневый графит `#2C2622`.
- Акцент: бронза/золото `#A8835C` (кнопки, иконки, разделители).

**Типографика:**
- Заголовки и имя — Cormorant Garamond (высококонтрастный сериф).
- Меню/лейблы/текст — Montserrat; лейблы в верхнем регистре с разрядкой.

## Структура проекта

```
MariiaSolves/
├─ astro.config.mjs          # конфиг + site (домен)
├─ netlify.toml              # деплой + редирект /api/contact
├─ src/
│  ├─ pages/index.astro      # сборка из секций
│  ├─ components/            # Header, Hero, About, Services,
│  │                         #   Work, WhyMe, Contact, Footer
│  ├─ data/content.ts        # ВСЕ тексты в одном месте
│  └─ styles/                # палитра, шрифты, базовые стили
├─ netlify/functions/
│  └─ contact.ts             # приём формы → Telegram
├─ public/images/            # оптимизированные фото
└─ .env.example              # шаблон секретов (без значений)
```

Принцип: все тексты — в `src/data/content.ts`, чтобы правки контента не требовали
лезть в вёрстку. Каждая секция — отдельный компонент с одной зоной
ответственности.

## Хостинг и домен

- Старт: бесплатный поддомен Netlify (напр. `mariiasolves.netlify.app`) —
  для демонстрации Марии и сбора правок. Форма там полностью работает.
- Позже: подключение собственного домена `mariiasolves.com` (рабочее название,
  может смениться) через настройки Netlify; бесплатный SSL. В коде меняется одна
  строка `site` в `astro.config.mjs`.

## Сознательно НЕ делаем (YAGNI)

- CMS / админ-панель.
- Капча.
- Многоязычность.
- Приём оплаты и онлайн-запись (в форме обратной связи нет необходимости в этом
  на старте).
- Доставка заявок на e-mail (только Telegram; можно добавить позже).

## Открытые вопросы (для этапа реализации)

- Реальные ссылки соцсетей (Instagram, Telegram, WhatsApp, Email) и telegram
  бот/чат для заявок — нужны от Марии.
- Контент для «Example of Work» — реальный кейс или плейсхолдер.
