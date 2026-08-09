/**
 * Crea el esqueleto de un artículo nuevo, ya con ilustración asignada.
 *
 *   npm run nuevo -- "Cómo funciona el IBI" fiscalidad-y-seguridad
 *
 * Nace SIEMPRE como borrador y con faltaAporteReal en true. Publicar es una
 * decisión tuya, nunca del script: publicar en automático es lo que Google
 * penaliza como contenido generado a escala.
 */
import { writeFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const [titulo, categoria] = process.argv.slice(2);

const CATEGORIAS = [
  'finanzas-personales',
  'cripto-desde-cero',
  'fiscalidad-y-seguridad',
  'actualidad-explicada',
];

if (!titulo || !CATEGORIAS.includes(categoria)) {
  console.error('\nUso:  npm run nuevo -- "Título del artículo" <categoría>\n');
  console.error('Categorías:');
  CATEGORIAS.forEach((c) => console.error(`  · ${c}`));
  console.error('');
  process.exit(1);
}

/** Convierte un título en slug: minúsculas, sin acentos, con guiones. */
const aSlug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

/**
 * Elige la ilustración menos usada de las que encajan con la categoría, para
 * no repetir. Si todas están cogidas, avisa para que añadas una nueva.
 */
const AFINES = {
  'finanzas-personales': ['caja-fuerte', 'reparto', 'crecimiento', 'tarjeta', 'calendario', 'escalera', 'monedas', 'casa', 'paraguas', 'diana', 'goteo', 'nomina'],
  'cripto-desde-cero': ['red', 'bloques', 'llave', 'balanza', 'onda', 'pasos', 'monedas'],
  'fiscalidad-y-seguridad': ['documento', 'candado', 'alerta', 'lupa', 'escudo', 'calculadora', 'reloj'],
  'actualidad-explicada': ['onda', 'descenso', 'cesta', 'tarta', 'velas', 'dial', 'crecimiento', 'escudo'],
};

const dir = resolve(raiz, 'src/content/articulos');
const uso = new Map();
for (const f of readdirSync(dir)) {
  if (!f.endsWith('.md')) continue;
  const m = readFileSync(resolve(dir, f), 'utf8').match(/^ilustracion: '([a-z-]+)'/m);
  if (m) uso.set(m[1], (uso.get(m[1]) ?? 0) + 1);
}

// La menos usada de las afines a la categoría. Con todas asignadas la lista
// no se agota: simplemente reparte, en vez de caer siempre en la misma.
const candidatas = AFINES[categoria] ?? ['crecimiento'];
const ilustracion = candidatas
  .slice()
  .sort((a, b) => (uso.get(a) ?? 0) - (uso.get(b) ?? 0))[0];
const vecesUsada = uso.get(ilustracion) ?? 0;

const slug = aSlug(titulo);
const destino = resolve(dir, `${slug}.md`);

if (existsSync(destino)) {
  console.error(`\nYa existe: ${slug}.md\n`);
  process.exit(1);
}

const hoy = new Date().toISOString().slice(0, 10);

const plantilla = `---
titulo: '${titulo.replace(/'/g, "''")}'
descripcion: 'PENDIENTE: entre 80 y 160 caracteres. Es lo que se lee en los resultados de búsqueda de Google.'
categoria: '${categoria}'
fecha: ${hoy}
autor: 'Alberto'
borrador: true
faltaAporteReal: true
palabraClave: ''
ilustracion: '${ilustracion}'
ilustracionAlt: 'PENDIENTE: describe lo que se ve en el dibujo'
resumen: >-
  PENDIENTE: respuesta directa en 2-3 frases, mínimo 120 caracteres. Es el
  fragmento que ChatGPT, Perplexity y Google extraen para responder, así que
  escríbelo como si fuera lo único que alguien va a leer.
puntosClave:
  - 'PENDIENTE'
  - 'PENDIENTE'
  - 'PENDIENTE'
temas:
  - 'PENDIENTE'
faq:
  - pregunta: '¿PENDIENTE, tal y como lo escribiría alguien en Google?'
    respuesta: >-
      PENDIENTE: respuesta completa y autónoma, que se entienda sin haber leído
      el artículo. Debe ser idéntica a la que ve el usuario en la página.
fuentes:
  - texto: 'PENDIENTE: nombre de la página oficial'
    url: 'https://sede.agenciatributaria.gob.es'
    organismo: 'PENDIENTE'
    consultado: ${hoy}
tieneAfiliados: false
---

Primer párrafo: entra directo al problema del lector, sin preámbulos.

## Primera sección

Contenido.

## Resumen

- Punto uno
- Punto dos

<!--
════════════════════════════════════════════════════════════════════
ANTES DE PUBLICAR

  1. Sustituir todos los PENDIENTE
  2. Verificar cada dato en la fuente oficial
  3. Enlazar a 2-3 artículos del sitio
  4. Añadir TU párrafo: experiencia real, no genérica
  5. Poner borrador y faltaAporteReal en false

Ilustración asignada automáticamente: ${ilustracion}
Cámbiala si otra encaja mejor con el tema.
════════════════════════════════════════════════════════════════════
-->
`;

writeFileSync(destino, plantilla, 'utf8');

console.log(`\n✓ src/content/articulos/${slug}.md`);
console.log(`  categoría:   ${categoria}`);
console.log(`  ilustración: ${ilustracion}${vecesUsada ? `  (ya usada en ${vecesUsada}, revísala)` : ''}`);
console.log(`  URL futura:  /${slug}/`);
console.log('\n  Nace como BORRADOR. No se publica hasta que tú lo decidas.\n');
