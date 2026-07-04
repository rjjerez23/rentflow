# DriveFlow Coding Guidelines

## Arquitectura

Mantener estrictamente la arquitectura:

Controller
↓

Service
↓

Repository
↓

MariaDB

Los controllers nunca deben acceder directamente a la base de datos.

Toda consulta SQL pertenece únicamente a los repositories.

Toda regla de negocio pertenece a los services.

---

## Convenciones

Idioma del código:

Inglés.

Idioma de la documentación:

Español.

Utilizar snake_case para columnas de base de datos.

Utilizar camelCase para variables y funciones.

Utilizar PascalCase únicamente para componentes React.

---

## Backend

Cada módulo debe contener:

controller

service

repository

validator

routes

No duplicar lógica entre módulos.

Siempre reutilizar utilidades existentes.

Utilizar async/await.

No utilizar callbacks.

---

## Frontend

Utilizar únicamente componentes funcionales.

Utilizar Hooks.

Toda llamada HTTP debe realizarse desde la carpeta services.

No hacer llamadas HTTP directamente desde componentes.

Reutilizar componentes.

---

## Respuestas JSON

Todas las respuestas deben seguir este formato.

Éxito:

{
  "success": true,
  "message": "...",
  "data": {}
}

Error:

{
  "success": false,
  "message": "...",
  "errors": []
}

---

## Base de datos

Mantener la normalización.

No escribir consultas SQL fuera de repositories.

No duplicar información.

Siempre utilizar llaves foráneas cuando corresponda.

---

## Código

Priorizar legibilidad.

Evitar funciones demasiado largas.

No dejar código comentado.

Eliminar imports sin uso.

Mantener nombres descriptivos.

---

## UI

Seguir estrictamente el Design System ubicado en:

docs/design/design-system.md

y utilizar como referencia visual:

docs/design/ui-reference.png

No modificar el estilo definido sin una justificación técnica.