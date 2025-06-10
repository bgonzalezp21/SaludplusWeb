# --- Etapa 1: Construcción (Build Stage) ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

COPY . .

# Compila la aplicación Angular para producción
RUN npm run build --configuration=production

# Renombra index.csr.html a index.html para que Nginx lo encuentre por defecto
RUN mv /app/dist/saludplusweb/browser/index.csr.html /app/dist/saludplusweb/browser/index.html

# --- Etapa 2: Servir (Serve Stage) ---
FROM nginx:alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist/saludplusweb/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]