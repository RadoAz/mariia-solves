import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "og.jpg");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f4efe7"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#a8835c" stroke-opacity="0.35" stroke-width="2"/>
  <text x="600" y="290" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="104" fill="#2c2622">Mariia Solves</text>
  <text x="600" y="350" text-anchor="middle" font-family="Montserrat, Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6" fill="#8c6a45">PERSONAL ASSISTANT  ·  CONSULTANT  ·  CONCIERGE</text>
  <rect x="560" y="392" width="80" height="2" fill="#a8835c"/>
  <text x="600" y="448" text-anchor="middle" font-family="Montserrat, Helvetica, Arial, sans-serif" font-size="22" letter-spacing="8" fill="#6b6258">KYIV  /  WORLDWIDE</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(out);
console.log("OG written to", out);
