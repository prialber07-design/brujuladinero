/**
 * Genera los pines de Pinterest a 1000x1500 (proporción 2:3).
 *
 *   npm run pines
 *
 * Salida: marketing/pines/<slug>.png
 *
 * Van FUERA de public/ a propósito: son ficheros para subir a mano a
 * Pinterest, no recursos que deba servir la web. Meterlos en public/
 * añadiría casi 2 MB de peso muerto a cada despliegue.
 *
 * Pinterest es un buscador: el texto va DENTRO de la imagen porque es lo que
 * se lee en el tablón, y la proporción 2:3 es la que más superficie ocupa en
 * la cuadrícula sin que la recorten.
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dirArticulos = resolve(raiz, 'src/content/articulos');
const dirSalida = resolve(raiz, 'marketing/pines');

const CATEGORIA = {
  'finanzas-personales': { nombre: 'Finanzas personales', color: '#1f6f5c' },
  'cripto-desde-cero': { nombre: 'Cripto desde cero', color: '#0f6b7d' },
  'fiscalidad-y-seguridad': { nombre: 'Fiscalidad y seguridad', color: '#8c4033' },
  'actualidad-explicada': { nombre: 'Actualidad explicada', color: '#7a5510' },
};

const FONDO = '#fbf9f8';
const TEXTO = '#1a1a1a';
const SUAVE = '#595959';

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

/** Bloque de texto ajustado al ancho disponible. */
function bloque({ texto, x, y, ancho, tamMax, ratio, peso, fill, familia, maxLineas }) {
  const lineas = repartir(texto, Math.floor(ancho / (tamMax * ratio))).slice(0, maxLineas);
  const masLarga = Math.max(...lineas.map((l) => l.length));
  const tam = Math.min(tamMax, Math.floor(ancho / (masLarga * ratio)));
  const alto = tam * 1.22;
  const tspans = lineas
    .map((l, i) => `<tspan x="${x}" y="${y + i * alto}">${escapar(l)}</tspan>`)
    .join('');
  return {
    svg: `<text font-family="${familia}" font-size="${tam}" font-weight="${peso}" fill="${fill}" letter-spacing="-0.8">${tspans}</text>`,
    altoTotal: lineas.length * alto,
  };
}

function construirPin({ titulo, gancho, categoria }) {
  const cat = CATEGORIA[categoria] ?? CATEGORIA['finanzas-personales'];
  const X = 90;
  const ANCHO = 820;

  const tit = bloque({
    texto: titulo, x: X, y: 380, ancho: ANCHO,
    tamMax: 76, ratio: 0.58, peso: 700, fill: TEXTO,
    familia: 'Georgia, Times New Roman, serif', maxLineas: 5,
  });

  const yGancho = 380 + tit.altoTotal + 90;
  const gan = bloque({
    texto: gancho, x: X, y: yGancho, ancho: ANCHO,
    tamMax: 40, ratio: 0.52, peso: 400, fill: SUAVE,
    familia: 'Segoe UI, Helvetica, Arial, sans-serif', maxLineas: 4,
  });

  const anchoEtiqueta = cat.nombre.length * 14 + 56;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
  <rect width="1000" height="1500" fill="${FONDO}"/>
  <rect x="0" y="0" width="1000" height="26" fill="${cat.color}"/>

  <rect x="${X}" y="180" rx="24" width="${anchoEtiqueta}" height="52" fill="${cat.color}" opacity="0.12"/>
  <text x="${X + 28}" y="215" font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="23" font-weight="700" letter-spacing="2"
        fill="${cat.color}">${escapar(cat.nombre.toUpperCase())}</text>

  ${tit.svg}

  <line x1="${X}" y1="${yGancho - 55}" x2="${X + 160}" y2="${yGancho - 55}"
        stroke="${cat.color}" stroke-width="5"/>

  ${gan.svg}

  <line x1="${X}" y1="1300" x2="${1000 - X}" y2="1300" stroke="#dbdad9" stroke-width="2"/>

  <g transform="translate(${X}, 1345)">
    <circle cx="26" cy="26" r="25" fill="none" stroke="${cat.color}" stroke-width="3.5"/>
    <polygon points="37,15 32,29.5 17.5,34.5 22.5,20"
             fill="none" stroke="${cat.color}" stroke-width="3.5" stroke-linejoin="round"/>
    <text x="74" y="24" font-family="Georgia, Times New Roman, serif" font-size="38"
          font-weight="700" fill="${cat.color}">Brújula Dinero</text>
    <text x="74" y="60" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26"
          fill="${SUAVE}">brujuladinero.com</text>
  </g>
</svg>`;
}

const campo = (t, n) =>
  (t.match(new RegExp(`^${n}:\\s*'([^']+)'`, 'm')) ?? [, ''])[1];

/** Primer punto clave del artículo: ya está escrito como frase corta y punzante. */
function primerPunto(t) {
  const m = t.match(/^puntosClave:\n\s*- '([^']+)'/m);
  return m ? m[1] : '';
}

mkdirSync(dirSalida, { recursive: true });

let total = 0;
let suma = 0;
const sinGancho = [];

for (const archivo of readdirSync(dirArticulos).filter((f) => f.endsWith('.md'))) {
  const t = readFileSync(resolve(dirArticulos, archivo), 'utf8');
  const slug = archivo.replace('.md', '');
  const titulo = campo(t, 'titulo');
  const categoria = campo(t, 'categoria');
  const gancho = primerPunto(t);

  if (!titulo || !categoria) continue;
  if (!gancho) sinGancho.push(slug);

  const resvg = new Resvg(construirPin({ titulo, gancho, categoria }), {
    fitTo: { mode: 'width', value: 1000 },
    font: { loadSystemFonts: true, defaultFontFamily: 'Georgia' },
  });
  const png = resvg.render().asPng();
  writeFileSync(resolve(dirSalida, `${slug}.png`), png);

  total += 1;
  suma += png.length;
}

console.log(`\n✓ marketing/pines/  —  ${total} pines a 1000x1500`);
console.log(`  ${(suma / 1024 / 1024).toFixed(1)} MB en total · ${(suma / total / 1024).toFixed(0)} kB de media`);
if (sinGancho.length) {
  console.log(`  ! sin punto clave, pin sin gancho: ${sinGancho.join(', ')}`);
}
console.log('');
