SaludPlus Web Frontend 🚀
Este repositorio contiene la interfaz de usuario (frontend) de la aplicación SaludPlus Web, desarrollada con Angular. Está configurada para ser empaquetada y servida eficientemente usando Docker con Nginx, ¡lista para despegar!

Guía Rápida: Cómo Levantar el Proyecto 🛠️
¡Hola! Aquí te explico de forma sencilla cómo poner en marcha este proyecto de Angular con Nginx y Docker. Sigue estos pasos y estarás listo en poco tiempo.

🎯 0. Antes de Empezar: ¡Prepara tu Entorno!

Para asegurar un inicio sin problemas, verifica que tengas lo siguiente instalado en tu equipo:

Git: Imprescindible para clonar el código.

Si no lo tienes: Busca "install Git" para tu sistema operativo o visita la web oficial de Git.

Docker Desktop (para Windows o macOS) o Docker Engine (para Linux): La herramienta mágica para los contenedores.

Descárgalo directamente desde docker.com/products/docker-desktop.

Node.js (versión 20 o superior) y npm: El "cerebro" de Angular. Solo necesario si vas a desarrollar o depurar sin Docker.

Consíguelo en nodejs.org/es/download/.

Angular CLI: La poderosa herramienta de comandos de Angular. Solo necesario si vas a desarrollar o depurar sin Docker.

Abre tu terminal y ejecuta: npm install -g @angular/cli

📥 1. Descarga el Código

Vamos a obtener el proyecto en tu máquina.

Abre tu terminal.

Clona el repositorio de Git:

git clone https://github.com/bgonzalezp21/SaludplusWeb.git

Entra a la carpeta del proyecto que acabas de descargar:

cd SaludplusWeb

💻 2. Ejecutar en Modo Desarrollo (sin Docker)

Si solo quieres ver el proyecto corriendo localmente para desarrollo o depuración rápida, sin involucrar Docker:

Instala las dependencias:

npm install

Levanta la aplicación:

ng serve

¡Listo! ✨ Abre tu navegador web y dirígete a http://localhost:4200.

🐳 3. Despliegue con Docker

Esta es la forma recomendada para empaquetar la aplicación para entornos de producción o para una evaluación consistente.

Asegúrate de que Docker Desktop esté corriendo en tu máquina. ¡Es un paso crucial!

Construye la Imagen Docker:

Desde la raíz de tu proyecto (donde se encuentra el Dockerfile), ejecuta el siguiente comando:

docker build -t saludplus-app .

docker build: El comando principal para crear una imagen Docker.

-t saludplus-app: Asigna un nombre (tag) a tu imagen. Puedes usar saludplus-app o cualquier otro nombre descriptivo.

.: Indica que el Dockerfile está en el directorio actual.

Nota: Este proceso puede tomar varios minutos la primera vez, ya que Docker necesita descargar las imágenes base y todas las dependencias. ¡Ten paciencia!

Ejecuta el Contenedor Docker:

Una vez que la imagen se haya construido exitosamente, es momento de ejecutar un contenedor a partir de ella:

docker run -d -p 80:80 --name saludplus-web-container saludplus-app

-d: Ejecuta el contenedor en modo "detached" (en segundo plano), liberando tu terminal.

-p 80:80: Mapea el puerto 80 de tu máquina al puerto 80 del contenedor. Esto permite que accedas a la aplicación a través de la dirección IP de tu host.

--name saludplus-web-container: Asigna un nombre legible al contenedor para facilitar su gestión.

saludplus-app: El nombre de la imagen Docker que acabas de construir.

Puedes verificar que el contenedor esté corriendo correctamente con: docker ps

Accede a la Aplicación:

¡La aplicación ya está lista! Abre tu navegador web.

Si estás en Docker Desktop (Windows/macOS), generalmente puedes acceder a la aplicación a través de:
http://localhost:80

Si estás en un entorno Linux o un servidor remoto, usa la dirección IP de tu máquina o servidor.

