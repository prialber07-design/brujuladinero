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

/**
 * Reescribe los enlaces internos del Markdown para que respeten la subcarpeta
 * desde la que se sirve el sitio. Así los artículos se siguen escribiendo con
 * /mi-articulo/ y funcionan igual en la raíz que bajo /brujuladinero/.
 */
function ajustarEnlacesInternos({ base }) {
  const prefijo = base.endsWith('/') ? base : base + '/';
  return (arbol) => {
    if (prefijo === '/') return;
    visit(arbol, 'element', (nodo) => {
      if (nodo.tagName !== 'a') return;
      const href = nodo.properties?.href;
      // Solo rutas internas absolutas. Se dejan intactas las externas,
      // los anclas y las que ya llevan el prefijo.
      if (typeof href !== 'string') return;
      if (!href.startsWith('/') || href.startsWith('//')) return;
      if (href.startsWith(prefijo)) return;
      nodo.properties.href = prefijo + href.slice(1);
    });
  };
}

const BASE = process.env.BASE_PATH ?? '/';

export default defineConfig({
  // SITE_URL: dominio público. En despliegues de prueba se sobreescribe para
  // que canonical y sitemap no apunten al dominio final.
  site: process.env.SITE_URL ?? 'https://brujuladinero.com',
  // BASE_PATH: subcarpeta desde la que se sirve. GitHub Pages en un
  // repositorio de proyecto sirve desde /nombre-del-repo/. Con dominio propio
  // o en Cloudflare se queda en '/'.
  base: BASE,
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
    rehypePlugins: [envolverTablas, [ajustarEnlacesInternos, { base: BASE }]],
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
