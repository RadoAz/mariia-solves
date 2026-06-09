# Mariia Solves — сайт-визитка

Одностраничный сайт на Astro + Tailwind. Форма заявок уходит в Telegram через Netlify-функцию.

## Локальный запуск
```bash
npm install
npm run dev
```

## Где что менять
- Тексты, соцсети — `src/data/content.ts`
- Фото — `src/assets/`
- Стиль/палитра — `src/styles/global.css`
- Домен — `site` в `astro.config.mjs`

## Деплой
Авто-деплой на Netlify при пуше в `main`. Env-переменные на Netlify:
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

## Тесты
```bash
npm test
```
