# DriveFlow

DriveFlow es un sistema web para la gestion de rentas de vehiculos. El proyecto se desarrolla como proyecto final de la asignatura Ingenieria de Software II, utilizando una arquitectura Cliente-Servidor con una API REST basada en el patron MVC.

## Tecnologias utilizadas

- Frontend: React, Vite y JavaScript.
- Backend: Node.js y Express.
- Base de datos: MariaDB.
- Autenticacion: JWT, pendiente de implementacion.
- Dependencias backend iniciales: cors, dotenv, mariadb, bcrypt, jsonwebtoken y express-validator.

## Estructura del proyecto

```text
driveflow/
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql
├── docs/
│   ├── capturas/
│   ├── diagramas/
│   └── informe/
├── .gitignore
└── README.md
```

## Ejecutar el frontend

```bash
cd client
npm install
npm run dev
```

El servidor de desarrollo de Vite iniciara por defecto en `http://localhost:5173`.

## Ejecutar el backend

```bash
cd server
npm install
npm run dev
```

La API iniciara por defecto en `http://localhost:3000`.

## Estado actual

Esta version solo contiene la estructura inicial del proyecto. No incluye logica de negocio, rutas, modelos, controladores ni scripts de base de datos.
