# 🌊 Backend - Biología Marina

Este proyecto es la API del sistema de **El Gran Azul**, desarrollada con **Node.js**, **Express**, **TypeScript** y **Sequelize** como ORM, conectada a una base de datos **MySQL**.

---

## 🚀 Tecnologías principales

- Node.js + Express  
- TypeScript  
- Sequelize ORM  
- MySQL....¿(con Docker)?  
- JWT para autenticación  
- Bcrypt para encriptación de contraseñas  

---

## 📂 Estructura del proyecto

```
server/
├── src/
│ ├── controllers/ # Controladores de la lógica de negocio
│ ├── database/ # Configuración y conexión DB
│ ├── middlewares/ # Middlewares (auth, validaciones, etc.)
│ ├── migrations/ # Migraciones de Sequelize
│ ├── models/ # Modelos Sequelize (Users, Posts, Categories…)
│ ├── routes/ # Definición de rutas
│ ├── types/ # Definiciones TS (DTOs, interfaces, etc.)
│ ├── tests/ # Tests unitarios/integración
│ └── app.ts # Configuración de Express
├── server.ts # Punto de entrada del servidor
├── package.json
├── tsconfig.json
├── .env
└── docker-compose.yml

```
---

## 🗄️ Modelo de datos

### Users
| Campo      | Tipo               | Extra           |
|------------|--------------------|-----------------|
| id         | int unsigned (PK)  | auto_increment  |
| username   | varchar(50)        | único           |
| firstname  | varchar(50)        |                 |
| lastname   | varchar(50)        |                 |
| email      | varchar(100)       | único           |
| password   | varchar(255)       |                 |
| role       | enum(user, admin)  | default: user   |
| createdAt  | datetime           |                 |
| updatedAt  | datetime           |                 |

### Posts
| Campo      | Tipo               | Extra           |
|------------|--------------------|-----------------|
| id         | int unsigned (PK)  | auto_increment  |
| userId     | int unsigned (FK)  | ref: users.id   |
| content    | text               |                 |
| createdAt  | datetime           |                 |
| updatedAt  | datetime           |                 |

### Categories
| Campo      | Tipo               | Extra           |
|------------|--------------------|-----------------|
| id         | int unsigned (PK)  | auto_increment  |
| name       | varchar(100)       | único           |
| description| varchar(255)       | nullable        |

### Post_Categories (tabla pivote)
| Campo       | Tipo               | Extra             |
|-------------|--------------------|-------------------|
| postId      | int unsigned (FK)  | ref: posts.id     |
| categoryId  | int unsigned (FK)  | ref: categories.id|

---

## 🔑 Autenticación

- Login con usuario y contraseña → devuelve un **JWT**.  
- Rutas protegidas requieren `Authorization: Bearer <token>`.  
- Roles disponibles:  
  - `user`: permisos básicos.  
  - `admin`: puede crear/editar/eliminar posts y categorías.  

---

## 📌 Endpoints principales

### Auth
- `POST /auth/register` → registrar un nuevo usuario.  
- `POST /auth/login` → autenticar usuario y devolver token.  

### Users
- `GET /users` (admin) → listar usuarios.  
- `GET /users/:id` → obtener usuario por id.  

### Posts
- `GET /posts` → listar todos los posts.  
- `GET /posts/:id` → obtener post por id.  
- `POST /posts` (admin) → crear post.  
- `PUT /posts/:id` (admin) → actualizar post.  
- `DELETE /posts/:id` (admin) → eliminar post.  

### Categories
- `GET /categories` → listar categorías.  
- `POST /categories` (admin) → crear categoría.  

---

## 📥 Ejemplos de requests

### Registro
```
POST /auth/register
{
  "username": "adriana",
  "firstname": "Ady",
  "lastname": "Coder",
  "email": "ady@example.com",
  "password": "supersecret"
}
```

### Login
```

POST /auth/login
{
  "email": "ady@example.com",
  "password": "supersecret"
}
```

### Response
```

{
  "success": true,
  "token": "<JWT_TOKEN>"
}
```

### Crear post (admin)
```

POST /posts
Authorization: Bearer <JWT_TOKEN>
{
  "content": "Nuevo descubrimiento en aguas profundas",
  "categoryIds": [1, 2]
}
```
---
## ⚙️ Instalación y uso

### Clonar el repo
```
git clone https://github.com/Grupo5-Biologia-Marina/server.git
cd server
```

### Instalar dependencias
```
npm install
```
### Crear archivo .env basado en .env.example
```
DB_HOST=localhost
DB_USER=appuser
DB_PASSWORD=password
DB_NAME=lastdiscover
JWT_SECRET=supersecret
```
### Levantar con Docker (MySQL)
```
docker-compose up -d
```
### Ejecutar migraciones
```
npx sequelize-cli db:migrate
```
### Iniciar servidor
```
npm run dev
```
---
## 👩🏻‍💻​ Creadoras

🚢 Aday 🦈 • Irina 🐙 • Julia 🐠 • Luisa 🐬 • Valentina 🐡

---

## 📌 Notas

Por defecto, el primer usuario creado debería ser admin (configurable).

El proyecto está en fase inicial: endpoints y validaciones pueden cambiar.
