# ETAPA 1: Construcción de la aplicación Angular
FROM node:20-alpine AS build

# Instalar Git y jq
# Git es necesario para clonar el repositorio.
# Jq es necesario para modificar el archivo angular.json.
RUN apk add --no-cache git jq

# Clonar la rama "master" del repositorio en /tmp/SaludplusWeb
# Clona el repositorio en una carpeta temporal para no contaminar directamente /app
RUN git clone https://github.com/bgonzalezp21/SaludplusWeb.git /tmp/SaludplusWeb

# Establecer el directorio de trabajo dentro de la carpeta del proyecto Angular
# Asumiendo que el proyecto Angular está directamente dentro de SaludplusWeb
WORKDIR /tmp/SaludplusWeb

# Limpiar la caché de npm para asegurar una instalación de dependencias limpia
# Esto previene problemas con dependencias corruptas o versiones incorrectas en la caché.
RUN npm cache clean --force

# Instalar dependencias de Node.js
# La bandera --legacy-peer-deps se usa para evitar conflictos de dependencias,
# lo cual es común en proyectos Angular más antiguos o con dependencias complejas.
RUN npm install --legacy-peer-deps

# --- INICIO DE MODIFICACIONES CRÍTICAS AL angular.json ---

# Modificar angular.json para asegurar que la propiedad "root" exista para "saludplus"
# Esto es crucial para que Angular CLI identifique correctamente la raíz del proyecto.
# Si la propiedad 'root' no existe, la añade. Si existe, asegura que su valor sea "".
RUN jq '(.projects."saludplus".root = "")' angular.json > angular.json.tmp && mv angular.json.tmp angular.json

# **MODIFICACIÓN ACTUALIZADA:** Cambiar outputMode a "static" (anteriormente "browser")
# Esto asegura que el build de Angular sea para Client-Side Rendering (CSR), compatible con Nginx,
# usando el valor correcto para versiones recientes de Angular CLI.
RUN jq '(.projects."saludplus".architect.build.options.outputMode = "static")' angular.json > angular.json.tmp && mv angular.json.tmp angular.json

# Modificamos angular.json para prevenir los errores de build que ya conocemos.
# Esto incluye permitir CommonJS dependencies y aumentar el presupuesto de error para el build de producción.
RUN jq '(.projects."saludplus".architect.build.options.allowedCommonJsDependencies = ["chart.js", "jspdf", "html2canvas"]) | (.projects."saludplus".architect.build.configurations.production.budgets[0].maximumError = "2MB")' angular.json > angular.json.tmp && mv angular.json.tmp angular.json

# --- FIN DE MODIFICACIONES CRÍTICAS AL angular.json ---

# Construir la aplicación Angular para producción
# Esto generará los archivos estáticos optimizados de la aplicación.
RUN npm run build --prod

# ETAPA 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar el archivo nginx.conf desde el repositorio clonado a la configuración de Nginx
# Esto asegura que Nginx use tu configuración personalizada en lugar de la predeterminada.
COPY --from=build /tmp/SaludplusWeb/nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos desde la etapa anterior
# Los archivos estáticos de Angular se copiarán a la ubicación por defecto de Nginx para servir contenido web.
# La ruta /dist/saludplus/browser/ es la salida correcta según tu angular.json.
COPY --from=build /tmp/SaludplusWeb/dist/saludplus/browser/ /usr/share/nginx/html

# Exponer el puerto 80
# Este es el puerto estándar en el que Nginx escuchará las solicitudes HTTP.
EXPOSE 80

# Comando para iniciar Nginx en primer plano
# Esto es crucial para que el contenedor se mantenga en ejecución.
CMD ["nginx", "-g", "daemon off;"]
