# ── Fase 1: construir el sitio ────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Se copian primero los manifiestos para que Docker pueda cachear
# la instalación: si no cambian, no se reinstala nada.
COPY package.json package-lock.json ./
# Sin devDependencies: resvg-js solo hace falta para regenerar la imagen
# social a mano, no para construir el sitio.
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# ── Fase 2: servir los archivos estáticos ─────────────────────────
# La imagen final solo lleva nginx y el HTML generado: ni Node, ni
# node_modules, ni código fuente. Pesa unos 50 MB.
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# La imagen se ejecuta como `nginx`, por lo que el PID no puede quedarse en
# /run (propiedad de root). Se cambia en la configuración principal para no
# duplicar la directiva `pid` al arrancar.
RUN sed -i 's#pid        /run/nginx.pid;#pid        /tmp/nginx.pid;#' /etc/nginx/nginx.conf

# nginx en Alpine ya trae un usuario sin privilegios
RUN chown -R nginx:nginx /var/cache/nginx /usr/share/nginx/html
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8080/ || exit 1

# El pid va a /tmp y no a /var/run: con el sistema de archivos en solo
# lectura, /var/run se monta como tmpfs y cualquier fichero creado al
# construir la imagen desaparecería al arrancar el contenedor.
CMD ["nginx", "-g", "daemon off;"]
