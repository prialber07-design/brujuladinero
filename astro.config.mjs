// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

/**
 * Envuelve cada tabla del Markdown en un contenedor con scroll horizontal.
 * Sin esto, una tabla ancha rompe el diseño en móvil.
 */
function envolverTablas() {
  return (arbol) => {
    visit(arbol, 'element', (nodo, indice, padre) => {
      if (nodo.tagName !== 'table' || !padre || indice === undefined) return;
      if (padre.type === 'element' && padre.properties?.className?.includes?.('tabla-scroll')) return;
      padre.children[indice] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['tabla-scroll'] },
        children: [nodo],
      };
    });
  };
}

export default defineConfig({
  site: 'https://brujuladinero.com',
  base: '/',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES' } },
      serialize(item) {
        const ruta = new URL(item.url).pathname;

        if (ruta === '/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (/^\/(aviso-legal|politica-de-)/.test(ruta)) {
          // Obligatorias pero irrelevantes para el posicionamiento.
          item.priority = 0.2;
          item.changefreq = 'yearly';
        } else if (ruta.startsWith('/categoria/')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        } else {
          // Artículos y "Sobre mí": son el activo del sitio.
          item.priority = 0.9;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [envolverTablas],
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
