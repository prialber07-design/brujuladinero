/**
 * Vigilancia de frescura del contenido.
 *
 *   npm run vigilar            informe en consola
 *   npm run vigilar -- --md    en Markdown, para la incidencia de GitHub
 *
 * No publica ni borra nada: solo dice qué hay que revisar. Un artículo de
 * fiscalidad con dos años y sin tocar hace más daño que no tenerlo, porque
 * afirma cosas que pueden haber cambiado.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(raiz, 'src/content/articulos');
const enMarkdown = process.argv.includes('--md');

/**
 * Cada categoría envejece a un ritmo distinto. La actualidad y la fiscalidad
 * caducan; el interés compuesto funciona igual dentro de diez años.
 */
const CADUCIDAD_DIAS = {
  'actualidad-explicada': 180,
  'fiscalidad-y-seguridad': 365,
  'cripto-desde-cero': 365,
  'finanzas-personales': 730,
};

const campo = (t, n) =>
  (t.match(new RegExp(`^${n}:\\s*'?([^'\\n]+)'?\\s*$`, 'm')) ?? [, ''])[1].trim();

const hoy = new Date();
const dias = (d) => Math.floor((hoy - new Date(d)) / 86400000);

const articulos = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const t = readFileSync(resolve(dir, f), 'utf8');
    const categoria = campo(t, 'categoria');
    const fecha = campo(t, 'fecha');
    const actualizado = campo(t, 'actualizado') || fecha;
    const limite = CADUCIDAD_DIAS[categoria] ?? 730;
    const edad = dias(actualizado);
    return {
      slug: f.replace('.md', ''),
      titulo: campo(t, 'titulo'),
      categoria,
      edad,
      limite,
      vencido: edad > limite,
      quedan: limite - edad,
      borrador: /^borrador:\s*true/m.test(t),
      sinAporte: /^faltaAporteReal:\s*true/m.test(t),
    };
  });

const vencidos = articulos.filter((a) => a.vencido && !a.borrador).sort((a, b) => b.edad - a.edad);
const proximos = articulos
  .filter((a) => !a.vencido && !a.borrador && a.quedan <= 60)
  .sort((a, b) => a.quedan - b.quedan);
const sinAporte = articulos.filter((a) => a.sinAporte && !a.borrador);
const borradores = articulos.filter((a) => a.borrador);

// ── Salida en Markdown, para la incidencia automática ────────────
if (enMarkdown) {
  const l = [];
  l.push(`Revisión automática del ${hoy.toLocaleDateString('es-ES')}.`, '');

  if (vencidos.length) {
    l.push(`## 🔴 Toca revisar (${vencidos.length})`, '');
    l.push('| Artículo | Sección | Sin revisar |', '|---|---|---|');
    vencidos.forEach((a) =>
      l.push(`| [${a.titulo}](../../src/content/articulos/${a.slug}.md) | ${a.categoria} | ${a.edad} días |`),
    );
    l.push('', 'Comprueba que los datos siguen vigentes y actualiza `actualizado:` con la fecha de hoy.', '');
  } else {
    l.push('## ✅ Ningún artículo vencido', '');
  }

  if (proximos.length) {
    l.push(`## 🟡 Vencen pronto (${proximos.length})`, '');
    proximos.forEach((a) => l.push(`- **${a.titulo}** — en ${a.quedan} días`));
    l.push('');
  }

  if (sinAporte.length) {
    l.push(`## ✍️ Publicados sin tu aportación personal (${sinAporte.length})`, '');
    l.push('Son los que más te diferencian de una web generada. Añade tu párrafo y pon `faltaAporteReal: false`.', '');
    sinAporte.slice(0, 12).forEach((a) => l.push(`- ${a.titulo}`));
    if (sinAporte.length > 12) l.push(`- …y ${sinAporte.length - 12} más`);
    l.push('');
  }

  if (borradores.length) {
    l.push(`## 📝 Borradores pendientes (${borradores.length})`, '');
    borradores.forEach((a) => l.push(`- ${a.titulo}`));
    l.push('');
  }

  l.push('---', '_Generado por `npm run vigilar`. No publica ni borra nada._');
  console.log(l.join('\n'));
  process.exit(0);
}

// ── Salida en consola ────────────────────────────────────────────
const linea = '─'.repeat(64);
console.log(`\n${linea}\n  FRESCURA DEL CONTENIDO\n${linea}\n`);
console.log(`  ${articulos.length} artículos · ${articulos.length - borradores.length} publicados\n`);

if (vencidos.length) {
  console.log(`  TOCA REVISAR (${vencidos.length})`);
  vencidos.forEach((a) =>
    console.log(`   ! ${a.slug} — ${a.edad} días (límite ${a.limite})`),
  );
} else {
  console.log('  Ningún artículo vencido');
}

if (proximos.length) {
  console.log(`\n  VENCEN PRONTO (${proximos.length})`);
  proximos.forEach((a) => console.log(`   · ${a.slug} — en ${a.quedan} días`));
}

if (sinAporte.length) {
  console.log(`\n  SIN APORTACIÓN PERSONAL: ${sinAporte.length} publicados`);
}

console.log(`\n${linea}`);
console.log(
  vencidos.length
    ? `  ${vencidos.length} artículo(s) requieren revisión\n`
    : '  Contenido al día\n',
);
