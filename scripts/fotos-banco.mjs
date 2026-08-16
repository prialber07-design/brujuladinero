/**
 * Mina un banco de fotos de finanzas concreto.
 *
 *   node scripts/fotos-banco.mjs
 *
 * Buscando candidatas apareció "Raisin - Finance Stock Images": una cuenta
 * de Flickr que es, literalmente, un banco de fotos de finanzas con licencia
 * Creative Commons. Sus fotos son justo el registro que usan BBVA o Bankinter
 * —tarros etiquetados, manos con calculadora, llaves sobre contratos— y
 * además comparten estilo entre sí, que es lo que hace que una web parezca
 * hecha a propósito y no un collage.
 *
 * Openverse no deja filtrar por autor de forma exacta: el parámetro `creator`
 * hace coincidencia difusa y devuelve cualquiera que lleve "Stock" en el
 * nombre. Así que se lanzan muchas consultas temáticas y se filtra el autor
 * a mano sobre los resultados.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.join(import.meta.dirname, '..');
const TRABAJO = path.join(RAIZ, '.fotos-trabajo');
const AUTOR = 'Raisin - Finance Stock Images';

const CONSULTAS = [
  'savings jar money', 'piggy bank savings', 'coins stack money', 'bank notes cash',
  'calculator finance desk', 'budget planning money', 'mortgage house keys',
  'credit card payment', 'pension retirement savings', 'investment stocks chart',
  'interest rate finance', 'inflation prices money', 'tax return finance',
  'insurance policy document', 'bitcoin cryptocurrency coin', 'blockchain crypto',
  'online banking smartphone', 'wallet money cash', 'debt bills finance',
  'salary payslip wages', 'emergency fund savings', 'financial planning advisor',
  'euro currency money', 'shopping receipt spending', 'bank account statement',
  'stock market trading', 'saving for house deposit', 'compound interest growth',
  'fraud scam security', 'password security online',
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(TRABAJO, { recursive: true });
  const banco = new Map();

  for (const q of CONSULTAS) {
    try {
      const url =
        'https://api.openverse.org/v1/images/?' +
        new URLSearchParams({ q, license: 'cc0,pdm,by', page_size: '20' });
      const res = await fetch(url, { headers: { 'User-Agent': 'brujuladinero/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { results = [] } = await res.json();
      const suyas = results.filter((f) => f.creator === AUTOR);
      for (const f of suyas) banco.set(f.id, f);
      console.log(`  ${suyas.length.toString().padStart(2)} · ${q}`);
    } catch (err) {
      console.log(`   ! ${q}: ${err.message}`);
    }
    await dormir(700);
  }

  const fotos = [...banco.values()].sort((a, b) =>
    (a.title ?? '').localeCompare(b.title ?? ''),
  );
  console.log(`\n${fotos.length} fotos distintas del banco\n`);

  // Hoja de contactos numerada, para elegir mirando y no por el título.
  const ANCHO = 210, ALTO = 140, ETIQ = 16, COLS = 8;
  const piezas = [];
  const indice = [];

  for (let i = 0; i < fotos.length; i++) {
    const f = fotos[i];
    const col = i % COLS, fila = Math.floor(i / COLS);
    const x = col * ANCHO, y = fila * (ALTO + ETIQ);
    try {
      const r = await fetch(f.url, {
        headers: { 'User-Agent': 'brujuladinero/1.0' },
        signal: AbortSignal.timeout(20_000),
      });
      const mini = await sharp(Buffer.from(await r.arrayBuffer()))
        .resize(ANCHO, ALTO, { fit: 'cover' })
        .toBuffer();
      piezas.push({ input: mini, left: x, top: y });
      piezas.push({
        input: Buffer.from(
          `<svg width="${ANCHO}" height="${ETIQ}"><rect width="100%" height="100%" fill="#1f6f5c"/>` +
          `<text x="4" y="12" font-family="sans-serif" font-size="11" fill="#fff">${i} ${
            (f.title ?? '').replace(/[<>&]/g, '').slice(0, 34)
          }</text></svg>`,
        ),
        left: x, top: y + ALTO,
      });
      indice.push({
        n: i, id: f.id, url: f.url, titulo: f.title ?? '',
        autor: f.creator, autorUrl: f.creator_url ?? '',
        licencia: `CC ${String(f.license).toUpperCase()} ${f.license_version ?? ''}`.trim(),
        licenciaUrl: f.license_url ?? '', origen: f.foreign_landing_url ?? '',
      });
    } catch {
      /* miniatura ilegible: queda el hueco y se descarta al mirar */
    }
  }

  const alto = Math.ceil(fotos.length / COLS) * (ALTO + ETIQ);
  await sharp({ create: { width: COLS * ANCHO, height: alto, channels: 3, background: '#fbf9f8' } })
    .composite(piezas)
    .jpeg({ quality: 80 })
    .toFile(path.join(TRABAJO, 'banco.jpg'));

  await writeFile(path.join(TRABAJO, 'banco.json'), JSON.stringify(indice, null, 2) + '\n');
  console.log(`Hoja de contactos: .fotos-trabajo/banco.jpg (${indice.length} miniaturas)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
