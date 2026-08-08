/**
 * Repasa qué queda pendiente antes de solicitar AdSense.
 *
 *   npm run revisar
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (p) => readFileSync(resolve(raiz, p), 'utf8');

const problemas = [];
const avisos = [];
const ok = [];

// ── Datos del titular ────────────────────────────────────────────
const config = leer('site.config.ts');

// Acotado al bloque TITULAR: si se busca en todo el archivo, `nombre`
// coincide antes con SITE.nombre y da un falso correcto.
const bloqueTitular = (config.match(/export const TITULAR = \{([\s\S]*?)\n\} as const;/) ?? [, ''])[1];
const campo = (n) => (bloqueTitular.match(new RegExp(`\\b${n}:\\s*'([^']*)'`)) ?? [, ''])[1];

for (const [nombre, etiqueta] of [
  ['nombre', 'Nombre y apellidos del titular'],
  ['nif', 'NIF del titular'],
  ['direccion', 'Domicilio del titular'],
]) {
  if (!campo(nombre)) problemas.push(`Falta ${etiqueta} — site.config.ts, bloque TITULAR`);
  else ok.push(`${etiqueta}: ${campo(nombre)}`);
}

// ── Artículos ────────────────────────────────────────────────────
const dir = resolve(raiz, 'src/content/articulos');
const articulos = readdirSync(dir).filter((f) => f.endsWith('.md'));

const borradores = [];
const sinAporte = [];

for (const f of articulos) {
  const t = readFileSync(resolve(dir, f), 'utf8');
  if (/^borrador:\s*true/m.test(t)) borradores.push(f.replace('.md', ''));
  if (/^faltaAporteReal:\s*true/m.test(t)) sinAporte.push(f.replace('.md', ''));
}

ok.push(`Artículos totales: ${articulos.length}`);
ok.push(`Publicados: ${articulos.length - borradores.length}`);

if (articulos.length - borradores.length < 30) {
  avisos.push(
    `Solo ${articulos.length - borradores.length} artículos publicados. ` +
      `AdSense suele rechazar por contenido insuficiente por debajo de 30-40.`,
  );
}

if (sinAporte.length) {
  avisos.push(
    `${sinAporte.length} artículos sin tu aportación personal ni datos verificados:\n` +
      sinAporte.map((s) => `      · ${s}`).join('\n'),
  );
}

// ── Otros requisitos ─────────────────────────────────────────────
if (leer('public/ads.txt').includes('pub-')) ok.push('ads.txt relleno');
else problemas.push('ads.txt sin identificador de editor');

if (/scriptEnCabecera:\s*true/.test(config)) ok.push('Script de AdSense activo');
else avisos.push('Script de AdSense desactivado (scriptEnCabecera)');

if (/unidadesActivas:\s*true/.test(config)) {
  avisos.push('unidadesActivas está en true: solo debe activarse tras la aprobación');
} else {
  ok.push('Unidades de anuncio desactivadas (correcto hasta la aprobación)');
}

avisos.push(
  'Comprueba a mano: CMP certificada activada en AdSense > Privacidad y mensajes.\n' +
    '      El banner propio NO cumple ese requisito para tráfico del EEE.',
);

// ── Salida ───────────────────────────────────────────────────────
const linea = '─'.repeat(64);
console.log(`\n${linea}\n  ESTADO DEL PROYECTO\n${linea}\n`);

console.log('  CORRECTO');
ok.forEach((s) => console.log(`   ✓ ${s}`));

if (avisos.length) {
  console.log('\n  PENDIENTE');
  avisos.forEach((s) => console.log(`   • ${s}`));
}

if (problemas.length) {
  console.log('\n  BLOQUEANTE');
  problemas.forEach((s) => console.log(`   ✗ ${s}`));
}

console.log(`\n${linea}`);
console.log(
  problemas.length
    ? `  ${problemas.length} problema(s) que impiden solicitar AdSense\n`
    : '  Sin bloqueantes. Revisa lo pendiente antes de solicitar.\n',
);

process.exit(problemas.length ? 1 : 0);
