const form = document.getElementById("contact-form") as HTMLFormElement | null;
const statusEl = document.getElementById("form-status") as HTMLParagraphElement | null;
const button = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

function setStatus(text: string, ok: boolean) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.classList.remove("hidden");
  statusEl.style.color = ok ? "var(--color-bronze-dark)" : "#b4452f";
}

// Локализованные строки приходят из data-атрибутов формы (с английским фолбэком).
const t = {
  sending: form?.dataset.sending ?? "Sending…",
  sent: form?.dataset.sent ?? "Sent",
  send: form?.dataset.send ?? "Send a Request",
  success: form?.dataset.success ?? "Thank you! I'll get back to you within 24 hours.",
  error: form?.dataset.error ?? "Something went wrong. Please try again or message me directly.",
};

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form || !button) return;
  const payload = Object.fromEntries(new FormData(form).entries());
  button.disabled = true;
  button.textContent = t.sending;
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    setStatus(t.success, true);
    button.textContent = t.sent;
  } catch {
    setStatus(t.error, false);
    button.disabled = false;
    button.textContent = t.send;
  }
});
