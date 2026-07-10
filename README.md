# Gestión de Stock Banco de Sangre 🩸

Este proyecto corresponde a una entrega de tarea para la implementación de una aplicación web sencilla para gestionar el inventario de unidades de sangre. La interfaz permite registrar nuevas unidades, visualizar el estado del stock y realizar acciones básicas como bloquear, desbloquear, utilizar o desechar unidades.

## Descripción del proyecto 📚

La aplicación está desarrollada en HTML, CSS y JavaScript, utilizando módulos ES6 y almacenamiento local en el navegador mediante `localStorage`. Su objetivo es simular un sistema básico de control de inventario para un banco de sangre.

## Funcionalidades ⚙️

- Registro de nuevas unidades de sangre con:
  - ID de unidad
  - Grupo y factor RH
  - Componente (glóbulos rojos, plasma o plaquetas)
- Visualización del inventario actual en tarjetas.
- Cambio de estado de cada unidad:
  - En análisis
  - Disponible
  - Bloqueado
- Búsqueda por grupo sanguíneo.
- Persistencia de datos usando el almacenamiento local del navegador.
- Notificaciones visuales para indicar acciones realizadas.

## Estructura del proyecto

```text
gestion.stock/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   └── js/
│       ├── script.js
│       └── clases/
│           └── tareas.js
```

## Tecnologías utilizadas

✅ HTML5
✅ CSS3
✅JavaScript ES6
✅ LocalStorage

## Cómo ejecutar

1. Descarga o clona este repositorio.
2. Abre el archivo `index.html` en tu navegador.
3. Desde la interfaz, podrás registrar y gestionar unidades del inventario.

## Datos del Autor

- **Nombre:** Aracelly Núñez
- **Email:** nunezaracelly@gmail.com
- **GitHub:** https://github.com/AracellyNunez
- **Repositorio:** https://github.com/AracellyNunez/m4-abp

## Nota de entrega

Este trabajo fue desarrollado como parte de una tarea académica, con el propósito de demostrar el uso de estructuras básicas en JavaScript, interacción con el DOM y manejo de datos en una aplicación web.
