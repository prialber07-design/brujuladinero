/**
 * Genera las imágenes sociales a 1200x630.
 *
 *   npm run og
 *
 * Produce:
 *   public/og-default.png      imagen genérica del sitio
 *   public/og/<slug>.png       una por artículo
 *
 * Por qué una por artículo y no una sola: Google Discover exige imágenes
 * grandes y propias de cada página, y al compartir un enlace la miniatura es
 * lo que decide si alguien hace clic. Con una imagen común, los 30 artículos
 * se ven idénticos en WhatsApp, X y Facebook.
 *
 * Se ejecuta a mano, no en cada build: las imágenes solo cambian si cambian
 * los títulos.
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dirArticulos = resolve(raiz, 'src/content/articulos');

// Color por categoría: el mismo sistema que usa la web, para que la
// miniatura y la página a la que lleva se reconozcan como lo mismo.
const COLOR_CATEGORIA = {
  'finanzas-personales': '#1f6f5c',
  'cripto-desde-cero': '#0f6b7d',
  'fiscalidad-y-seguridad': '#8c4033',
  'actualidad-explicada': '#7a5510',
};

const NOMBRE_CATEGORIA = {
  'finanzas-personales': 'Finanzas personales',
  'cripto-desde-cero': 'Cripto desde cero',
  'fiscalidad-y-seguridad': 'Fiscalidad y seguridad',
  'actualidad-explicada': 'Actualidad explicada',
};

const FONDO = '#fbf9f8';
const TEXTO = '#1a1a1a';
const SUAVE = '#595959';

/** Parte un texto en líneas de como mucho `max` caracteres, sin cortar palabras. */
function repartir(texto, max) {
  const lineas = [];
  let actual = '';
  for (const palabra of texto.split(' ')) {
    if ((actual + ' ' + palabra).trim().length > max) {
      if (actual) lineas.push(actual.trim());
      actual = palabra;
    } else {
      actual = (actual + ' ' + palabra).trim();
    }
  }
  if (actual) lineas.push(actual.trim());
  return lineas;
}

const escapar = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function construirSvg({ titulo, etiqueta, acento, marca, lema }) {
  // El tamaño se deduce de la línea MÁS LARGA, no del número de líneas.
  // Atarlo al número de líneas fallaba: un título de dos líneas largas
  // recibía la fuente máxima y se salía por la derecha.
  const ANCHO_UTIL = 985; // 1200 menos el margen izquierdo y un aire a la derecha
  const RATIO = 0.58; // ancho medio de carácter en Georgia negrita, medido sobre el render

  const lineas = repartir(titulo, 30).slice(0, 4);
  const masLarga = Math.max(...lineas.map((l) => l.length));
  const tam = Math.min(72, Math.floor(ANCHO_UTIL / (masLarga * RATIO)));
  const alto = tam * 1.2;
  const inicio = 275 - ((lineas.length - 1) * alto) / 2;

  const tspans = lineas
    .map((l, i) => `<tspan x="110" y="${inicio + i * alto}">${escapar(l)}</tspan>`)
    .join('');

  const anchoEtiqueta = etiqueta ? etiqueta.length * 11 + 44 : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${FONDO}"/>
  <rect x="0" y="0" width="18" height="630" fill="${acento}"/>

  ${
    etiqueta
      ? `<rect x="110" y="80" rx="17" width="${anchoEtiqueta}" height="36" fill="${acento}" opacity="0.12"/>
         <text x="132" y="105" font-family="Segoe UI, Helvetica, Arial, sans-serif"
               font-size="17" font-weight="700" letter-spacing="1.5"
               fill="${acento}">${escapar(etiqueta.toUpperCase())}</text>`
      : ''
  }

  <text font-family="Georgia, Times New Roman, serif" font-size="${tam}" font-weight="700"
        fill="${TEXTO}" letter-spacing="-1.2">${tspans}</text>

  <line x1="110" y1="490" x2="1090" y2="490" stroke="#dbdad9" stroke-width="2"/>

  <g transform="translate(110, 520)">
    <circle cx="20" cy="20" r="19" fill="none" stroke="${acento}" stroke-width="2.5"/>
    <polygon points="28.5,11.5 24.7,22.7 13.5,26.5 17.3,15.3"
             fill="none" stroke="${acento}" stroke-width="2.5" stroke-linejoin="round"/>
    <text x="56" y="20" font-family="Georgia, Times New Roman, serif" font-size="29"
          font-weight="700" fill="${acento}">${escapar(marca)}</text>
    <text x="56" y="47" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="18"
          fill="${SUAVE}">${escapar(lema)}</text>
  </g>
</svg>`;
}

function generar(salida, opciones) {
  const resvg = new Resvg(construirSvg(opciones), {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true, defaultFontFamily: 'Georgia' },
  });
  const png = resvg.render().asPng();
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, png);
  return png.length;
}

// ── Imagen genérica del sitio ────────────────────────────────────
const bytesDefecto = generar(resolve(raiz, 'public/og-default.png'), {
  titulo: 'Finanzas personales y cripto explicadas desde cero',
  etiqueta: null,
  acento: '#1f6f5c',
  marca: 'Brújula Dinero',
  lema: 'Procedimientos, no consejos de inversión',
});
console.log(`✓ public/og-default.png  —  ${(bytesDefecto / 1024).toFixed(0)} kB`);

// ── Una por artículo ─────────────────────────────────────────────
const campo = (t, n) =>
  (t.match(new RegExp(`^${n}:\\s*'([^']+)'`, 'm')) ?? [, ''])[1];

let total = 0;
let suma = 0;

for (const archivo of readdirSync(dirArticulos).filter((f) => f.endsWith('.md'))) {
  const t = readFileSync(resolve(dirArticulos, archivo), 'utf8');
  const slug = archivo.replace('.md', '');
  const titulo = campo(t, 'titulo');
  const categoria = campo(t, 'categoria');

  if (!titulo || !categoria) {
    console.warn(`  ! ${slug}: sin título o categoría, se omite`);
    continue;
  }

  suma += generar(resolve(raiz, `public/og/${slug}.png`), {
    titulo,
    etiqueta: NOMBRE_CATEGORIA[categoria],
    acento: COLOR_CATEGORIA[categoria] ?? '#1f6f5c',
    marca: 'Brújula Dinero',
    lema: 'brujuladinero.com',
  });
  total += 1;
}

console.log(`✓ public/og/  —  ${total} imágenes, ${(suma / 1024).toFixed(0)} kB en total`);
console.log(`  media: ${(suma / total / 1024).toFixed(0)} kB por imagen\n`);
