# 🌊 Proyecto Backend - El Gran Azul

Este proyecto es la **API** del sistema de **El Gran Azul**, dedicada a los descubrimientos de la biología marina.  
Está desarrollada con **Node.js**, **Express**, **TypeScript** y **Sequelize** como ORM, conectada a una base de datos **MySQL**.  
Permite almacenar, gestionar y consultar información sobre nuevas especies, investigaciones y hallazgos en el océano, ofreciendo datos estructurados que luego pueden ser consumidos por un frontend para mostrar publicaciones, perfiles de investigadores y noticias marinas.  

---

## 🚀 Tecnologías principales

- **Lenguaje:** TypeScript  
- **Framework:** Express  
- **Base de datos:** MySQL (Sequelize ORM)  
- **Autenticación y seguridad:** Bcrypt, JWT, Validator  
- **Subida de archivos y almacenamiento:** Multer, Cloudinary  
- **Correo electrónico:** Nodemailer  
- **Testing:** Jest, Supertest  
- **Desarrollo y utilidades:** ts-node, ts-node-dev, ESLint, Sequelize-CLI, Dotenv, UUID  
- **Despliegue:** Railway

---

## ⭐️ Funcionalidades 

### 🧱 Base de datos relacional
Diseño relacional con Sequelize (MySQL), migraciones y seeders configurados para inicializar usuarios, categorías y publicaciones.

### 🧩 Validación de datos
Verificación y saneamiento de la información mediante validadores personalizados en `validators/`.
Garantiza consistencia en formularios de autenticación y creación de posts.

### 🔐 Autenticación y roles de usuario
Gestión segura de registro, inicio y cierre de sesión mediante JWT.
Los usuarios cuentan con diferentes permisos según su rol, controlados por middlewares de autorización.
- Login con usuario y contraseña → devuelve un **JWT**.  
- Rutas protegidas requieren `Authorization: Bearer <token>`.  
- Roles disponibles:  
  - `user`: permisos básicos.  
  - `admin`: puede crear/editar/eliminar posts y categorías.  

### 🗂️ Gestión de categorías
Administración de categorías temáticas (por ejemplo vida marina, ecosistemas oceánicos, ciencia y exploración, etc.) para clasificar las publicaciones.
Relación N:M entre posts y categorías mediante una tabla intermedia.

### ❤️ Sistema de likes
Implementa una tabla intermedia (Likes) que permite a los usuarios marcar o quitar “me gusta” en publicaciones.
La lógica está gestionada desde `LikeController.ts` con rutas protegidas.

### 🧪 Testing automatizado
Cobertura de pruebas unitarias y de integración mediante Jest y Supertest, validando rutas de autenticación, CRUD y seguridad.

<img src="src/assets/test-1.png" alt="Backend tests" width="400"/>

<img src="src/assets/test-2.png" alt="Backend tests" width="400"/>

### 🖼️ Subida y gestión de imágenes
Integración con Cloudinary para almacenar imágenes asociadas a publicaciones.
El sistema maneja metadatos opcionales como créditos y descripciones de imagen de manera opcional.

<img src="src/assets/cloudinary.png" alt="Cloudinary desktop" width="400"/>

### 📧 Notificaciones por correo electrónico
Envío automático de un email de bienvenida al registrarse, utilizando Nodemailer y credenciales configuradas en el entorno.

<img src="src/assets/nodemailer.png" alt="Email bienvenida" width="300"/>

### 🔄 Copia de seguridad
Ruta `/backup` que genera un archivo JSON con los datos actuales almacenados en la base de datos de Railway.
Facilita la exportación y recuperación de información.

---

## 📂 Estructura del proyecto

