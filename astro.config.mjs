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
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [envolverTablas],
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
