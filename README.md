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

# --- Opcional, pero es lo que hace que te citen ---
resumen: >-
  Respuesta directa en 2-3 frases. Sale en una caja al principio del artículo
  y es el fragmento que ChatGPT, Perplexity y Google extraen para responder.
  Escríbelo como si fuera la única frase que alguien va a leer.
temas: ['sinónimo uno', 'sinónimo dos']
faq:
  - pregunta: '¿Pregunta tal y como la escribiría alguien en Google?'
    respuesta: >-
      Respuesta completa y autónoma, que se entienda sin haber leído el
      artículo. Genera FAQPage en datos estructurados.
fuentes:
  - texto: 'Agencia Tributaria — nombre de la página'
    url: 'https://sede.agenciatributaria.gob.es'
    organismo: 'Agencia Tributaria'      # se muestra destacado
    consultado: 2026-08-07               # fecha en que lo comprobaste
tieneAfiliados: false
---
```

**Sobre las fuentes:** se muestran en una caja al final del artículo y además
alimentan el campo `citation` de los datos estructurados. Usa **solo fuentes
oficiales** —AEAT, CNMV, Banco de España, BCE, INCIBE, BOE—, nunca blogs ni
comparadores. En un nicho YMYL, citar a un blog resta en vez de sumar.

La fecha de `consultado` no es decorativa: le dice al lector a qué momento
corresponde lo que lee, y a ti te marca cuándo toca revisar.

**Regla que no puedes saltarte con las FAQ:** el texto de la respuesta debe ser
idéntico al que ve el usuario. Google aplica acción manual si marcas contenido
que no está visible en la página. Aquí se genera automáticamente de la misma
fuente, así que se cumple solo — pero no lo cambies.

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

## Despliegue con Docker

Alternativa a Cloudflare Pages, para servirlo tú desde un VPS.

```bash
docker compose up -d --build
```

Queda escuchando en `127.0.0.1:8080`. **Delante tiene que ir un proxy inverso**
(Caddy, Traefik o nginx en el host) que se encargue del HTTPS: el contenedor
solo sirve HTTP y a propósito no se expone al exterior.

Cómo está montado:

- **Dos fases**: Node compila el sitio, y la imagen final solo lleva nginx y el
  HTML. Ni Node, ni `node_modules`, ni código fuente. Unos 50 MB.
- **Sin privilegios**: corre como usuario `nginx`, sistema de archivos en solo
  lectura y `no-new-privileges`.
- **Caché**: los assets con hash se cachean un año; el HTML nunca, para que un
  despliegue se vea al instante.
- **404 real**: sin fallback a `index.html`. Es un sitio estático, no una SPA,
  y Google necesita que un 404 sea un 404.

Para actualizar tras escribir artículos: `docker compose up -d --build`.

Antes de activar HSTS en `nginx.conf`, comprueba que todo carga por HTTPS: si
lo activas antes de tiempo, los navegadores recordarán la cabecera durante un
año.

## Cambiar el nombre o el dominio

Todo está en `site.config.ts`. Es el único archivo que hay que tocar.

## SEO y GEO

Ya está resuelto en el código, no hay que tocarlo por artículo:

- **Datos estructurados**: `Organization`, `Person` y `WebSite` en todas las
  páginas; `Article`, `BreadcrumbList` y `FAQPage` en los artículos.
- **`/robots.txt`**: permite explícitamente a los rastreadores de IA (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended…). Se apaga con
  `permitirRastreadoresIA: false` en `site.config.ts`.
- **`/llms.txt`**: mapa del sitio en texto plano para motores de IA, con cómo
  citarte y la advertencia de que no es asesoramiento financiero.
- **`max-snippet:-1`**: autoriza fragmentos largos, necesario para que te citen
  un párrafo entero en vez de dos líneas.

Lo que sí depende de ti en cada artículo: escribir un buen `resumen` y unas
`faq` que respondan de verdad. Es lo que decide si te citan a ti o a otro.

## AdSense

El identificador de editor está en `site.config.ts`. Dos interruptores:

| Opción | Qué hace | Cuándo |
|---|---|---|
| `scriptEnCabecera` | Carga el script en el `<head>` | **Ya en true.** Google lo necesita ahí para verificar y revisar |
| `unidadesActivas` | Pinta bloques de anuncio en los artículos | **Ponlo en true solo cuando te aprueben** |

El `ads.txt` ya está relleno con tu identificador.

### Consentimiento — léelo antes de solicitar la aprobación

El sitio declara el **modo de consentimiento de Google con todo denegado por
defecto**, antes de que cargue el script. El banner lo actualiza si el usuario
acepta.

Eso es lo correcto técnicamente, **pero no basta legalmente**. Para servir
anuncios a tráfico del Espacio Económico Europeo, Google exige una **plataforma
de consentimiento certificada**. El banner propio de esta web no lo es.

Tienes que activar la CMP de Google —es gratuita— desde el panel de AdSense, en
**Privacidad y mensajes**. Cuando lo hagas, revisa que no se solape visualmente
con el banner propio: probablemente convenga quedarse solo con la de Google para
la parte publicitaria.

## Imagen para redes sociales

`public/og-default.png` (1200×630) se genera con:

```bash
npm run og
```

Es un script manual, no parte del build: la imagen es estática y no tiene
sentido re-renderizarla en cada despliegue. Si cambias el nombre del sitio o
el lema, vuelve a lanzarlo. El texto está al final de `scripts/generar-og.mjs`.

## Pendiente

- [ ] Rellenar los `[...]` de las tres páginas legales
- [ ] Escribir la página «Sobre mí» con datos reales y foto
- [ ] Conectar el repositorio a Cloudflare Pages
- [ ] Google Search Console y Analytics (rellenar `gaId` en `site.config.ts`)
- [ ] AdSense — cuando haya 30-40 artículos publicados
