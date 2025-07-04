# 🏥 SaludPlusWeb

**SaludPlusWeb** es una aplicación web que permite a pacientes agendar citas médicas con doctores que tienen agendas disponibles.  
El sistema está dividido en dos partes:

- 🧩 **Frontend**: Aplicación Angular responsiva con Angular Material  
- 🔧 **Backend**: API RESTful en Django REST Framework, usando SQLite

> Actualmente el sistema **no cuenta con inicio de sesión** ni control de roles: todas las funcionalidades están disponibles sin autenticación.

---

## ⚙️ ¿Qué funcionalidades ofrece?

- 📋 Crear y listar médicos y pacientes
- 📅 Médicos pueden definir sus agendas disponibles (día + hora)
- 📆 Pacientes pueden reservar citas
- ✅ Valida que las citas no estén en el pasado y que no se dupliquen para un mismo horario y médico

---

## 🚀 ¿Cómo correr el proyecto?

---

### 🐳 OPCIÓN A: Usar Docker y Docker Compose (recomendado)

#### 1. Clona el proyecto

```bash
git clone https://github.com/bgonzalezp21/SaludplusWeb.git
cd SaludplusWeb

#### 2. ejecuta el proyecto con este comando
docker compose up --build


## 🌐 Frontend (Angular)

La interfaz de usuario de **SaludPlusWeb** está construida con **Angular 17** y estilizada con **Angular Material**.  
Es una aplicación **responsiva** que permite a los usuarios navegar por el sistema y agendar citas fácilmente.

---

### 📋 Funcionalidades del Frontend

- Página principal con navegación entre módulos
- Listado de médicos disponibles
- Registro de pacientes
- Visualización y selección de horarios disponibles
- Agendamiento de citas

> Nota: Actualmente, el sistema **no requiere autenticación**. Todo está disponible de forma pública en la interfaz.

---

### 🚀 Cómo correr el frontend localmente

#### 📦 Requisitos previos

- Node.js 18+
- Angular CLI instalado globalmente:

```bash
npm install -g @angular/cli


1. Entra a la carpeta frontend/:

cd frontend

2. Instala las dependencias:

npm install

3. Inicia el servidor de desarrollo:

ng serve

4. Abre en tu navegador:

localhost:4200



## 🔧 Backend (Django REST Framework)

El backend de **SaludPlusWeb** está construido con **Django 4** y **Django REST Framework**, y expone una API RESTful para manejar médicos, pacientes, agendas y citas.  
La base de datos utilizada por defecto es **SQLite**.

---

### 📋 Funcionalidades del Backend

- CRUD completo para:
  - Médicos
  - Pacientes
  - Agendas (disponibilidad de médicos)
  - Citas (vinculadas a paciente y médico)
- Validación para:
  - Citas no pueden ser agendadas en el pasado
  - No se permite duplicar citas para la misma hora y médico
- Sin autenticación: el backend está completamente abierto para pruebas y desarrollo

---

### 🚀 Cómo correr el backend localmente

#### 📦 Requisitos previos

- Python 3.10 o superior
- pip

---

#### ▶️ Pasos para ejecutar

1. Entra a la carpeta del backend:

```bash
cd backend


2. Crea un entorno virtual:

python -m venv venv
source venv/bin/activate (macOS)  # En Windows: venv\Scripts\activate

3. Instala las dependencias:

pip install -r requirements.txt

4. Aplica las migraciones de la base de datos:

python manage.py migrate


5. Inicia el servidor de desarrollo:

python manage.py runserver

6. Abre tu navegador:

http://localhost:8000/api/