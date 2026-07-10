import { UnidadSangre, GestorInventario } from './clases/tareas.js';

const inventario = new GestorInventario();

const formUnidad = document.getElementById('form-unidad');
const contenedorUnidades = document.getElementById('contenedor-unidades');
const buscador = document.getElementById('buscador');
const notificacion = document.getElementById('notificacion');
const relojSistema = document.getElementById('reloj-sistema');

// Reloj
setInterval(() => {
    const ahora = new Date();
    relojSistema.textContent = `Sistema Activo - ${ahora.toLocaleTimeString()}`;
}, 1000);

const cargarDatosIniciales = async () => {
    try {
        const datosLocales = JSON.parse(localStorage.getItem('stockSangre')) || [];
        if (datosLocales.length > 0) {
            datosLocales.forEach(dato => inventario.agregarUnidad(new UnidadSangre(dato)));
        } else {
            const respuesta = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
            const tareasFalsas = await respuesta.json();

            const gruposDisponibles = ['O+', 'AB-', 'O-', 'A+', 'B+'];
            const componentesDisponibles = ['Plasma', 'Glóbulos Rojos', 'Plaquetas'];

            tareasFalsas.forEach((tarea, index) => {
                inventario.agregarUnidad(new UnidadSangre({
                    id: `BCO-${tarea.id}`,
                    grupoFactor: gruposDisponibles[index % gruposDisponibles.length],
                    componente: componentesDisponibles[index % componentesDisponibles.length],
                    estado: 'Disponible'
                }));
            });
        }
        renderizarInventario();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
};

const guardarEnLocalStorage = () => {
    localStorage.setItem('stockSangre', JSON.stringify(inventario.obtenerUnidades()));
};

// Evento SUBMIT
formUnidad.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('id-unidad').value.trim();
    const grupoFactor = document.getElementById('grupo-factor').value;
    const componente = document.getElementById('componente').value;

    // Revisar si el ID ya existe
    if (inventario.existeId(id)) {
        notificacion.textContent = `⚠️ Error: El ID ${id} ya está registrado en el sistema.`;
        notificacion.className = "notificacion error";
        return;
    }

    // Registrar unidad
    const nuevaUnidad = new UnidadSangre({ id, grupoFactor, componente });
    inventario.agregarUnidad(nuevaUnidad);

    renderizarInventario();
    guardarEnLocalStorage();
    formUnidad.reset();

    notificacion.textContent = `⏳ Enviando Unidad ${id} a Laboratorio para análisis...`;
    notificacion.className = "notificacion info";

    // setTimeout  
    setTimeout(() => {
        if (nuevaUnidad.estado === "En Análisis") {
            nuevaUnidad.cambiarEstado("Disponible");
            renderizarInventario();
            guardarEnLocalStorage();

            notificacion.textContent = `✅ Análisis completo: Unidad ${nuevaUnidad.id} aprobada y disponible.`;
            notificacion.className = "notificacion exito";
            setTimeout(() => notificacion.className = "notificacion oculto", 3000);
        }
    }, 2500);
});

// Buscador
buscador.addEventListener('keyup', (e) => {
    const textoBuscado = e.target.value.toLowerCase();
    const unidadesFiltradas = inventario.obtenerUnidades().filter(u =>
        u.grupoFactor.toLowerCase().includes(textoBuscado)
    );
    renderizarInventario(unidadesFiltradas);
});

const renderizarInventario = (lista = inventario.obtenerUnidades()) => {
    contenedorUnidades.innerHTML = '';

    lista.forEach(unidad => {
        const tarjeta = document.createElement('div');

        let claseEstado = "disponible";
        if (unidad.estado === "En Análisis") claseEstado = "analisis";
        if (unidad.estado === "Bloqueado") claseEstado = "bloqueado";

        tarjeta.className = `tarjeta ${claseEstado}`;

        let botonesHTML = '';

        if (unidad.estado === 'Bloqueado') {
            botonesHTML += `<button class="btn-desbloquear" data-id="${unidad.id}">🔓 Desbloquear</button>`;
            botonesHTML += `<button class="btn-desechar" data-id="${unidad.id}">🗑️ Desechar</button>`;
        } else {
            botonesHTML += `<button class="btn-bloquear" data-id="${unidad.id}">🔒 Bloquear</button>`;
            botonesHTML += `<button class="btn-utilizar" data-id="${unidad.id}">💉 Utilizar</button>`;
            botonesHTML += `<button class="btn-desechar" data-id="${unidad.id}">🗑️ Desechar</button>`;
        }

        tarjeta.innerHTML = `
            <h3>Unidad: ${unidad.id}</h3>
            <p><strong>Grupo:</strong> ${unidad.grupoFactor}</p>
            <p><strong>Componente:</strong> ${unidad.componente}</p>
            <p><strong>Estado:</strong> <span class="badge ${claseEstado}">${unidad.estado}</span></p>
            <div class="acciones-tarjeta">
                ${botonesHTML}
            </div>
        `;

        tarjeta.addEventListener('mouseover', () => tarjeta.style.transform = 'scale(1.02)');
        tarjeta.addEventListener('mouseout', () => tarjeta.style.transform = 'scale(1)');

        contenedorUnidades.appendChild(tarjeta);
    });

    asignarEventosBotones();
};

const asignarEventosBotones = () => {
    //Boton desechar
    document.querySelectorAll('.btn-desechar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            inventario.eliminarUnidad(id);
            notificacion.textContent = `🗑️ Unidad ${id} descartada y eliminada del inventario.`;
            notificacion.className = "notificacion alerta";
            setTimeout(() => notificacion.className = "notificacion oculto", 3000);
            renderizarInventario();
            guardarEnLocalStorage();
        });
    });

    // Botón Utilizar
    document.querySelectorAll('.btn-utilizar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            inventario.eliminarUnidad(id);
            notificacion.textContent = `💉 Unidad ${id} despachada con éxito para transfusión.`;
            notificacion.className = "notificacion exito";
            setTimeout(() => notificacion.className = "notificacion oculto", 3000);
            renderizarInventario();
            guardarEnLocalStorage();
        });
    });

    // Botón Bloquear 
    document.querySelectorAll('.btn-bloquear').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const unidad = inventario.obtenerUnidades().find(u => u.id === id);
            if (unidad) {
                unidad.cambiarEstado("Bloqueado");
                notificacion.textContent = `🔒 Unidad ${id} bloqueada por seguridad. Requiere revisión manual.`;
                notificacion.className = "notificacion alerta";
                setTimeout(() => notificacion.className = "notificacion oculto", 3000);
                renderizarInventario();
                guardarEnLocalStorage();
            }
        });
    });
    // Botón Desbloquear
    document.querySelectorAll('.btn-desbloquear').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const unidad = inventario.obtenerUnidades().find(u => u.id === id);
            if (unidad) {
                unidad.cambiarEstado("Disponible");
                notificacion.textContent = `🔓 Unidad ${id} desbloqueada con éxito.`;
                notificacion.className = "notificacion info";
                setTimeout(() => notificacion.className = "notificacion oculto", 3000);
                renderizarInventario();
                guardarEnLocalStorage();
            }
        });
    });
};

cargarDatosIniciales();