```
server/
├── src/
│ ├── assets/                               # Logo
│ ├── controllers/                          # Controladores de la lógica de negocio
│ │   ├── AuthController.ts  
│ │   ├── CategoryController.ts  
│ │   ├── LikeController.ts  
│ │   ├── PostController.ts  
│ │   ├── PostImagesController.ts  
│ │   └── UserController.ts        
│ ├── database/                             # Configuración y conexión DB
│ │   ├── config.js 
│ │   └── db_connection.ts
│ ├── middlewares/                          # Middlewares (auth, validaciones, etc.)
│ │   ├── authMiddleware.ts 
│ │   ├── roleMiddleware.ts 
│ │   └── validationMiddleware.ts
│ ├── migrations/                           # Migraciones de Sequelize
│ │   ├── 001-create-users.js
│ │   ├── 002-create-posts.js 
│ │   ├── 003-create-categories.js
│ │   ├── 004-create-post-categories.js
│ │   ├── 005-create-post-image.js
│ │   └── 006-create-likes.js
│ ├── models/                               # Modelos Sequelize (Users, Posts, Categories…)
│ │   ├── CategoryModel.ts
│ │   ├── LikeModel.ts 
│ │   ├── PostImageModel.ts
│ │   ├── PostModel.ts
│ │   └── UserModel.ts
│ ├── routes/                               # Definición de rutas
│ │   ├── authRoutes.ts
│ │   ├── backupRoutes.ts
│ │   ├── likeRoutes.ts
│ │   ├── postImagesRoutes.ts 
│ │   ├── postRoutes.ts
│ │   └── userRoutes.ts
│ ├── seeders/                              # Seeders de Sequelize
│ │   ├── 001-admin-user.js
│ │   ├── 002-categories.js 
│ │   ├── 003-admin-posts.js
│ │   ├── 004-admin-posts-categories.js
│ │   ├── 005-admin-posts-img.js
│ │   └── 006-admin-likes.js
│ ├── tests/                                # Tests unitarios/integración
│ │   ├── auth.test.ts
│ │   ├── crud.test.ts
│ │   ├── images.test.ts
│ │   ├── likes.test.ts
│ │   ├── login.test.ts
│ │   ├── setup.ts
│ │   └── token.test.ts 
│ ├── types/                                # Definiciones TS (DTOs, interfaces, etc.)
│ │   ├── auth.ts
│ │   ├── category.ts
│ │   └── posts.ts
│ ├── utils/                                # Configuración de Cloudinary y Nodemailer
│ │   ├── cloudinary.ts
│ │   └── mailer.ts 
│ ├── validators/                           # Validadores
│ │   ├── authValidations.ts
│ │   └── postValidations.ts 
│ └── app.ts                                # Configuración de Express
├── .env                                    # Credenciales
├── .env.example                            # Modelo de .env
├── .gitignore                              # Archivos que no se suben a GitHub
├── .sequelizerc                            # Configuración Sequelize
├── backup_railway.json                     # Copia de seguridad
├── docker-compose.yml                      # Configuración Docker
├── jest.config.js                          # Configuración Jest
├── backup_local.sql                        # Dump copia de seguridad de la base de datos
├── package-lock.json                       # Dependencias
├── package.json                            # Dependencias
├── README.md                               # Documentación
├── server.ts                               # Punto de entrada del servidor
└── tsconfig.json                           # Configuración TypeScript

```
---

## 🗄️ Modelo de datos

<img src="src/assets/database-schema.png" alt="Esquema de la base de datos" width="600"/>

### Users
| Field      | Type               | Extra           | Null   |
|------------|--------------------|-----------------|--------|
| id         | int unsigned (PK)  | auto_increment  |no      |
| username   | varchar(50)        | único           |no      |
| firstname  | varchar(50)        |                 |yes     |
| lastname   | varchar(50)        |                 |yes     |
| email      | varchar(100)       | único           |no      |
| password   | varchar(255)       |                 |no      |
| role       | enum(user, admin)  | default: user   |no      |
| img        | varchar(500)       |                 |yes     |
| createdAt  | datetime           |                 |no      |
| updatedAt  | datetime           |                 |no      |

### Posts
| Field      | Type               | Extra           | Null   |
|------------|--------------------|-----------------|--------|
| id         | int unsigned (PK)  | auto_increment  |no      |
| userId     | int unsigned (FK)  | ref: users.id   |no      |
| title      | varchar(255)       |                 |no      |
| content    | text               |                 |no      |
| credits    | varchar(500)       |                 |yes     |
| createdAt  | datetime           |                 |no      |
| updatedAt  | datetime           |                 |no      |

### Likes (tabla intermedia)
| Field       | Type              | Extra               | Null   |
|-------------|-------------------|---------------------|--------|
| postId      | int unsigned (FK) | ref: posts.id       |no      |
| userId      | int unsigned (FK) | ref: user.id        |no      |

### Categories
| Field      | Type               | Extra           | Null   |
|------------|--------------------|-----------------|--------|
| id         | int unsigned (PK)  | auto_increment  |no      |
| name       | varchar(100)       | unique          |no      |
| description| varchar(255)       |                 |yes     |
| img        | varchar(500)       |                 |yes     |

### Post_Categories (tabla intermedia)
| Field       | Type              | Extra               | Null   |
|-------------|-------------------|---------------------|--------|
| postId      | int unsigned (FK) | ref: posts.id       |no      |
| categoryId  | int unsigned (FK) | ref: categories.id  |no      |

### Post_Images
| Field      | Type               | Extra              | Null   |
|------------|--------------------|--------------------|--------|
| id         | int unsigned (PK)  | auto_increment     |no      |
| postId     | int unsigned (FK)  | ref: categories.id |no      |
| url        | varchar(500)       |                    |no      |
| caption    | varchar(500)       |                    |yes     |
| credit     | varchar(500)       |                    |yes     |
| createdAt  | datetime           |                    |no      |
| updatedAt  | datetime           |                    |no      |


---

## 📌 Endpoints principales

### Auth
- `POST /auth/register` → registrar un nuevo usuario.  
- `POST /auth/login` → autenticar usuario y devolver token.  
- `POST /auth/logout` → cierra sesión.  

### Users
- `GET /users` (admin) → listar usuarios.  
- `GET /users/:id` → obtener usuario por id.  
- `PATCH /users/:id` → actualiza la información de un usuario.
- `PATCH /users/:id/role` (admin) → cambia el rol del usuario.

