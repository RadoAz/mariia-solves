const form = document.getElementById("contact-form") as HTMLFormElement | null;
const statusEl = document.getElementById("form-status") as HTMLParagraphElement | null;
const button = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

function setStatus(text: string, ok: boolean) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.classList.remove("hidden");
  statusEl.style.color = ok ? "var(--color-bronze-dark)" : "#b4452f";
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
