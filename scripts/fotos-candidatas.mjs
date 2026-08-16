/**
 * Fase de selección: baja candidatas y las monta en una hoja de contactos.
 *
 *   node scripts/fotos-candidatas.mjs <lote>
 *
 * El error de la primera versión fue coger el primer resultado de la
 * búsqueda. Un buscador ordena por relevancia de texto, no por si la foto
 * cuenta el artículo, así que salían cajeros de Correos y caras en neón.
 * Aquí se bajan varias por artículo, se montan en una rejilla numerada y
 * se elige mirándolas. Después, fotos-elegir.mjs descarga las escogidas.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.join(import.meta.dirname, '..');
const TRABAJO = path.join(RAIZ, '.fotos-trabajo');
const LICENCIAS = 'cc0,pdm,by';
const POR_ARTICULO = 8;

// Consultas concretas: el objeto que sale en la foto, no el concepto.
// "inflación" no se fotografía; una etiqueta de precio sí.
const LOTES = {
  1: {
    'ahorrar-para-objetivos': 'jars labelled savings money',
    'como-leer-tu-nomina': 'payslip salary statement paper',
    'cuenta-sin-comisiones': 'bank branch counter customer',
    'fondo-de-emergencia': 'emergency cash envelope money',
    'gastos-hormiga': 'small change coins receipt',
    'hipoteca-fija-o-variable': 'house front door key',
  },
  2: {
    'interes-compuesto': 'seedling growing soil hands',
    'presupuesto-mensual': 'budget notebook handwritten numbers',
    'regla-50-30-20': 'banknotes divided piles table',
    'salir-de-deudas': 'debt bills calculator paper',
    'seguros-necesarios': 'insurance policy document umbrella',
    'comisiones-cripto': 'exchange fees receipt money',
  },
  3: {
    'comprar-primera-cripto': 'person phone banking app',
    'que-es-bitcoin': 'bitcoin coin hand',
    'que-es-ethereum': 'ethereum blockchain computer',
    'que-es-una-stablecoin': 'dollar bills stack',
    'volatilidad-cripto': 'rough sea storm waves',
    'wallet-vs-exchange': 'safe deposit vault box',
  },
  4: {
    'declaracion-de-la-renta': 'income tax return form',
    'declarar-criptomonedas': 'accountant calculator tax papers',
    'estafas-cripto': 'phishing fraud email laptop',
    'proteger-tus-cuentas': 'password security lock laptop',
    'que-hacer-si-te-estafan': 'police report desk officer',
    'que-sabe-hacienda-de-ti': 'tax office building sign',
  },
  5: {
    'impuestos-que-pagas': 'shopping receipt supermarket till',
    'inflacion': 'price tags supermarket products',
    'que-es-la-bolsa': 'trading floor stock exchange',
    'que-es-mica': 'european union flags building',
    'que-es-una-recesion': 'closed business shop empty',
    'tipos-de-interes': 'central bank building europe',
  },
};

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function candidatas(consulta) {
  const url =
    'https://api.openverse.org/v1/images/?' +
    new URLSearchParams({
      q: consulta,
      license: LICENCIAS,
      mature: 'false',
      page_size: '20',
    });
  const res = await fetch(url, { headers: { 'User-Agent': 'brujuladinero/1.0' } });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const { results = [] } = await res.json();
  return results.filter((f) => f.url).slice(0, POR_ARTICULO);
}

async function main() {
  const lote = process.argv[2];
  const grupo = LOTES[lote];
  if (!grupo) {
    console.error(`Lotes disponibles: ${Object.keys(LOTES).join(', ')}`);
    process.exit(1);
  }
  await mkdir(TRABAJO, { recursive: true });

  const ANCHO = 230, ALTO = 155, ETIQ = 20;
  const filas = [];
  const indice = {};
  const piezas = [];

  let y = 0;
  for (const [slug, consulta] of Object.entries(grupo)) {
    const fotos = await candidatas(consulta);
    indice[slug] = fotos.map((f) => ({
      id: f.id, url: f.url, titulo: f.title ?? '',
      autor: f.creator ?? 'Autor desconocido', autorUrl: f.creator_url ?? '',
      licencia: `CC ${String(f.license).toUpperCase()} ${f.license_version ?? ''}`.trim(),
      licenciaUrl: f.license_url ?? '', origen: f.foreign_landing_url ?? '',
    }));

    // Cabecera de fila con el slug, para saber qué se está mirando
    piezas.push({
      input: Buffer.from(
        `<svg width="${ANCHO * POR_ARTICULO}" height="${ETIQ}"><rect width="100%" height="100%" fill="#1f6f5c"/>` +
        `<text x="6" y="15" font-family="sans-serif" font-size="13" fill="#fff">${slug}  —  "${consulta}"</text></svg>`,
      ),
      left: 0, top: y,
    });
    y += ETIQ;

    for (let i = 0; i < fotos.length; i++) {
      try {
        const res = await fetch(fotos[i].url, {
          headers: { 'User-Agent': 'brujuladinero/1.0' },
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const mini = await sharp(buf).resize(ANCHO, ALTO, { fit: 'cover' }).toBuffer();
        piezas.push({ input: mini, left: i * ANCHO, top: y });
        piezas.push({
          input: Buffer.from(
            `<svg width="24" height="20"><rect width="24" height="20" fill="#000" opacity=".7"/>` +
            `<text x="7" y="15" font-family="sans-serif" font-size="13" fill="#fff">${i}</text></svg>`,
          ),
          left: i * ANCHO, top: y,
        });
      } catch (err) {
        // Sin traza, una fila vacía parece "no hay resultados" cuando en
        // realidad es que la descarga falló. Conviene distinguirlo.
        console.log(`     ! ${slug}[${i}] ${err.message}`);
      }
    }
    y += ALTO;
    filas.push(slug);
    await dormir(400);
  }

  await sharp({
    create: { width: ANCHO * POR_ARTICULO, height: y, channels: 3, background: '#fbf9f8' },
  })
    .composite(piezas)
    .jpeg({ quality: 82 })
    .toFile(path.join(TRABAJO, `lote-${lote}.jpg`));

  const previo = existsSync(path.join(TRABAJO, 'candidatas.json'))
    ? JSON.parse(await readFile(path.join(TRABAJO, 'candidatas.json'), 'utf8'))
    : {};
  await writeFile(
    path.join(TRABAJO, 'candidatas.json'),
    JSON.stringify({ ...previo, ...indice }, null, 2) + '\n',
  );

  console.log(`Lote ${lote}: ${filas.length} artículos · .fotos-trabajo/lote-${lote}.jpg`);
}

main().catch((e) => { console.error(e); process.exit(1); });
