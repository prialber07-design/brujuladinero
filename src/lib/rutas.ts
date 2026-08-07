/**
 * Construye rutas internas respetando la subcarpeta desde la que se sirve
 * el sitio (`base` en astro.config.mjs).
 *
 * En la raíz devuelve la ruta tal cual. Bajo GitHub Pages en un repositorio
 * de proyecto, antepone /nombre-del-repo/.
 *
 * Úsalo SIEMPRE en lugar de escribir href="/algo/" a mano: si no, el enlace
 * funciona en local y se rompe en producción.
 */
const BASE = import.meta.env.BASE_URL; // termina en '/' salvo que sea '/'

export function ruta(camino: string): string {
  const limpio = camino.startsWith('/') ? camino.slice(1) : camino;
  const base = BASE.endsWith('/') ? BASE : BASE + '/';
  return base + limpio;
}

/** Compara la ruta actual con una interna, ignorando la barra final. */
export function esRutaActual(actual: string, destino: string): boolean {
  const norm = (s: string) => (s.endsWith('/') ? s : s + '/');
  return norm(actual) === norm(ruta(destino));
}
