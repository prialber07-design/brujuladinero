# Brújula Dinero

Web de finanzas personales y cripto, hecha con Astro.

## Arrancarla en local

```bash
npm run dev
```

Se abre en http://localhost:4321. Los cambios se ven al instante, sin recargar.

Para parar el servidor: `Ctrl + C` en el terminal.

## Escribir un artículo

Cada artículo es **un archivo Markdown** dentro de `src/content/articulos/`.

El **nombre del archivo es la URL**. Por ejemplo `fondo-de-emergencia.md` se
publica en `brujuladinero.com/fondo-de-emergencia/`.

Reglas del nombre: minúsculas, sin acentos, sin ñ, palabras separadas por guiones.

Arriba del todo va la ficha del artículo:

```yaml
---
titulo: 'Máximo 70 caracteres o Google lo corta'
descripcion: 'Entre 80 y 160 caracteres. Es lo que se lee en los resultados de búsqueda.'
categoria: 'finanzas-personales'   # o cripto-desde-cero / fiscalidad-y-seguridad / actualidad-explicada
fecha: 2026-08-05
autor: 'Alberto'
borrador: true            # true = no se publica
faltaAporteReal: true     # true = todavía no lleva nada tuyo
---
```

Si te equivocas en algo (categoría inventada, descripción muy corta), la web
avisa con un error al arrancar. Es a propósito: mejor fallar en local que
publicar algo roto.

## Antes de publicar cada artículo

1. **Verifica los datos.** Cifras, normativa, fechas. En finanzas un dato falso
   hace daño al dominio entero.
2. **Añade tu párrafo.** Tu experiencia real, lo que te pasó, lo que te costó.
   Es lo único que no se puede copiar.
3. Cambia `borrador: false` y `faltaAporteReal: false`.

Mientras cualquiera de los dos esté en `true`, verás un aviso naranja en local.
Ese aviso **no se ve en la web publicada** — es solo tu red de seguridad.

## Publicar los cambios

```bash
git add -A
git commit -m "Nuevo artículo: fondo de emergencia"
git push
```

Cuando esté conectado Cloudflare Pages, el `push` despliega la web solo en
menos de un minuto.

## Cambiar el nombre o el dominio

Todo está en `site.config.ts`. Es el único archivo que hay que tocar.

## Pendiente

- [ ] Rellenar los `[...]` de las tres páginas legales
- [ ] Escribir la página «Sobre mí» con datos reales y foto
- [ ] Conectar el repositorio a Cloudflare Pages
- [ ] Google Search Console y Analytics (rellenar `gaId` en `site.config.ts`)
- [ ] AdSense — cuando haya 30-40 artículos publicados
