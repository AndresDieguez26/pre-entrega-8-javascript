# Pre-Entrega 8 — Sincronización de estado entre DOM y Storage

**Autor:** Andrés Dieguez  
**Proyecto:** Plantel Fútbol 6

Continuación de la Pre-Entrega 7: se mantiene el formulario de jugadoras, el buscador por nombre o posición y el diseño original. Se incorpora persistencia del plantel, edición y vaciado.

## Ejecutar

Abrir `index.html` en el navegador. Para trabajar siempre en el mismo origen y probar la persistencia, se recomienda usar Live Server de VS Code. No requiere instalar dependencias del proyecto.

## Funcionalidades

- Agregar jugadoras con nombre, posición y edad entera entre 15 y 60.
- Editar jugadoras desde el mismo formulario y cancelar la edición.
- Eliminar una jugadora o vaciar el plantel completo.
- Buscar por nombre o posición; el filtro se mantiene al agregar, editar o eliminar.
- Recuperar las jugadoras al volver a abrir o recargar la página en el mismo navegador y origen.
- Mensajes en el DOM, sin `prompt`, `alert` ni `console.log`.

## Consigna implementada en `js/main.js`

| Requisito | Implementación |
| --- | --- |
| Recuperar arrays de objetos | `recuperarJugadoras()` usa `localStorage.getItem()` y `JSON.parse()` |
| Guardar, modificar, borrar y vaciar | `actualizarEstado()` actualiza el array, usa `JSON.stringify()` y `localStorage.setItem()`, luego renderiza |
| Datos que no existen todavía | `datos ?? jugadorasIniciales` usa el plantel de ejemplo solo cuando no hay datos |
| Optional chaining | `nombre?.trim()` y `posicion?.trim()` validan propiedades que podrían faltar |
| Ternarios | Mensaje del plantel vacío, botones, contador y selección de alta o edición |
| Destructuring | `const { id, nombre, posicion, edad } = jugadora` y parámetros de `filter()` / `map()` |
| DOM y eventos | `submit`, `input` y `click`; creación de tarjetas con `createElement()` |

La clave usada es `plantelFutbol6`. El estado se guarda como array de objetos con `id`, `nombre`, `posicion` y `edad`. Vaciar guarda `[]`: así el plantel continúa vacío al recargar, sin reponer los ejemplos. No se usa `localStorage.clear()`, para no afectar otras claves.

Si el navegador rechaza una escritura, el array vuelve al estado anterior y se muestra el error. Si hay JSON inválido o datos con formato incorrecto, se informa en pantalla y se inicia vacío.

## Prueba manual de aceptación

1. Agregar una jugadora y presionar F5: debe seguir apareciendo.
2. Editarla y presionar F5: deben mantenerse los datos modificados.
3. Eliminarla y presionar F5: no debe reaparecer.
4. Vaciar el plantel y presionar F5: debe continuar vacío.
5. En las herramientas del navegador, revisar Application / Almacenamiento → Local Storage → `plantelFutbol6`: el contenido debe coincidir con el plantel.
6. Buscar por nombre o posición y modificar o eliminar una tarjeta: la búsqueda debe mantenerse.

Se verificó la sintaxis de JavaScript y los flujos de estado con un DOM simulado: alta, recuperación, edición, búsqueda, eliminación, vaciado, JSON inválido y error de escritura. La comprobación visual en un navegador queda cubierta por los pasos manuales anteriores.

## Archivos

- `index.html`
- `css/style.css`
- `js/main.js`
- `README.md`

## Entrega en GitHub

1. Descomprimir el ZIP.
2. Crear un repositorio **público**, por ejemplo `pre-entrega-8-futbol6`.
3. Subir el contenido de la carpeta: `index.html`, `README.md`, `css` y `js`, manteniendo la estructura. No subir solamente el ZIP.
4. Compartir la URL del repositorio con Coderhouse.

Si actualizás el repositorio de tu entrega anterior, reemplazá los archivos correspondientes por esta versión.
