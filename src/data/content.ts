export type Locale = "en" | "uk";

export const site = {
  name: "Mariia Solves",
  year: 2024,
  locales: ["en", "uk"] as Locale[],
  defaultLocale: "en" as Locale,
};

// Контакты общие для обеих локалей (заменить PLACEHOLDER на реальные ссылки/ник).
const socials = [
  { kind: "instagram", label: "Instagram", href: "https://instagram.com/PLACEHOLDER" },
  { kind: "telegram", label: "Telegram", href: "https://t.me/PLACEHOLDER" },
  { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/PLACEHOLDER" },
  { kind: "email", label: "Email", href: "mailto:PLACEHOLDER@example.com" },
];

const en = {
  locale: "en" as Locale,
  langLabel: "EN",
  tagline: "Personal assistant, consultant & concierge service",
  location: "Kyiv / Worldwide",
  description:
    "Mariia Solves — personal assistant, consultant & concierge service. I help busy people and business owners organize complex tasks, save time and make better decisions. Research, hiring, travel, business support. Kyiv / Worldwide.",
  nav: [
    { label: "Why Me", href: "#why" },
    { label: "About", href: "#about" },
    { label: "How I Work", href: "#how" },
    { label: "Business", href: "#business" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    name: "Mariia Solves",
    subtitle: "Personal assistant, consultant & concierge service",
    body:
      "I help busy people and business owners organize complex tasks, save time and make better decisions.",
    tags: ["Research", "Hiring", "Travel", "Business Support"],
    location: "Kyiv / Worldwide",
  },
  whyTrust: {
    label: "Why Clients Trust Mariia Solves",
    body:
      "I don't offer generic advice. I create practical, personalized solutions tailored to each client's real goals.",
    items: [
      "Personalized approach",
      "Structured planning",
      "Attention to detail",
      "Clear communication",
      "Confidentiality",
      "Registered business",
      "Official invoices available",
    ],
  },
  about: {
    label: "About",
    paragraphs: [
      "Every successful project begins with understanding the client's real goal.",
      "Whether it's organizing a complex journey, finding the right employee, researching important information or developing a business growth strategy, my role is to simplify the process, structure the details and help you make better decisions.",
      "Mariia Solves is about clarity, trust and thoughtful execution.",
    ],
  },
  howIWork: {
    label: "How I Work",
    heading: "A clear path from request to result.",
    steps: [
      "You send your request",
      "I analyze your goals and context",
      "I prepare a structured solution or plan",
      "We refine the details if needed",
      "I support the process during implementation",
    ],
  },
  whoIWorkWith: {
    label: "Who I Work With",
    items: [
      "Business owners",
      "Entrepreneurs",
      "Busy professionals",
      "Families planning complex travel",
      "Clients looking for a trusted personal assistant",
      "People who value time, privacy and thoughtful service",
    ],
  },
  business: {
    label: "Business Development & Management Support",
    body:
      "I help business owners analyze their current structure, identify growth opportunities and improve management processes.",
    items: [
      { icon: "chart", title: "Business analysis" },
      { icon: "star", title: "Growth strategy" },
      { icon: "users", title: "Management improvement" },
      { icon: "user", title: "Hiring structure" },
      { icon: "check", title: "Operational optimization" },
      { icon: "bell", title: "Client experience improvement" },
    ],
  },
  cooperation: {
    label: "Official Cooperation",
    lines: [
      "Mariia Solves is a registered business.",
      "Official invoices are available for clients and companies.",
    ],
    items: [
      "Registered business",
      "Official invoices available",
      "Transparent cooperation",
      "Professional communication",
    ],
  },
  finalMessage: {
    text:
      "I solve the details, structure the process and help you move forward with clarity.",
  },
  contact: {
    heading: "Every project starts with a conversation.",
    body: "Let's discuss how I can support you.",
    responseNote: "I typically respond within 24 hours.",
    socials,
  },
  ui: {
    bookConsult: "Book a Consultation",
    sendRequest: "Send a Request",
    getInTouch: "Get in Touch",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "How can I help you?",
    sending: "Sending…",
    sent: "Sent",
    successMsg: "Thank you! I'll get back to you within 24 hours.",
    errorMsg: "Something went wrong. Please try again or message me directly.",
    rights: "All rights reserved.",
  },
};

const uk: typeof en = {
  locale: "uk",
  langLabel: "UK",
  tagline: "Персональний асистент, консультант і консьєрж-сервіс",
  location: "Київ / По всьому світу",
  description:
    "Mariia Solves — персональний асистент, консультант і консьєрж-сервіс. Я допомагаю зайнятим людям і власникам бізнесу організовувати складні завдання, заощаджувати час і ухвалювати кращі рішення. Дослідження, підбір персоналу, подорожі, підтримка бізнесу. Київ / По всьому світу.",
  nav: [
    { label: "Чому я", href: "#why" },
    { label: "Про мене", href: "#about" },
    { label: "Як я працюю", href: "#how" },
    { label: "Бізнес", href: "#business" },
    { label: "Контакти", href: "#contact" },
  ],
  hero: {
    name: "Mariia Solves",
    subtitle: "Персональний асистент, консультант і консьєрж-сервіс",
    body:
      "Я допомагаю зайнятим людям і власникам бізнесу організовувати складні завдання, заощаджувати час і ухвалювати кращі рішення.",
    tags: ["Дослідження", "Підбір персоналу", "Подорожі", "Підтримка бізнесу"],
    location: "Київ / По всьому світу",
  },
  whyTrust: {
    label: "Чому клієнти довіряють Mariia Solves",
    body:
      "Я не даю шаблонних порад. Я створюю практичні, персоналізовані рішення під реальні цілі кожного клієнта.",
    items: [
      "Персональний підхід",
      "Структуроване планування",
      "Увага до деталей",
      "Чітка комунікація",
      "Конфіденційність",
      "Зареєстрований бізнес",
      "Офіційні рахунки доступні",
    ],
  },
  about: {
    label: "Про мене",
    paragraphs: [
      "Кожен успішний проєкт починається з розуміння справжньої цілі клієнта.",
      "Чи то організація складної подорожі, пошук потрібного співробітника, дослідження важливої інформації чи розробка стратегії зростання бізнесу — моя роль полягає в тому, щоб спростити процес, структурувати деталі та допомогти вам ухвалювати кращі рішення.",
      "Mariia Solves — це про ясність, довіру та продумане виконання.",
    ],
  },
  howIWork: {
    label: "Як я працюю",
    heading: "Чіткий шлях від запиту до результату.",
    steps: [
      "Ви надсилаєте свій запит",
      "Я аналізую ваші цілі та контекст",
      "Я готую структуроване рішення або план",
      "За потреби ми уточнюємо деталі",
      "Я супроводжую процес під час реалізації",
    ],
  },
  whoIWorkWith: {
    label: "З ким я працюю",
    items: [
      "Власники бізнесу",
      "Підприємці",
      "Зайняті професіонали",
      "Сім'ї, що планують складні подорожі",
      "Клієнти, які шукають надійного персонального асистента",
      "Люди, які цінують час, приватність і продуманий сервіс",
    ],
  },
  business: {
    label: "Розвиток бізнесу та управлінська підтримка",
    body:
      "Я допомагаю власникам бізнесу проаналізувати поточну структуру, виявити можливості для зростання та покращити управлінські процеси.",
    items: [
      { icon: "chart", title: "Аналіз бізнесу" },
      { icon: "star", title: "Стратегія зростання" },
      { icon: "users", title: "Покращення управління" },
      { icon: "user", title: "Структура найму" },
      { icon: "check", title: "Операційна оптимізація" },
      { icon: "bell", title: "Покращення клієнтського досвіду" },
    ],
  },
  cooperation: {
    label: "Офіційна співпраця",
    lines: [
      "Mariia Solves — це зареєстрований бізнес.",
      "Офіційні рахунки доступні для клієнтів і компаній.",
    ],
    items: [
      "Зареєстрований бізнес",
      "Офіційні рахунки доступні",
      "Прозора співпраця",
      "Професійна комунікація",
    ],
  },
  finalMessage: {
    text:
      "Я вирішую деталі, структурую процес і допомагаю вам рухатися вперед із ясністю.",
  },
  contact: {
    heading: "Кожен проєкт починається з розмови.",
    body: "Обговорімо, як я можу вам допомогти.",
    responseNote: "Зазвичай я відповідаю протягом 24 годин.",
    socials,
  },
  ui: {
    bookConsult: "Записатися на консультацію",
    sendRequest: "Надіслати запит",
    getInTouch: "Зв'язатися",
    namePlaceholder: "Ваше ім'я",
    emailPlaceholder: "Ваш email",
    messagePlaceholder: "Чим я можу допомогти?",
    sending: "Надсилання…",
    sent: "Надіслано",
    successMsg: "Дякую! Я зв'яжуся з вами протягом 24 годин.",
    errorMsg: "Щось пішло не так. Спробуйте ще раз або напишіть мені напряму.",
    rights: "Усі права захищені.",
  },
};

const dict = { en, uk };

export type Content = typeof en;

export function getContent(locale?: string): Content {
  return locale === "uk" ? dict.uk : dict.en;
}
