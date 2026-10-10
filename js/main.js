const CLAVE_STORAGE = "plantelFutbol6";
const jugadorasIniciales = [
    { id: 1, nombre: "Martina Gómez", posicion: "Delantera", edad: 24 },
    { id: 2, nombre: "Sofía Pérez", posicion: "Arquera", edad: 27 },
    { id: 3, nombre: "Lucía Fernández", posicion: "Defensora", edad: 22 },
    { id: 4, nombre: "Camila Rodríguez", posicion: "Mediocampista", edad: 25 }
];

const formulario = document.querySelector("#form-jugadora");
const inputNombre = document.querySelector("#nombre");
const inputPosicion = document.querySelector("#posicion");
const inputEdad = document.querySelector("#edad");
const contenedorJugadoras = document.querySelector("#contenedor-jugadoras");
const mensaje = document.querySelector("#mensaje");
const buscador = document.querySelector("#buscador");
const cantidadJugadoras = document.querySelector("#cantidad-jugadoras");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botonGuardar = document.querySelector("#guardar-jugadora");
const botonCancelar = document.querySelector("#cancelar-edicion");
const botonVaciar = document.querySelector("#vaciar-plantel");
let idEnEdicion = null;
let temporizadorMensaje;

function mostrarMensaje(texto, tipo) {
    clearTimeout(temporizadorMensaje);
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    temporizadorMensaje = setTimeout(() => {
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }, 5000);
}

// Destructuring + optional chaining: los datos guardados podrían ser incompletos.
function esJugadoraValida(jugadora) {
    const { id, nombre, posicion, edad } = jugadora ?? {};
    return Number.isSafeInteger(id) && id > 0 &&
        typeof nombre === "string" && Boolean(nombre?.trim()) &&
        typeof posicion === "string" && Boolean(posicion?.trim()) &&
        Number.isInteger(edad) && edad >= 15 && edad <= 60;
}

// Se lee una sola vez al iniciar. Un array vacío guardado NO carga los ejemplos.
function recuperarJugadoras() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
        const lista = datos ?? jugadorasIniciales;
        if (!Array.isArray(lista) || !lista.every(esJugadoraValida) ||
            new Set(lista.map(({ id }) => id)).size !== lista.length) {
            mostrarMensaje("Los datos guardados no son válidos. El plantel inicia vacío.", "error");
            return [];
        }
        return lista.map((jugadora) => ({ ...jugadora }));
    } catch {
        mostrarMensaje("No se pudieron recuperar los datos. El plantel inicia vacío.", "error");
        return [];
    }
}

let jugadoras = recuperarJugadoras();

// Flujo central: actualizar array → guardar JSON → renderizar DOM.
// Si el navegador impide guardar, se restaura el estado anterior.
function actualizarEstado(nuevaLista) {
    const anterior = jugadoras;
    jugadoras = nuevaLista;
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(jugadoras));
    } catch {
        jugadoras = anterior;
        mostrarMensaje("No se pudo guardar el cambio. Revisá el almacenamiento del navegador.", "error");
        return false;
    }
    renderizarJugadoras();
    return true;
}

function renderizarJugadoras() {
    const texto = buscador.value.toLowerCase().trim();
    const lista = jugadoras.filter(({ nombre, posicion }) =>
        nombre.toLowerCase().includes(texto) || posicion.toLowerCase().includes(texto)
    );
    contenedorJugadoras.replaceChildren();
    cantidadJugadoras.textContent = `${jugadoras.length} jugadora${jugadoras.length !== 1 ? "s" : ""}`;
    botonVaciar.disabled = jugadoras.length === 0;

    if (lista.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "sin-resultados";
        aviso.textContent = jugadoras.length === 0 ? "El plantel está vacío. Agregá una jugadora." : "No se encontraron jugadoras.";
        contenedorJugadoras.append(aviso);
        return;
    }

    lista.forEach((jugadora) => {
        const { id, nombre, posicion, edad } = jugadora;
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-jugadora";
        const titulo = document.createElement("h3");
        titulo.textContent = nombre;
        const detallePosicion = document.createElement("p");
        detallePosicion.textContent = `Posición: ${posicion}`;
        const detalleEdad = document.createElement("p");
        detalleEdad.textContent = `Edad: ${edad} años`;
        tarjeta.append(titulo, detallePosicion, detalleEdad);
        ["editar", "eliminar"].forEach((accion) => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = `btn btn-${accion}`;
            boton.dataset.id = id;
            boton.dataset.accion = accion;
            boton.textContent = accion === "editar" ? "Editar" : "Eliminar";
            boton.setAttribute("aria-label", `${boton.textContent} a ${nombre}`);
            tarjeta.append(boton);
        });
        contenedorJugadoras.append(tarjeta);
    });
}

function cancelarEdicion() {
    idEnEdicion = null;
    formulario.reset();
    tituloFormulario.textContent = "Agregar jugadora";
    botonGuardar.textContent = "+ Agregar jugadora";
    botonCancelar.hidden = true;
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = inputNombre.value.trim();
    const posicion = inputPosicion.value.trim();
    const edad = Number(inputEdad.value);
    // Un ID nuevo es mayor que todos los existentes, incluso con altas seguidas.
    const id = idEnEdicion ?? Math.max(Date.now(), ...jugadoras.map(({ id }) => id + 1));
    const nuevaJugadora = { id, nombre, posicion, edad };
    if (!esJugadoraValida(nuevaJugadora)) {
        mostrarMensaje("Completá nombre y posición. La edad debe ser entera, entre 15 y 60.", "error");
        return;
    }
    const editando = idEnEdicion !== null;
    const nuevaLista = editando
        ? jugadoras.map((jugadora) => jugadora.id === id ? nuevaJugadora : jugadora)
        : [...jugadoras, nuevaJugadora];
    if (actualizarEstado(nuevaLista)) {
        mostrarMensaje(editando ? "Jugadora modificada y guardada." : "Jugadora agregada y guardada.", "exito");
        cancelarEdicion();
        inputNombre.focus();
    }
});

// Delegación de eventos: sigue funcionando después de cada renderizado.
contenedorJugadoras.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const { id: idTexto, accion } = boton.dataset;
    const id = Number(idTexto);
    const seleccionada = jugadoras.find((jugadora) => jugadora.id === id);
    if (!seleccionada) return;
    if (accion === "editar") {
        const { nombre, posicion, edad } = seleccionada;
        idEnEdicion = id;
        inputNombre.value = nombre;
        inputPosicion.value = posicion;
        inputEdad.value = edad;
        tituloFormulario.textContent = "Editar jugadora";
        botonGuardar.textContent = "Guardar cambios";
        botonCancelar.hidden = false;
        inputNombre.focus();
    } else if (accion === "eliminar") {
        if (actualizarEstado(jugadoras.filter((jugadora) => jugadora.id !== id))) {
            if (idEnEdicion === id) cancelarEdicion();
            mostrarMensaje("Jugadora eliminada del plantel y del almacenamiento.", "exito");
        }
    }
});

botonCancelar.addEventListener("click", cancelarEdicion);
buscador.addEventListener("input", renderizarJugadoras);
botonVaciar.addEventListener("click", () => {
    // Guardar [] conserva el vaciado al recargar, sin reponer los ejemplos.
    // Se modifica solo esta clave, sin borrar datos de otras aplicaciones.
    if (actualizarEstado([])) {
        cancelarEdicion();
        mostrarMensaje("Plantel vaciado y guardado.", "exito");
    }
});

renderizarJugadoras();
