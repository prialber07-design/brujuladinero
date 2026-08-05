import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../../site.config';

export async function GET(context) {
  const articulos = (await getCollection('articulos', ({ data }) => !data.borrador)).sort(
    (a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf(),
  );

  return rss({
    title: SITE.nombre,
    description: SITE.descripcion,
    site: context.site ?? SITE.url,
    items: articulos.map((a) => ({
      title: a.data.titulo,
      description: a.data.descripcion,
      pubDate: a.data.fecha,
      link: `/${a.id}/`,
    })),
    customData: `<language>es-es</language>`,
  });
}
