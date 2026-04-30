FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM httpd:alpine
# Enable required Apache modules
RUN sed -i \
    -e 's/^#\(LoadModule rewrite_module\)/\1/' \
    -e 's/^#\(LoadModule proxy_module\)/\1/' \
    -e 's/^#\(LoadModule proxy_http_module\)/\1/' \
    -e 's/^#\(LoadModule proxy_wstunnel_module\)/\1/' \
    -e 's/^#\(LoadModule ssl_module\)/\1/' \
    -e 's/^#\(LoadModule headers_module\)/\1/' \
    /usr/local/apache2/conf/httpd.conf && \
    echo "Include conf/extra/ThiDomV2.conf" >> /usr/local/apache2/conf/httpd.conf

COPY --from=build /app/dist/thidom/browser /usr/local/apache2/htdocs/browser/
COPY apache-docker.conf /usr/local/apache2/conf/extra/ThiDomV2.conf

EXPOSE 80
EXPOSE 443
