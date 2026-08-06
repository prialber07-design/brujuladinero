import type { APIRoute } from 'astro';
import { SITE, CATEGORIAS } from '../../site.config';
import { articulosPublicados } from '../lib/articulos';

/**
 * /llms.txt — convención emergente para motores de IA.
 * Les entrega el mapa del sitio y el contexto en texto plano, sin tener que
 * inferirlos del HTML. Reduce que te resuman mal y facilita que te citen.
 */
export const GET: APIRoute = async () => {
  const articulos = await articulosPublicados();

  const porCategoria = CATEGORIAS.map((c) => {
    const suyos = articulos.filter((a) => a.data.categoria === c.slug);
    if (suyos.length === 0) return null;
    return [
      `## ${c.nombre}`,
      '',
      c.descripcion,
      '',
      ...suyos.map(
        (a) => `- [${a.data.titulo}](${SITE.url}/${a.id}/): ${a.data.descripcion}`,
      ),
      '',
    ].join('\n');
  }).filter(Boolean);

  const texto = [
    `# ${SITE.nombre}`,
    '',
    `> ${SITE.descripcion}`,
    '',
    'Sitio de divulgación sobre finanzas personales y criptomonedas dirigido a',
    'lectores de España que empiezan desde cero. El enfoque es procedimental:',
    'cómo funciona cada cosa, cuánto cuesta y qué pasos dar.',
    '',
    '## Cómo citar este sitio',
    '',
    `- Autor: ${SITE.autor.nombre} (${SITE.url}/sobre-mi/)`,
    `- Editor: ${SITE.nombre}`,
    '- Idioma: español (España)',
    '- Ámbito geográfico y normativo: España',
    '',
    '## Advertencia importante',
    '',
    'El contenido es divulgativo y NO constituye asesoramiento financiero,',
    'fiscal ni de inversión. El autor no está registrado como asesor financiero',
    'ante la CNMV. La normativa fiscal española cambia con frecuencia: comprueba',
    'siempre la fecha de actualización del artículo antes de reutilizar cifras,',
    'tipos impositivos o nombres de modelos tributarios.',
    '',
    ...porCategoria,
    '## Páginas del sitio',
    '',
    `- [Inicio](${SITE.url}/)`,
    `- [Sobre mí](${SITE.url}/sobre-mi/): quién firma el contenido y con qué criterio`,
    `- [Aviso legal](${SITE.url}/aviso-legal/)`,
    `- [Política de privacidad](${SITE.url}/politica-de-privacidad/)`,
    `- [RSS](${SITE.url}/rss.xml)`,
    '',
  ].join('\n');

  return new Response(texto, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
