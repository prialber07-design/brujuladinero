/**
 * Genera la imagen de redes sociales (Open Graph) a 1200x630.
 *
 *   npm run og
 *
 * Se ejecuta a mano, no en cada build: la imagen es estática y no tiene
 * sentido pagar el render en cada despliegue.
 *
 * El texto se dibuja con Georgia y la pila del sistema, las mismas fuentes
 * que usa la web, así que la tarjeta social y el sitio se ven iguales.
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const COLOR = {
  fondo: '#fbf9f8',
  acento: '#1f6f5c',
  acentoFuerte: '#005645',
  texto: '#1a1a1a',
  suave: '#595959',
  borde: '#dbdad9',
};

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

function escapar(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function construirSvg({ titulo, marca, lema, etiqueta }) {
  const lineas = repartir(titulo, 26);
  const tam = lineas.length > 3 ? 62 : lineas.length > 2 ? 72 : 80;
  const alto = tam * 1.18;
  const inicio = 300 - ((lineas.length - 1) * alto) / 2;

  const tspans = lineas
    .map((l, i) => `<tspan x="110" y="${inicio + i * alto}">${escapar(l)}</tspan>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${COLOR.fondo}"/>
  <rect x="0" y="0" width="18" height="630" fill="${COLOR.acento}"/>

  ${
    etiqueta
      ? `<rect x="110" y="86" rx="16" width="${etiqueta.length * 12 + 40}" height="34" fill="#e9f1ef"/>
         <text x="${110 + 20}" y="109" font-family="Segoe UI, Helvetica, Arial, sans-serif"
               font-size="16" font-weight="700" letter-spacing="1.6"
               fill="${COLOR.acentoFuerte}">${escapar(etiqueta.toUpperCase())}</text>`
      : ''
  }

  <text font-family="Georgia, Times New Roman, serif" font-size="${tam}" font-weight="700"
        fill="${COLOR.texto}" letter-spacing="-1.4">${tspans}</text>

  <line x1="110" y1="470" x2="1090" y2="470" stroke="${COLOR.borde}" stroke-width="2"/>

  <g transform="translate(110, 500)">
    <circle cx="20" cy="20" r="19" fill="none" stroke="${COLOR.acento}" stroke-width="2.5"/>
    <polygon points="28.5,11.5 24.7,22.7 13.5,26.5 17.3,15.3"
             fill="none" stroke="${COLOR.acento}" stroke-width="2.5"
             stroke-linejoin="round"/>
    <text x="56" y="20" font-family="Georgia, Times New Roman, serif" font-size="30"
          font-weight="700" fill="${COLOR.acento}">${escapar(marca)}</text>
    <text x="56" y="48" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="19"
          fill="${COLOR.suave}">${escapar(lema)}</text>
  </g>
</svg>`;
}

function generar({ salida, ...opciones }) {
  const svg = construirSvg(opciones);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true, defaultFontFamily: 'Georgia' },
  });
  const png = resvg.render().asPng();
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, png);
  console.log(`✓ ${salida.replace(raiz, '.')} — ${(png.length / 1024).toFixed(0)} kB`);
}

generar({
  salida: resolve(raiz, 'public/og-default.png'),
  titulo: 'Finanzas personales y cripto explicadas desde cero',
  marca: 'Brújula Dinero',
  lema: 'Procedimientos, no consejos de inversión',
  etiqueta: null,
});
