import { getCollection, type CollectionEntry } from 'astro:content';

export type Articulo = CollectionEntry<'articulos'>;

/**
 * Artículos publicados, del más reciente al más antiguo.
 * En desarrollo se ven también los borradores; en producción nunca.
 */
export async function articulosPublicados(): Promise<Articulo[]> {
  const todos = await getCollection('articulos', ({ data }) =>
    import.meta.env.DEV ? true : !data.borrador,
  );
  return todos.sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
}

/**
 * Artículos de una sección, en orden de lectura: primero lo básico y
 * después lo específico. A igualdad de orden manda la fecha.
 */
export async function articulosDeCategoria(slug: string): Promise<Articulo[]> {
  const todos = await articulosPublicados();
  return todos
    .filter((a) => a.data.categoria === slug)
    .sort(
      (a, b) =>
        a.data.orden - b.data.orden ||
        b.data.fecha.valueOf() - a.data.fecha.valueOf(),
    );
}

/** Tiempo de lectura estimado: ~200 palabras por minuto en castellano. */
export function minutosDeLectura(articulo: Articulo): number {
  const palabras = articulo.body?.split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(palabras / 200));
}
