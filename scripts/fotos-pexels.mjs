/**
 * Fotografía desde Pexels.
 *
 *   npm run fotos:pexels              descarga las que falten
 *   npm run fotos:pexels -- --hoja    solo monta la hoja de contactos
 *   npm run fotos:pexels -- --rehacer=slug1,slug2
 *   npm run fotos:pexels -- --variante=slug:2   coge el 3er resultado
 *
 * La clave se lee de PEXELS_API_KEY o del fichero .env.local, que está fuera
 * del repositorio. Se saca gratis en https://www.pexels.com/api/.
 *
 * Por qué Pexels y no Openverse: Openverse indexa obra Creative Commons, y
 * el subconjunto que permite uso comercial Y obra derivada —hace falta poder
 * recortar— se queda en nada para estos temas. De seis consultas de finanzas
 * personales, cuatro devolvían cero resultados. Pexels es un banco pensado
 * para esto: cubre los temas, no exige atribución y permite recorte.
 */
import { writeFile, mkdir, readFile, rm } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.join(import.meta.dirname, '..');
const DESTINO = path.join(RAIZ, 'src', 'assets', 'fotos');
const REGISTRO = path.join(RAIZ, 'src', 'data', 'fotos.json');
const TRABAJO = path.join(RAIZ, '.fotos-trabajo');

/**
 * Consultas en inglés porque el catálogo está etiquetado en inglés, y
 * describiendo el objeto que sale en la foto, no el concepto: "inflación"
 * no se fotografía, una etiqueta de precio sí.
 */
const BUSQUEDAS = {
  // ── Finanzas personales ─────────────────────────────────────
  'presupuesto-mensual': 'budget planning notebook calculator',
  'regla-50-30-20': 'cash envelopes budgeting money',
  'gastos-hormiga': 'coffee cup receipt small change',
  'fondo-de-emergencia': 'savings jar coins emergency',
  'ahorrar-para-objetivos': 'labeled savings jars money goals',
  'interes-compuesto': 'coins stacks growing plant',
  'como-leer-tu-nomina': 'payslip salary document desk',
  'cuenta-sin-comisiones': 'bank card banking counter',
  'salir-de-deudas': 'bills debt paperwork calculator',
  'hipoteca-fija-o-variable': 'house keys mortgage contract',
  'seguros-necesarios': 'insurance policy signing document',

  // ── Cripto desde cero ───────────────────────────────────────
  'que-es-bitcoin': 'bitcoin coin hand close up',
  'que-es-ethereum': 'ethereum crypto coins desk',
  'que-es-una-stablecoin': 'dollar bills stack close up',
  'volatilidad-cripto': 'stormy sea waves grey',
  'wallet-vs-exchange': 'hardware wallet crypto security',
  'comprar-primera-cripto': 'person phone trading app',
  'comisiones-cripto': 'calculator receipt fees money',

  // ── Fiscalidad y seguridad ──────────────────────────────────
  'declaracion-de-la-renta': 'tax return form paperwork',
  'que-sabe-hacienda-de-ti': 'documents files office archive',
  'declarar-criptomonedas': 'accountant tax documents calculator',
  'proteger-tus-cuentas': 'phone two factor authentication security',
  'estafas-cripto': 'phishing scam laptop warning',
  'que-hacer-si-te-estafan': 'worried person laptop phone',

  // ── Actualidad explicada ────────────────────────────────────
  'inflacion': 'supermarket price tags shelf',
  'tipos-de-interes': 'european central bank building',
  'que-es-una-recesion': 'closed shop shutter street',
  'impuestos-que-pagas': 'supermarket receipt shopping',
  'que-es-la-bolsa': 'stock exchange trading screens',
  'que-es-mica': 'european union flags building',
};

