import { describe, it, expect, vi, beforeEach } from "vitest";
import { handler } from "../netlify/functions/contact";

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
    expect(sent.disable_web_page_preview).toBe(true);
  });

  it("returns 502 when Telegram call fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, json: async () => ({ ok: false }) })) as any);
    const res = await handler(evt({ name: "Anna", email: "a@b.co", message: "Need help" }), ctx);
    expect(res.statusCode).toBe(502);
  });

  it("returns 500 when Telegram env vars are not configured", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    const res = await handler(evt({ name: "Anna", email: "a@b.co", message: "Need help" }), ctx);
    expect(res.statusCode).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });
});
