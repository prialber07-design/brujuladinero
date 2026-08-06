import type { APIRoute } from 'astro';
import { SITE } from '../../site.config';

// Rastreadores de los motores de IA. Permitirlos es lo que hace posible que
// te citen en ChatGPT, Perplexity, Claude o los resúmenes de Google.
// El interruptor está en site.config.ts.
const RASTREADORES_IA = [
  'GPTBot',            // OpenAI — entrenamiento
  'OAI-SearchBot',     // OpenAI — búsqueda en ChatGPT
  'ChatGPT-User',      // OpenAI — navegación a petición del usuario
  'ClaudeBot',         // Anthropic
  'Claude-User',       // Anthropic — navegación a petición del usuario
  'PerplexityBot',     // Perplexity
  'Perplexity-User',
  'Google-Extended',   // Gemini y resúmenes con IA de Google
  'Applebot-Extended', // Apple Intelligence
  'CCBot',             // Common Crawl (alimenta a casi todos)
  'meta-externalagent',
];

export const GET: APIRoute = () => {
  const permitir = SITE.permitirRastreadoresIA;

  const bloques = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Rastreadores de motores de IA generativa.',
    permitir
      ? '# Permitidos: es lo que permite aparecer citado en sus respuestas.'
      : '# Bloqueados: el contenido queda fuera de las respuestas generadas.',
    ...RASTREADORES_IA.flatMap((bot) => [
      `User-agent: ${bot}`,
      permitir ? 'Allow: /' : 'Disallow: /',
      '',
    ]),
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    '',
  ];

  return new Response(bloques.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