function leerClave() {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY.trim();
  const env = path.join(RAIZ, '.env.local');
  if (existsSync(env)) {
    const m = readFileSync(env, 'utf8').match(/^PEXELS_API_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  }
  return null;
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function buscar(clave, consulta) {
  const url =
    'https://api.pexels.com/v1/search?' +
    new URLSearchParams({
      query: consulta,
      per_page: '10',
      orientation: 'landscape',
      size: 'large',
    });
  const res = await fetch(url, { headers: { Authorization: clave } });
  if (res.status === 401) throw new Error('clave rechazada por Pexels');
  if (res.status === 429) throw new Error('límite de peticiones alcanzado; espera una hora');
  if (!res.ok) throw new Error(`Pexels ${res.status}`);
  const { photos = [] } = await res.json();
  return photos;
}

async function bajar(url, destino) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`descarga ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10_000) throw new Error(`archivo de ${buf.length} B, sospechoso`);
  await writeFile(destino, buf);
  return buf.length;
}

function argumento(nombre) {
  const a = process.argv.find((x) => x.startsWith(`--${nombre}=`));
  return a ? a.split('=').slice(1).join('=') : null;
}

async function main() {
  const clave = leerClave();
  if (!clave) {
    console.error(
      'Falta la clave de Pexels.\n\n' +
      '  1. Sácala gratis en https://www.pexels.com/api/\n' +
      '  2. Crea el fichero .env.local en la raíz del proyecto con:\n\n' +
      '       PEXELS_API_KEY=tu_clave_aqui\n\n' +
      '  3. Vuelve a lanzar: npm run fotos:pexels\n',
    );
    process.exit(1);
  }

  await mkdir(DESTINO, { recursive: true });
  await mkdir(TRABAJO, { recursive: true });
  await mkdir(path.dirname(REGISTRO), { recursive: true });

  const registro = existsSync(REGISTRO) ? JSON.parse(await readFile(REGISTRO, 'utf8')) : {};

  // --variante=slug:2 vuelve a bajar ese artículo cogiendo otro resultado,
  // para cuando la primera opción es correcta pero fea.
  const variantes = Object.fromEntries(
    (argumento('variante') ?? '')
      .split(',').filter(Boolean)
      .map((p) => { const [s, i] = p.split(':'); return [s, Number(i) || 0]; }),
  );

  const rehacer = new Set([
    ...(argumento('rehacer') ?? '').split(',').filter(Boolean),
    ...Object.keys(variantes),
  ]);
  for (const slug of rehacer) {
    delete registro[slug];
    const f = path.join(DESTINO, `${slug}.jpg`);
    if (existsSync(f)) await rm(f);
  }

  const pendientes = Object.entries(BUSQUEDAS).filter(
    ([slug]) =>
      registro[slug]?.fuente !== 'pexels' || !existsSync(path.join(DESTINO, `${slug}.jpg`)),
  );

  if (pendientes.length === 0) {
    console.log('Todo al día. Usa --rehacer=slug para cambiar alguna.');
    return;
  }

  console.log(`Buscando ${pendientes.length} fotos en Pexels…\n`);
  const fallos = [];
  const alternativas = {};

  for (const [slug, consulta] of pendientes) {
    try {
      const fotos = await buscar(clave, consulta);
      if (fotos.length === 0) throw new Error('sin resultados');

      // Se guardan todas las alternativas para poder cambiar de opción
      // sin repetir la búsqueda.
      alternativas[slug] = fotos.map((f) => ({
        id: f.id, autor: f.photographer, url: f.src.large2x ?? f.src.large,
        pagina: f.url, alt: f.alt ?? '',
      }));

      const elegida = fotos[variantes[slug] ?? 0] ?? fotos[0];
      const bytes = await bajar(elegida.src.large2x ?? elegida.src.large,
                                path.join(DESTINO, `${slug}.jpg`));

      registro[slug] = {
        fuente: 'pexels',
        id: String(elegida.id),
        titulo: elegida.alt ?? '',
        autor: elegida.photographer,
        autorUrl: elegida.photographer_url ?? '',
        // Pexels no obliga a citar, pero cuesta poco y es de justicia.
        licencia: 'Licencia Pexels',
        licenciaUrl: 'https://www.pexels.com/license/',
        origen: elegida.url,
        consulta,
      };
      console.log(`  ✓ ${slug.padEnd(26)} ${(bytes / 1024).toFixed(0).padStart(5)} KB  ${elegida.photographer}`);
    } catch (err) {
      fallos.push(slug);
      console.log(`  ✗ ${slug.padEnd(26)} ${err.message}`);
      if (/clave|límite/.test(err.message)) break;
    }
    await dormir(300);
  }

  await writeFile(REGISTRO, JSON.stringify(registro, null, 2) + '\n', 'utf8');
  await writeFile(
    path.join(TRABAJO, 'pexels-alternativas.json'),
    JSON.stringify(alternativas, null, 2) + '\n', 'utf8',
  );

  // Hoja de contactos de lo descargado, para revisarlo de un vistazo.
  const usados = Object.keys(BUSQUEDAS).filter((s) => existsSync(path.join(DESTINO, `${s}.jpg`)));
  const COLS = 5, ANCHO = 300, ALTO = 200, ETIQ = 22;
  const piezas = [];
  for (let i = 0; i < usados.length; i++) {
    const x = (i % COLS) * ANCHO, y = Math.floor(i / COLS) * (ALTO + ETIQ);
    piezas.push({
      input: await sharp(path.join(DESTINO, `${usados[i]}.jpg`))
        .resize(ANCHO, ALTO, { fit: 'cover' }).toBuffer(),
      left: x, top: y,
    });
    piezas.push({
      input: Buffer.from(
        `<svg width="${ANCHO}" height="${ETIQ}"><rect width="100%" height="100%" fill="#1f6f5c"/>` +
        `<text x="5" y="16" font-family="sans-serif" font-size="12" fill="#fff">${usados[i]}</text></svg>`,
      ),
      left: x, top: y + ALTO,
    });
  }
  await sharp({
    create: {
      width: COLS * ANCHO,
      height: Math.ceil(usados.length / COLS) * (ALTO + ETIQ),
      channels: 3, background: '#fbf9f8',
    },
  }).composite(piezas).jpeg({ quality: 82 }).toFile(path.join(TRABAJO, 'pexels.jpg'));

  console.log(`\n${pendientes.length - fallos.length} descargadas · ${fallos.length} fallidas`);
  console.log('Revisa .fotos-trabajo/pexels.jpg y cambia las que no encajen con');
  console.log('  npm run fotos:pexels -- --variante=slug:1');
}

main().catch((e) => { console.error(e); process.exit(1); });
