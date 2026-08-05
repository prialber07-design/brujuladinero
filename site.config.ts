// Configuración central del sitio.
// Si cambias de dominio o de nombre, este es el ÚNICO archivo que tocas.

export const SITE = {
  nombre: 'Brújula Dinero',
  descripcion: 'Finanzas personales y cripto explicadas desde cero, para España.',
  url: 'https://brujuladinero.com',
  idioma: 'es-ES',
  autor: {
    nombre: 'Alberto',
    // Rellena esto antes de publicar: Google evalúa quién firma el contenido.
    bio: 'Documento mi propio aprendizaje sobre finanzas personales y criptomonedas desde cero.',
    email: 'hola@brujuladinero.com',
  },
  // Se rellena cuando AdSense te apruebe (paso posterior).
  adsense: {
    activo: false,
    publisherId: '', // formato: ca-pub-0000000000000000
  },
  analytics: {
    // ID de Google Analytics 4, formato G-XXXXXXXXXX
    gaId: '',
  },
} as const;

export const CATEGORIAS = [
  {
    slug: 'finanzas-personales',
    nombre: 'Finanzas personales',
    descripcion: 'Ahorro, presupuesto, cuentas y todo lo que afecta a tu dinero del día a día.',
  },
  {
    slug: 'cripto-desde-cero',
    nombre: 'Cripto desde cero',
    descripcion: 'Criptomonedas explicadas sin jerga, para quien empieza sin saber nada.',
  },
  {
    slug: 'fiscalidad-y-seguridad',
    nombre: 'Fiscalidad y seguridad',
    descripcion: 'Cómo declarar, cómo protegerte y cómo no perder tu dinero por un descuido.',
  },
  {
    slug: 'actualidad-explicada',
    nombre: 'Actualidad explicada',
    descripcion: 'Lo que sale en las noticias, explicado para que sepas si te afecta.',
  },
] as const;

export type CategoriaSlug = (typeof CATEGORIAS)[number]['slug'];
