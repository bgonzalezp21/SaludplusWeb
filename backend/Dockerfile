# Imagen base oficial de Python
FROM python:3.11-slim-bullseye

# Ensure system packages are up to date to reduce vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del backend al contenedor
COPY . .

# Instalar dependencias del sistema necesarias para compilar extensiones (como psycopg2 si usas PostgreSQL)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar las dependencias de Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Exponer el puerto por el que Django corre
EXPOSE 8000

# Comando para ejecutar al iniciar el contenedor: migraciones + runserver
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
