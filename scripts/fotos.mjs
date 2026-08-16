/**
 * Curador de fotografía real para las cabeceras de los artículos.
 *
 *   npm run fotos
 *
 * Busca en Openverse (agregador de imágenes con licencia Creative Commons),
 * filtrando a licencias que permiten uso comercial y obra derivada —hace
 * falta poder recortar la foto—. Descarga a src/assets/fotos/ para que Astro
 * las procese con sharp: recorte, redimensión y WebP automáticos.
 *
 * Las búsquedas piden fotografía documental: luz natural, objetos reales,
 * tonos apagados. Nada de renders 3D ni tecnología con luces de neón, que es
 * exactamente el aspecto que delata una web hecha con prisa.
 *
 * La atribución de cada foto queda en src/data/fotos.json y se imprime bajo
 * la imagen: las licencias CC-BY lo exigen.
 */
import { writeFile, mkdir, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const RAIZ = path.join(import.meta.dirname, '..');
const DESTINO = path.join(RAIZ, 'src', 'assets', 'fotos');
const REGISTRO = path.join(RAIZ, 'src', 'data', 'fotos.json');

// by-sa y by-nd quedan fuera a propósito: sa obligaría a licenciar la web
// entera igual, y nd prohíbe recortar la foto al formato de la tarjeta.
const LICENCIAS = 'cc0,pdm,by';

const BUSQUEDAS = {
  // ── Finanzas personales ─────────────────────────────────────
  'ahorrar-para-objetivos': 'jar handwritten label lid',
  'como-leer-tu-nomina': 'payslip paper document desk',
  'cuenta-sin-comisiones': 'old bank counter interior',
  'fondo-de-emergencia': 'savings jar coins lid',
  'gastos-hormiga': 'coffee cup receipt cafe table',
  'hipoteca-fija-o-variable': 'key in door lock house',
  'interes-compuesto': 'hourglass sand window light',
  'presupuesto-mensual': 'notebook pen handwriting desk',
  'regla-50-30-20': 'pencil paper notebook planning',
  'salir-de-deudas': 'heavy chain links metal',
  'seguros-necesarios': 'umbrella rain street',

  // ── Cripto desde cero ───────────────────────────────────────
  'comisiones-cripto': 'cash register receipt printing',
  'comprar-primera-cripto': 'person laptop coffee shop window',
  'que-es-bitcoin': 'physical bitcoin coin wooden table',
  'que-es-ethereum': 'network cables patch panel',
  'que-es-una-stablecoin': 'brass balance scale',
  'volatilidad-cripto': 'stormy sea waves grey',
  'wallet-vs-exchange': 'safe deposit box keys',

  // ── Fiscalidad y seguridad ──────────────────────────────────
  'declaracion-de-la-renta': 'tax form paperwork desk',
  'declarar-criptomonedas': 'calculator documents desk',
  'estafas-cripto': 'warning tape barrier street',
  'proteger-tus-cuentas': 'old padlock metal door',
  'que-hacer-si-te-estafan': 'person window rain thinking',
  'que-sabe-hacienda-de-ti': 'stack of paper documents office',

  // ── Actualidad explicada ────────────────────────────────────
  'impuestos-que-pagas': 'supermarket receipt groceries',
  'inflacion': 'price tag supermarket shelf close',
  'que-es-la-bolsa': 'stock exchange building columns',
  'que-es-mica': 'european parliament building brussels',
  'que-es-una-recesion': 'closed shop shutter street',
  'tipos-de-interes': 'european central bank frankfurt building',
};

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function consultar(filtros, yaUsadas) {
  const url =
    'https://api.openverse.org/v1/images/?' +
    new URLSearchParams({ license: LICENCIAS, mature: 'false', page_size: '20', ...filtros });

  const res = await fetch(url, { headers: { 'User-Agent': 'brujuladinero/1.0' } });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const { results = [] } = await res.json();

  // Descarta las ya usadas: 30 artículos con la misma foto sería peor
  // que no poner ninguna.
  return results.find((f) => f.url && !yaUsadas.has(f.id));
}

/**
 * Escalera de reintentos. Pedir a la vez apaisada + grande + licencia
 * comercial deja fuera casi todo el catálogo, así que se afloja por pasos:
 * primero el formato, luego el tamaño y por último se recorta la consulta a
 * sus dos primeras palabras, que es donde está el asunto de la foto.
 */
async function buscar(consulta, yaUsadas) {
  const corta = consulta.split(' ').slice(0, 2).join(' ');
  const intentos = [
    { q: consulta, aspect_ratio: 'wide', size: 'large' },
    { q: consulta, aspect_ratio: 'wide' },
    { q: consulta },
    { q: corta, aspect_ratio: 'wide' },
    { q: corta },
  ];

  for (const filtros of intentos) {
    const foto = await consultar(filtros, yaUsadas);
    if (foto) return foto;
    await dormir(600);
  }
  return null;
}

async function descargar(url, destino) {
  const res = await fetch(url, { headers: { 'User-Agent': 'brujuladinero/1.0' } });
  if (!res.ok) throw new Error(`descarga ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10_000) throw new Error(`archivo sospechosamente pequeño (${buf.length} B)`);
  await writeFile(destino, buf);
  return buf.length;
}

async function main() {
  await mkdir(DESTINO, { recursive: true });
  await mkdir(path.dirname(REGISTRO), { recursive: true });

  const registro = existsSync(REGISTRO)
    ? JSON.parse(await readFile(REGISTRO, 'utf8'))
    : {};
  const yaUsadas = new Set(Object.values(registro).map((f) => f.id));

  // `npm run fotos -- --rehacer slug1,slug2` fuerza volver a elegir foto:
  // descargar no es curar, y algunas no valen hasta que se miran.
  const rehacer = process.argv.find((a) => a.startsWith('--rehacer='));
  if (rehacer) {
    for (const slug of rehacer.split('=')[1].split(',')) {
      delete registro[slug];
      const f = path.join(DESTINO, `${slug}.jpg`);
      if (existsSync(f)) await rm(f);
    }
  }

  const pendientes = Object.entries(BUSQUEDAS).filter(
    ([slug]) => !registro[slug] || !existsSync(path.join(DESTINO, `${slug}.jpg`)),
  );

  if (pendientes.length === 0) {
    console.log('Todas las fotos ya están descargadas.');
    return;
  }
  console.log(`Buscando ${pendientes.length} fotos…\n`);

  let ok = 0;
  const fallos = [];

  for (const [slug, consulta] of pendientes) {
    try {
      const foto = await buscar(consulta, yaUsadas);
      if (!foto) throw new Error('sin resultados nuevos');

      const bytes = await descargar(foto.url, path.join(DESTINO, `${slug}.jpg`));
      yaUsadas.add(foto.id);
      registro[slug] = {
        id: foto.id,
        titulo: foto.title ?? '',
        autor: foto.creator ?? 'Autor desconocido',
        autorUrl: foto.creator_url ?? '',
        licencia: `CC ${String(foto.license).toUpperCase()} ${foto.license_version ?? ''}`.trim(),
        licenciaUrl: foto.license_url ?? '',
        origen: foto.foreign_landing_url ?? '',
        consulta,
      };
      ok++;
      console.log(`  ✓ ${slug.padEnd(26)} ${(bytes / 1024).toFixed(0).padStart(5)} KB  ${registro[slug].licencia}`);
    } catch (err) {
      fallos.push([slug, err.message]);
      console.log(`  ✗ ${slug.padEnd(26)} ${err.message}`);
    }
    // Openverse limita las peticiones anónimas: se va con calma.
    await dormir(1200);
  }

  await writeFile(REGISTRO, JSON.stringify(registro, null, 2) + '\n', 'utf8');

  console.log(`\n${ok} descargadas · ${fallos.length} fallidas`);
  if (fallos.length) {
    console.log('Vuelve a lanzarlo para reintentar solo las que faltan.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
