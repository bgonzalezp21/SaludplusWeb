# ETAPA 1: Construcción de la aplicación Angular
FROM node:20-alpine AS build

# Instalar herramientas necesarias
RUN apk add --no-cache git jq

# Clonar el repositorio desde GitHub
RUN git clone https://github.com/bgonzalezp21/SaludplusWeb.git /tmp/SaludplusWeb

# Ir a la carpeta del frontend
WORKDIR /tmp/SaludplusWeb/frontend

# Limpiar caché de npm y luego instalar dependencias
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Instalar Angular CLI globalmente para evitar errores de permisos
RUN npm install -g @angular/cli

# Modificaciones necesarias al angular.json
RUN jq '(.projects."saludplus".root = "")' angular.json > angular.json.tmp && mv angular.json.tmp angular.json
RUN jq '(.projects."saludplus".architect.build.options.outputMode = "static")' angular.json > angular.json.tmp && mv angular.json.tmp angular.json
RUN jq '(.projects."saludplus".architect.build.options.allowedCommonJsDependencies = ["chart.js", "jspdf", "html2canvas"]) | (.projects."saludplus".architect.build.configurations.production.budgets[0].maximumError = "2MB")' angular.json > angular.json.tmp && mv angular.json.tmp angular.json

# Compilar Angular para producción
RUN ng build --configuration=production

# ETAPA 2: Servir con Nginx
FROM nginx:alpine

# Copiar la configuración personalizada de nginx
COPY --from=build /tmp/SaludplusWeb/frontend/nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos estáticos compilados por Angular
COPY --from=build /tmp/SaludplusWeb/frontend/dist/saludplus/browser/ /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Mantener Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
