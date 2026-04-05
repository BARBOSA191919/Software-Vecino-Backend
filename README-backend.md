# Vecino — Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-F7B731?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-green?style=flat)

API RESTful del sistema **Vecino**, una plataforma de marketplace hiperlocal orientada a conectar comerciantes, emprendedores y consumidores dentro de una misma zona geográfica en ciudades colombianas.

---

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Endpoints principales](#endpoints-principales)
- [Equipo de desarrollo](#equipo-de-desarrollo)

---

## Descripción general

El backend de Vecino expone una API RESTful que gestiona la lógica de negocio de la plataforma, incluyendo autenticación de usuarios, gestión de negocios y productos, procesamiento de pedidos, notificaciones en tiempo real y módulo de calificaciones y reseñas.

La arquitectura sigue el patrón **MVC (Modelo - Vista - Controlador)** con separación clara por módulos de dominio, garantizando mantenibilidad y escalabilidad del sistema.

---

## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 18.x | Entorno de ejecución |
| Express | 4.x | Framework HTTP y API REST |
| PostgreSQL | 15 | Base de datos relacional |
| JWT | — | Autenticación y gestión de sesiones |
| Bcrypt | — | Encriptación de contraseñas |
| Socket.io | — | Notificaciones en tiempo real |
| dotenv | — | Gestión de variables de entorno |
| pg / Sequelize | — | Conexión y ORM con PostgreSQL |

---

## Estructura del proyecto

```
vecino-backend/
│
├── src/
│   ├── config/             # Configuración de base de datos y variables de entorno
│   ├── controllers/        # Lógica de cada módulo
│   │   ├── auth.controller.js
│   │   ├── negocio.controller.js
│   │   ├── producto.controller.js
│   │   ├── pedido.controller.js
│   │   ├── resena.controller.js
│   │   └── usuario.controller.js
│   ├── middlewares/        # Autenticación JWT, manejo de errores
│   ├── models/             # Modelos de base de datos
│   ├── routes/             # Definición de rutas REST
│   ├── services/           # Lógica de negocio reutilizable
│   └── app.js              # Punto de entrada de la aplicación
│
├── .env.example            # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL v15 o superior
- npm v9 o superior

---

## Instalación y configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/vecino-backend.git
cd vecino-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar el archivo .env con los valores correspondientes

# 4. Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE vecino_db;"

# 5. Ejecutar migraciones
npm run migrate
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vecino_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# Autenticación
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=24h

# Bcrypt
BCRYPT_SALT_ROUNDS=10
```

---

## Ejecución

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

El servidor quedará disponible en: `http://localhost:3000`

---

## Endpoints principales

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | /api/auth/register | Registro de usuario | No |
| POST | /api/auth/login | Inicio de sesión | No |
| GET | /api/negocios | Listar negocios | No |
| POST | /api/negocios | Crear negocio | Sí |
| GET | /api/productos | Listar productos | No |
| POST | /api/productos | Crear producto | Sí |
| POST | /api/pedidos | Crear pedido | Sí |
| GET | /api/pedidos/:id | Consultar pedido | Sí |
| PUT | /api/pedidos/:id/estado | Actualizar estado pedido | Sí |
| POST | /api/resenas | Crear reseña | Sí |

> La documentación completa de la API se irá actualizando conforme avance el desarrollo.

---

## Equipo de desarrollo

| Nombre | ID | Rol |
|---|---|---|
| Santiago José Barbosa Rivas | 100198965 | Product Owner |
| Jerson Javier Ramírez Ricardo | 100123048 | Scrum Master |
| Mario Alexander Avellaneda Buitrago | 100180605 | Desarrollador Backend |
| José Luis Arias | 100143942 | Desarrollador Frontend y Testing |

---

**Corporación Universitaria Iberoamericana**
Facultad de Ingeniería — Programa de Ingeniería de Software
Proyecto de Software — 2025
