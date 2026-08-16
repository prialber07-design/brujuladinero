import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articulos' }),
  schema: z.object({
    titulo: z.string().max(70, 'El título SEO se corta pasados ~60-70 caracteres'),
    descripcion: z.string().min(80).max(160, 'La meta descripción se corta a los 160 caracteres'),
    categoria: z.enum([
      'finanzas-personales',
      'cripto-desde-cero',
      'fiscalidad-y-seguridad',
      'actualidad-explicada',
    ]),
    fecha: z.coerce.date(),
    actualizado: z.coerce.date().optional(),
    autor: z.string().default('Alberto'),

    // Borrador: no se publica ni aparece en sitemap/RSS.
    // Orden de lectura dentro de su sección. La fecha sirve para "lo último",
    // pero en guías atemporales no dice nada: quien llega a "cripto desde
    // cero" quiere empezar por qué es Bitcoin, no por lo último publicado.
    // Menor va antes. 50 es el valor de en medio, para los que dan igual.
    orden: z.number().int().min(1).max(99).default(50),
    borrador: z.boolean().default(false),
    // Marca los artículos que aún NO tienen tu experiencia personal añadida.
    // Es tu red de seguridad: no publiques nada con esto en true.
    faltaAporteReal: z.boolean().default(true),

    palabraClave: z.string().optional(),

    // Ilustración de cabecera. Nombre de uno de los dibujos definidos en
    // src/components/Ilustracion.astro. Toma el color de la categoría.
    ilustracion: z
      .enum([
        'caja-fuerte', 'reparto', 'crecimiento', 'descenso', 'tarjeta',
        'calendario', 'documento', 'escalera', 'monedas', 'casa', 'paraguas',
        'diana', 'red', 'bloques', 'llave', 'candado', 'balanza', 'onda',
        'alerta', 'escudo', 'lupa', 'pasos',
        'goteo', 'cesta', 'nomina', 'calculadora', 'reloj', 'tarta', 'velas', 'dial',
      ])
      .optional(),
    /** Texto alternativo de la ilustración. Debe describir lo que se ve. */
    ilustracionAlt: z.string().optional(),

    // Caja de "Puntos clave" al inicio. Entre 3 y 4 viñetas.
    puntosClave: z.array(z.string()).max(5).optional(),

    // Fuentes citadas. En un nicho YMYL es de lo que más confianza aporta,
    // tanto al lector como a Google.
    //   organismo: quién publica el dato (AEAT, CNMV, Banco de España…)
    //   consultado: cuándo lo comprobaste. La normativa cambia y el lector
    //              necesita saber a qué fecha corresponde lo que lee.
    fuentes: z
      .array(
        z.object({
          texto: z.string(),
          url: z.string().url().optional(),
          organismo: z.string().optional(),
          consultado: z.coerce.date().optional(),
        }),
      )
      .optional(),

    // Activa el aviso legal de enlaces de afiliado. Obligatorio si los usas.
    tieneAfiliados: z.boolean().default(false),

    // GEO: respuesta directa de 2-3 frases al inicio. Es el fragmento que los
    // motores de IA extraen y citan, y el que Google usa para el snippet.
    resumen: z.string().min(120).max(400).optional(),

    // Preguntas frecuentes. Generan FAQPage en datos estructurados, que es
    // de lo que más se apoya la IA para responder y citar la fuente.
    faq: z
      .array(z.object({ pregunta: z.string(), respuesta: z.string() }))
      .optional(),

    // Sinónimos y términos que cubre el artículo. Alimenta `keywords` y `about`.
    temas: z.array(z.string()).optional(),
  }),
});

export const collections = { articulos };
