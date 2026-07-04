DriveFlow Design System v1.0
Proyecto
DriveFlow
Sistema web para la gestión de rentas de vehículos.
Estilo
Moderno
Minimalista
Profesional
Premium
SaaS
Inspirado en aplicaciones como Linear, Stripe, Vercel y la referencia visual tipo DriveNest.
Priorizar simplicidad sobre elementos decorativos.
Filosofía de diseño
DriveFlow debe transmitir:
confianza
rapidez
organización
tecnología
limpieza
La interfaz debe sentirse como un software comercial moderno, no como un proyecto universitario.
Paleta de colores
Primary
#2563EB
Azul principal.
Botones.
Links.
Elementos activos.
Primary Hover
#1D4ED8
Background
#F8FAFC
Surface
#FFFFFF
Cards.
Tablas.
Formularios.
Sidebar
#0F172A
Sidebar Hover
#1E293B
Text Primary
#0F172A
Text Secondary
#64748B
Border
#E2E8F0
Success
#22C55E
Warning
#F59E0B
Danger
#EF4444
Tipografía
Utilizar exclusivamente:
Inter
Pesos:
400
500
600
700
Nunca utilizar más de una tipografía.
Espaciado
Base:
8px
Escala:
8
16
24
32
40
48
64
Nunca utilizar valores aleatorios.
Bordes
Inputs
12px
Cards
16px
Botones
12px
Modales
20px
Sombras
Muy suaves.
Ejemplo:
0 8px 24px rgba(15,23,42,.08)
Nunca usar sombras fuertes.
Sidebar
Izquierda.
Oscura.
220px.
Debe contener:
Logo DriveFlow
Dashboard
Users
Customers
Vehicles
Reservations
Rentals
Returns
Reports
Settings
Iconos simples.
Sidebar colapsable.
Topbar
Contendrá:
Buscador
Notificaciones
Perfil
Avatar
Fondo blanco.
Dashboard
Debe mostrar cuatro métricas principales:
Total Vehicles
Active Rentals
Reservations
Revenue
Debajo:
Vehículos recientes
Rentas recientes
Estado de la flota
Cards
Color blanco.
Padding:
24px
Borde:
1px #E2E8F0
Radius:
16px
Botones
Primary
Azul.
Secondary
Blanco.
Danger
Rojo.
Ghost
Sin fondo.
Todos con animaciones suaves.
Tablas
Estilo limpio.
Cabecera gris muy claro.
Hover en filas.
Paginación inferior.
Buscador superior.
Filtros arriba.
Formularios
Dos columnas en escritorio.
Una columna en móvil.
Labels arriba.
Placeholder discreto.
Errores debajo del campo.
Modales
Centrados.
Animación Fade.
No ocupar toda la pantalla.
Vehículos
La tabla debe incluir miniatura del vehículo.
Si no existe imagen:
placeholder.
Estados
Disponible
Verde.
Rentado
Azul.
Reservado
Amarillo.
Mantenimiento
Rojo.
Fuera de servicio
Gris.
Mostrar mediante Badges.
Iconografía
Utilizar exclusivamente:
Lucide React
No mezclar librerías.
Animaciones
Suaves.
150–250 ms.
Nunca exageradas.
Responsive
Desktop
Sidebar visible.
Tablet
Sidebar colapsable.
Mobile
Sidebar tipo Drawer.
Componentes reutilizables
Crear únicamente componentes reutilizables.
Button
Input
Select
Card
Modal
Table
Badge
Loader
EmptyState
ConfirmDialog
Pagination
SearchInput
Evitar duplicación.
Imágenes
Utilizar imágenes placeholder libres de vehículos modernos.
SUV
Sedán
Pickup
Compacto
No utilizar imágenes pixeladas.
UX
Todo CRUD debe seguir el mismo flujo:
Tabla
↓
Botón Nuevo
↓
Modal
↓
Guardar
↓
Toast
↓
Actualizar tabla
Nunca navegar a otra pantalla para crear un registro.
Código
Utilizar:
React Hooks
Componentes funcionales
Servicios separados
CSS modular o sistema consistente
Evitar lógica duplicada.