¡Felicidades! 🎉 Ahora deberías ver tu aplicación Angular funcionando a la perfección, servida por Nginx dentro de tu contenedor Docker.

Notas Importantes sobre la Configuración Docker 📝
Aquí algunos detalles técnicos clave sobre cómo Docker está configurado para este proyecto:

Configuración Nginx: El Dockerfile se encarga de copiar el archivo nginx.conf (ubicado en la raíz de tu repositorio) a la configuración interna de Nginx dentro del contenedor (/etc/nginx/nginx.conf). Este archivo es fundamental para que Nginx sirva correctamente tu aplicación Angular como una SPA, manejando el enrutamiento del lado del cliente mediante la directiva try_files.

Modificaciones de angular.json: Durante la construcción de la imagen, el Dockerfile utiliza comandos jq para modificar dinámicamente tu angular.json. Esto asegura que:

La propiedad root del proyecto saludplus esté definida correctamente.

El outputMode para la compilación de la aplicación sea "static", lo cual es esencial para que la aplicación sea compatible con un servidor web estático como Nginx.

Se permitan ciertas dependencias de CommonJS y se ajusten los límites de tamaño (budgets) para la compilación en producción.

Limpieza de Caché: Se incluye un paso en el Dockerfile para limpiar la caché de npm antes de instalar las dependencias. Esto garantiza una instalación limpia y evita problemas potenciales con versiones o paquetes corruptos en caché.

Si encuentras algún problema, por favor revisa cuidadosamente la salida de los comandos docker build y docker run en tu terminal para obtener mensajes de error específicos.

Commits Significativos 📜
Aquí se listan los commits más relevantes que resumen el progreso y las decisiones clave tomadas durante el desarrollo y configuración de este proyecto.

feat: Inicializa proyecto Angular 'SaludPlus Web'

Crea la estructura base del proyecto Angular utilizando Angular CLI. Configura los archivos iniciales para un nuevo frontend de aplicación web.

docs: Agrega configuración inicial de Nginx

Introduce el archivo nginx.conf con una configuración básica para servir archivos estáticos y manejar el enrutamiento de SPA (Single Page Application), redirigiendo todas las rutas a index.html.

ci: Configura Dockerfile para build multi-etapa

Implementa un Dockerfile con una estrategia de construcción multi-etapa. Incluye una etapa de build con Node.js para compilar Angular y una etapa de serve con Nginx para servir los archivos estáticos.

fix(docker): Ajusta ruta de copia de assets en Dockerfile

Corrige la ruta de origen en el comando COPY --from=build del Dockerfile para que apunte correctamente a los archivos compilados de Angular en /app/dist/saludplusweb. Esto resuelve el error de "not found" al copiar los assets.

refactor: Optimiza instalación de dependencias con npm ci

Cambia el comando npm install por npm ci en el Dockerfile para asegurar instalaciones de dependencias más consistentes y rápidas en el entorno de construcción Docker.

fix(docker): Renombra index.csr.html a index.html para Nginx

Agrega un paso en la etapa de build del Dockerfile para renombrar index.csr.html (generado por Angular) a index.html. Esto permite que Nginx sirva la página principal por defecto sin configuración adicional en su lado.

feat: Implementa módulo de citas médicas (appointments)

Añade la estructura inicial y componentes para la gestión de citas médicas, incluyendo rutas básicas y un componente de listado/detalle. (Este es un commit de ejemplo, ajusta según tu desarrollo real)

feat: Desarrolla módulo de gestión de doctores

Incorpora la funcionalidad para visualizar y administrar la información de los doctores en la aplicación. (Otro commit de ejemplo)

docs: Agrega archivo .dockerignore para contexto de construcción

Crea el archivo .dockerignore para excluir directorios y archivos innecesarios (como node_modules y .git) del contexto enviado al demonio de Docker, optimizando el tiempo de construcción y el tamaño de la imagen.

docs: Añade README.md con guía de proyecto y despliegue

Prepara un archivo README.md detallado que sirve como guía para configurar el entorno de desarrollo, construir la aplicación, y desplegarla utilizando Docker.