### Posts
- `GET /posts` → listar todos los posts.  
- `GET /posts/:id` → obtener post por id. 
- `GET /my-posts/`  -> obtiene posts por UserId 
- `POST /posts` (admin o user autentificado) → crear post.  
- `PATCH /posts/:id` (admin o user autentificado autor) → actualiza un post  
- `DELETE /posts/:id` (admin o user autentificado autor) → eliminar post.  

### Images
- `POST /:postId/images` → añadir una imagen a un post. 

### Likes
- `GET /posts/:id/likes` → recoge los likes.  
- `POST /posts/:id/likes` → dar o quitar like 

### Backup de la base de datos
- `GET /backup` → al ejecutarse se crea un archivo json con los datos que están almacenados en Railway .  

---

## 📥 Ejemplos de requests

### Registro
```
POST /auth/register
{
  "username": "Medusa",
  "firstname": "Ana",
  "lastname": "Sánchez",
  "email": "medusa@example.com",
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
## 🌐 Documentación Postman

Consulta toda la documentación de la API haciendo clic en el logo:

<div align="center">
  <a href="https://documenter.getpostman.com/view/46421338/2sB3QQH77t">
    <img src="src/assets/postman.jpg" alt="Postman" width="120"/>
  </a>
</div>

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

### Configuración según entorno:

#### Local (MySQL Workbench)
1. Crear la base de datos y el usuario:
    ```
    CREATE DATABASE lastdiscover_local;
    CREATE USER 'appuser'@'%' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON lastdiscover_local.* TO 'appuser'@'%';
    FLUSH PRIVILEGES;
    ```
2. Crear el .env:
    ```
    DB_NAME=lastdiscover_local
    DB_PORT=3306
    USER_DB=appuser
    PASSWORD_DB=password
    HOST=127.0.0.1
    DB_DIALECT=mysql
    ```
3. Ejecutar las migraciones y seeds:
    ```
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
    ```
4. *Deshacer migraciones y seeds (en caso necesario, opcional):*
    ```
   npx sequelize-cli db:migrate:undo:all
   npx sequelize-cli db:seed:undo:all
    ```
5. Iniciar servidor:
    ```
   npx ts-node server.ts
    ```

#### Local (con Docker)
1. Levantar Docker:
    ```
    docker-compose up -d
    ```
2. Crear el .env:
    ```
    DB_NAME=lastdiscover
    DB_PORT=3307
    DB_USER=appuser
    DB_PASSWORD=password
    DB_HOST=127.0.0.1
    JWT_SECRET=supersecret
    ```
3. Verificar contenedores:
    ```
   docker ps
    ```
4. Ejecutar las migraciones y seeds:
    ```
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
    ```
5. *Deshacer migraciones y seeds (en caso necesario, opcional):*
    ```
   npx sequelize-cli db:migrate:undo:all
   npx sequelize-cli db:seed:undo:all
    ```
6. Inspeccionar la base de datos:
    ```
   docker exec -it lastdiscover mysql -uappuser -ppassword lastdiscover
    show databases;
    use lastdiscover;
    show tables;
    describe users;
    exit;
    ```

#### Railway desde 0 
1. Crear un proyecto en Railway tipo MySQL.
2. Obtener las credenciales de la base de datos del panel de Railway para introducirlas en el .env:
    ```
    DB_NAME=
    USER_DB=
    PASSWORD_DB=
    HOST=
    DB_PORT=
    DB_DIALECT=mysql
    MYSQL_PUBLIC_URL=
    ```
3. Importar la base de datos desde el dump 'backup_local.sql':
    ```
   mysql -h <host> -P <puerto> -u <usuario> -p <nombre_de_la_db> < backup_local.sql
    ```
4. Iniciar el servidor localmente apuntando a la base de datos de Railway:
    ```
   npx railway run npx ts-node server.ts
    ```

Ejemplo de cómo se ve la base de datos en Railway:

<img src="src/assets/railway-1.png" alt="Tablas de la base de datos en Railway" width="600"/>

<img src="src/assets/railway-2.png" alt="TTabla posts de la base de datos en Railway" width="600"/>


### Configuración común tanto en local como conectando con Railway. Cloudinary y Nodemailer:

Añadir lo siguiente en el .env:

```
APP_PORT=4000

CLOUDINARY_CLOUD_NAME=dkm0ahny1
CLOUDINARY_API_KEY=243859817582917
CLOUDINARY_API_SECRET=0kPQdQlToQzFeEZxv8MDlBH9XPE

JWT_SECRET=1234

EMAIL_USER=el.gran.azul.post@gmail.com
EMAIL_APP_PASS=xvlotowcpiojllfa
FRONTEND_URL=http://localhost:5173
```

---
## 👩🏻‍💻​ Creadoras

[🚢 Aday 🦈](https://github.com/Aday25) • [Irina 🐙](https://github.com/irinatiron) • [Julia 🐠](https://github.com/juliazmor) • [Luisa 🐬](https://github.com/luisasilva99) • [Valentina 🐡](https://github.com/ValenMontilla7)


---

## 📌 Notas

- Por defecto, el primer usuario creado debería ser admin (configurable).
- Railway ofrece servicio gratuito 30 días por lo que no es una solución definitiva.