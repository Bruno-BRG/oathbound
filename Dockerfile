# Oathbound: static site served by nginx. No build step, no database.
FROM nginx:1.27-alpine

# Coolify passes the git commit here. It becomes the cache version in sw.js,
# so every deploy makes installed apps and browsers fetch the new files.
ARG SOURCE_COMMIT=dev
ARG COOLIFY_BUILD_ID=

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html manifest.webmanifest sw.js /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets

RUN V="$(echo "${SOURCE_COMMIT:-dev}" | cut -c1-12)" \
 && sed -i "s/const VERSION = '[^']*'/const VERSION = 'ob-${V}'/" /usr/share/nginx/html/sw.js \
 && grep -n "const VERSION" /usr/share/nginx/html/sw.js

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
