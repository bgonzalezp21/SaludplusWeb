# --- Etapa 1: Construcción (Build Stage) ---
# Usa una imagen base de Node.js para compilar la aplicación Angular
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias del proyecto (package.json y package-lock.json)
# y luego instala esas dependencias.
# Esto se hace primero para aprovechar el cacheo de capas de Docker.
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código fuente de la aplicación Angular
COPY . .

# Compila la aplicación Angular para producción
# El flag --output-hashing=all asegura que los nombres de los archivos compilados cambien con cada build,
# lo cual es bueno para el caching del navegador.
# --configuration=production optimiza la aplicación para el despliegue.
RUN npm run build -- --output-path=./dist/saludplusweb --configuration=production

# --- Etapa 2: Servir (Serve Stage) ---
# Usa una imagen ligera de Nginx para servir la aplicación estática
FROM nginx:alpine AS serve

# Copia la configuración personalizada de Nginx
# Crea este archivo si no lo tienes (ver Paso 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos de la aplicación Angular compilada desde la etapa de construcción
# Asegúrate de que esta ruta coincida con la ruta de salida de tu build (outputPath en angular.json)
COPY --from=build /app/dist/saludplusweb /usr/share/nginx/html

# Expone el puerto 80, que es el puerto por defecto de Nginx
EXPOSE 80

# El comando por defecto de Nginx para iniciar el servidor
CMD ["nginx", "-g", "daemon off;"]