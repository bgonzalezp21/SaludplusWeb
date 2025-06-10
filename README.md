# SaludPlus Web Frontend

Este repositorio contiene la interfaz de usuario (frontend) de la aplicación **SaludPlus Web**, desarrollada con Angular. Está configurada para ser empaquetada y servida eficientemente usando Docker con Nginx.

## Guía Rápida: Cómo Levantar el Proyecto

¡Hola! Aquí te explico cómo poner en marcha este proyecto de Angular con Nginx y Docker. Sigue estos pasos y estarás listo en poco tiempo.

### 🚀 **0. Antes de Empezar: ¡Prepara tu Entorno!**

Asegúrate de tener esto instalado en tu compu:

* **Git**: Para descargar el código.
    * Si no lo tienes: Busca "install Git" para tu sistema operativo.
* **Node.js (versión 20 o superior) y npm**: El "cerebro" de Angular.
    * Descárgalo de [nodejs.org](https://nodejs.org/es/download/).
* **Angular CLI**: La herramienta de comandos de Angular.
    * Abre tu terminal y ejecuta: `npm install -g @angular/cli`
* **Docker Desktop**: La magia de los contenedores.
    * Descárgalo de [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/).

###  **1. Descarga el Código**

* Abre tu terminal.
* Clona el repositorio de Git:
    ```bash
    git clone [https://github.com/tu_usuario_github/tu_repositorio.git](https://github.com/tu_usuario_github/tu_repositorio.git)
    ```
    (No olvides reemplazar `tu_usuario_github/tu_repositorio.git` con la URL real de tu proyecto en GitHub)
* Entra a la carpeta del proyecto que acabas de descargar:
    ```bash
    cd tu_repositorio_clonado
    ```

###  **2.  Ejecutar en Modo Desarrollo (sin Docker)**

Si quieres ver el proyecto corriendo sin Docker, para desarrollo o depuración:

* **Instala las dependencias**:
    ```bash
    npm install
    ```
* **Levanta la aplicación**:
    ```bash
    ng serve
    ```
* **¡Listo!** Abre tu navegador y ve a `http://localhost:4200`.

###  **3.  Despliegue con Docker**

Esta es la forma recomendada para empaquetar la aplicación para entornos de producción o evaluación.

* **Asegúrate de que Docker Desktop esté corriendo** en tu máquina. ¡Es importante!

* **Construye la Imagen Docker**:
    * Desde la raíz de tu proyecto (donde está el `Dockerfile`):
        ```bash
        # ¡IMPORTANTE! Reemplaza 'tu_usuario_dockerhub' por tu usuario real de Docker Hub.
        # Puedes usar 'latest' para el tag, o poner una versión como '1.0.0'.
        docker build -t tu_usuario_dockerhub/saludplus-frontend:latest .
        ```
    * Esto creará tu imagen Docker. ¡Tardará un poco la primera vez!

* **Ejecuta el Contenedor Docker**:
    ```bash
    docker run -d -p 8080:80 --name saludplus-frontend tu_usuario_dockerhub/saludplus-frontend:latest
    ```
    * Tu app estará en `http://localhost:8080`. (Puedes cambiar `8080` si ese puerto está ocupado).
    * Verifica que el contenedor esté corriendo con `docker ps`.

* **¡Listo! Accede a la App**:
    * Abre tu navegador y ve a `http://localhost:8080`.

---

## Commits Significativos

Aquí se listan los commits más relevantes que resumen el progreso y las decisiones tomadas durante el desarrollo y configuración de este proyecto.

* **feat: Inicializa proyecto Angular 'SaludPlus Web'**
    * Crea la estructura base del proyecto Angular utilizando Angular CLI. Configura los archivos iniciales para un nuevo frontend de aplicación web.

* **docs: Agrega configuración inicial de Nginx**
    * Introduce el archivo `nginx.conf` con una configuración básica para servir archivos estáticos y manejar el enrutamiento de SPA (Single Page Application), redirigiendo todas las rutas a `index.html`.

* **ci: Configura Dockerfile para build multi-etapa**
    * Implementa un `Dockerfile` con una estrategia de construcción multi-etapa. Incluye una etapa de `build` con Node.js para compilar Angular y una etapa de `serve` con Nginx para servir los archivos estáticos.

* **fix(docker): Ajusta ruta de copia de assets en Dockerfile**
    * Corrige la ruta de origen en el comando `COPY --from=build` del Dockerfile para que apunte correctamente a los archivos compilados de Angular en `/app/dist/saludplusweb`. Esto resuelve el error de "not found" al copiar los assets.

* **refactor: Optimiza instalación de dependencias con npm ci**
    * Cambia el comando `npm install` por `npm ci` en el Dockerfile para asegurar instalaciones de dependencias más consistentes y rápidas en el entorno de construcción Docker.

* **fix(docker): Renombra index.csr.html a index.html para Nginx**
    * Agrega un paso en la etapa de `build` del Dockerfile para renombrar `index.csr.html` (generado por Angular) a `index.html`. Esto permite que Nginx sirva la página principal por defecto sin configuración adicional en su lado.

* **feat: Implementa módulo de citas médicas (appointments)**
    * Añade la estructura inicial y componentes para la gestión de citas médicas, incluyendo rutas básicas y un componente de listado/detalle. (Este es un commit de ejemplo, ajusta según tu desarrollo real)

* **feat: Desarrolla módulo de gestión de doctores**
    * Incorpora la funcionalidad para visualizar y administrar la información de los doctores en la aplicación. (Otro commit de ejemplo)

* **docs: Agrega archivo .dockerignore para contexto de construcción**
    * Crea el archivo `.dockerignore` para excluir directorios y archivos innecesarios (como `node_modules` y `.git`) del contexto enviado al demonio de Docker, optimizando el tiempo de construcción y el tamaño de la imagen.

* **docs: Añade README.md con guía de proyecto y despliegue**
    * Prepara un archivo `README.md` detallado que sirve como guía para configurar el entorno de desarrollo, construir la aplicación, y desplegarla utilizando Docker.