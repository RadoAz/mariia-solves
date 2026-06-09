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
