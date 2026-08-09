// Configuración central del sitio.
// Si cambias de dominio o de nombre, este es el ÚNICO archivo que tocas.

// URL pública servida desde el VPS.
const URL_SITIO = 'https://brujuladinero.com';

export const SITE = {
  nombre: 'Brújula Dinero',
  descripcion: 'Finanzas personales y cripto explicadas desde cero, para España.',
  url: URL_SITIO,
  idioma: 'es-ES',
  autor: {
    nombre: 'Alberto Pérez Lafuente',
    // Rellena esto antes de publicar: Google evalúa quién firma el contenido.
    bio: 'Documento mi propio aprendizaje sobre finanzas personales y criptomonedas desde cero.',
    email: 'prialber07@gmail.com',
  },
  adsense: {
    publisherId: 'ca-pub-2108212339865549',
    // Carga el script en el <head>. Es lo que AdSense necesita encontrar
    // para verificar el sitio y para revisarlo. Debe estar en true desde
    // que solicitas la aprobación.
    scriptEnCabecera: true,
    // Pinta bloques de anuncio reales dentro de los artículos.
    // Actívalo SOLO cuando AdSense te haya aprobado: antes no se muestra
    // nada y solo añade peticiones inútiles.
    unidadesActivas: false,

    // Ponlo en true cuando hayas publicado el mensaje de consentimiento en
    // AdSense > Privacidad y mensajes.
    //
    // Google exige una CMP certificada e integrada con el estándar TCF para
    // servir anuncios en el EEE, Reino Unido y Suiza. El banner propio de
    // esta web NO lo es, así que la de Google pasa a ser la que manda.
    //
    // Con esto en true:
    //   · Deja de mostrarse el banner propio (evita ver dos a la vez)
    //   · El enlace del pie abre el panel de Google
    //   · El consentimiento lo gestiona Google de extremo a extremo
    cmpGoogle: true,
  },
  analytics: {
    // ID de Google Analytics 4, formato G-XXXXXXXXXX
    gaId: '',
  },
  // Imagen para redes sociales. Colócala en /public/og-default.png (1200x630).
  imagenSocial: '/og-default.png',
  // GEO: si los rastreadores de IA (ChatGPT, Claude, Perplexity, Gemini)
  // pueden leer el sitio. En true te pueden citar; en false proteges el
  // contenido pero desapareces de las respuestas generadas.
  permitirRastreadoresIA: true,
} as const;

/**
 * ─────────────────────────────────────────────────────────────────
 *  RELLENA ESTO. Es lo único que falta para que las páginas legales
 *  sean válidas. Se propaga solo al aviso legal, la política de
 *  privacidad y la de cookies.
 *
 *  La LSSI-CE obliga a identificar al titular de un sitio web con
 *  contenido publicado.
 * ─────────────────────────────────────────────────────────────────
 */
export const TITULAR = {
  /** Nombre y apellidos completos, como en tu DNI. */
  nombre: 'Alberto Pérez Lafuente',
  /** NIF / DNI con la letra. */
  nif: '73469819E',
  /** Domicilio a efectos de notificaciones. Basta municipio y provincia. */
  direccion: 'Alférez Rojas 52, 50017 Zaragoza',
  /** Correo de contacto. Debe funcionar: es por donde se ejercen los derechos RGPD. */
  email: 'prialber07@gmail.com',
  /** Infraestructura donde se aloja el sitio. */
  hosting: 'Servidor VPS propio',
  /** Fecha de la última revisión de los textos legales. */
  actualizacion: '2026-08-07',
} as const;

/** true cuando falta algún dato obligatorio del titular. */
export const FALTAN_DATOS_TITULAR =
  !TITULAR.nombre || !TITULAR.nif || !TITULAR.direccion;

/** Devuelve el dato o un marcador visible si está sin rellenar. */
export function dato(valor: string, etiqueta: string): string {
  return valor.trim() || `[PENDIENTE: ${etiqueta}]`;
}

/**
 * Cada categoría tiene su propio color, para que las cuatro secciones se
 * distingan de un vistazo. Todos verificados con contraste WCAG AA sobre
 * el fondo correspondiente.
 *   claro  → para el modo claro
 *   oscuro → versión aclarada, legible sobre fondo oscuro
 *   suave  → fondo de la etiqueta en modo claro
 */
export const CATEGORIAS = [
  {
    slug: 'finanzas-personales',
    nombre: 'Finanzas personales',
    corto: 'Finanzas',
    descripcion: 'Ahorro, presupuesto, cuentas y todo lo que afecta a tu dinero del día a día.',
    gancho: 'Empieza aquí si quieres ordenar tu dinero.',
    color: { claro: '#1f6f5c', oscuro: '#5fc4a4', suave: '#e6f2ee' },
  },
  {
    slug: 'cripto-desde-cero',
    nombre: 'Cripto desde cero',
    corto: 'Cripto',
    descripcion: 'Criptomonedas explicadas sin jerga, para quien empieza sin saber nada.',
    gancho: 'Sin promesas y sin tecnicismos.',
    color: { claro: '#0f6b7d', oscuro: '#5cbdd1', suave: '#e3f1f4' },
  },
  {
    slug: 'fiscalidad-y-seguridad',
    nombre: 'Fiscalidad y seguridad',
    corto: 'Fiscalidad',
    descripcion: 'Cómo declarar, cómo protegerte y cómo no perder tu dinero por un descuido.',
    gancho: 'Lo que evita disgustos caros.',
    color: { claro: '#8c4033', oscuro: '#e29685', suave: '#f7e9e5' },
  },
  {
    slug: 'actualidad-explicada',
    nombre: 'Actualidad explicada',
    corto: 'Actualidad',
    descripcion: 'Lo que sale en las noticias, explicado para que sepas si te afecta.',
    gancho: 'Los titulares, traducidos.',
    color: { claro: '#7a5510', oscuro: '#d9ab4a', suave: '#f6eeda' },
  },
] as const;

export type CategoriaSlug = (typeof CATEGORIAS)[number]['slug'];
