// 1. Base de datos simulada (Arrays y Objetos)
const espaciosUniversitarios = [
    {
        id: 1,
        nombre: "Sala 101",
        ubicacion: "Edificio A",
        capacidad: 35,
        tipo: "Sala de clases",
        caracteristicas: ["Proyector", "Pizarra inteligente"]
    },
    {
        id: 2,
        nombre: "Laboratorio Turing",
        ubicacion: "Edificio de Ingeniería",
        capacidad: 25,
        tipo: "Laboratorio",
        caracteristicas: ["25 Computadores", "Linux/Windows"]
    },
    {
        id: 3,
        nombre: "Cubo de Estudio 4",
        ubicacion: "Biblioteca Central",
        capacidad: 4,
        tipo: "Sala de estudio",
        caracteristicas: ["Aislamiento acústico", "Pizarra de vidrio"]
    }
];

// Arreglo para guardar las reservas del usuario
let misReservas = [];

// 2. Manipulación del DOM: Función para dibujar las tarjetas
function renderizarEspacios(espacios) {
    // "Enganchamos" el contenedor vacío que dejamos en el HTML
    const contenedor = document.getElementById("contenedor-espacios");
    
    // Limpiamos el texto inicial de "Cargando espacios..."
    contenedor.innerHTML = ""; 

    // Ciclo para recorrer cada espacio del arreglo
    espacios.forEach(espacio => {
        // Construimos el HTML de la tarjeta de Bootstrap para cada espacio
        const tarjetaHTML = `
            <div class="col-md-6">
                <div class="card h-100 shadow-sm border-0 border-start border-primary border-4">
                    <div class="card-body">
                        <h3 class="h5 card-title">${espacio.nombre}</h3>
                        <p class="card-text mb-1"><small><strong>Ubicación:</strong> ${espacio.ubicacion}</small></p>
                        <p class="card-text mb-1"><small><strong>Capacidad:</strong> ${espacio.capacidad} personas</small></p>
                        <p class="card-text mb-3"><small><strong>Tipo:</strong> ${espacio.tipo}</small></p>
                        <button class="btn btn-outline-primary btn-sm w-100" onclick="abrirFormulario(${espacio.id})">
                            Solicitar Reserva
                        </button>
                    </div>
                </div>
            </div>
        `;
        // Inyectamos la tarjeta en el contenedor
        contenedor.innerHTML += tarjetaHTML;
    });
}

// 3. Evento inicial: Ejecutar la función cuando la página cargue
document.addEventListener("DOMContentLoaded", () => {
    renderizarEspacios(espaciosUniversitarios);
});

// 4. Lógica de los filtros (Eventos y manipulación de Arrays)
document.getElementById("btn-filtrar").addEventListener("click", () => {
    
    // Capturamos lo que el usuario seleccionó en los menús desplegables
    const edificioSeleccionado = document.getElementById("filtro-edificio").value;
    const tipoSeleccionado = document.getElementById("filtro-tipo").value;

    // Filtramos el arreglo original basado en las selecciones
    const espaciosFiltrados = espaciosUniversitarios.filter(espacio => {
        // Verificamos si el edificio coincide (o si eligió "Todos")
        const coincideEdificio = (edificioSeleccionado === "todos") || (espacio.ubicacion === edificioSeleccionado);
        
        // Verificamos si el tipo de espacio coincide (o si eligió "Todos")
        const coincideTipo = (tipoSeleccionado === "todos") || (espacio.tipo === tipoSeleccionado);
        
        // El espacio solo se muestra si cumple ambas condiciones
        return coincideEdificio && coincideTipo;
    });

    // Volvemos a dibujar las tarjetas en el DOM, pero solo con las filtradas
    renderizarEspacios(espaciosFiltrados);
});
// 5. Instanciar el Modal de Bootstrap en JavaScript
const modalReserva = new bootstrap.Modal(document.getElementById('modalReserva'));
let espacioSeleccionado = null; // Variable para saber qué sala se está reservando

// 6. Función para abrir el formulario (Llamada desde el botón de la tarjeta)
function abrirFormulario(idEspacio) {
    // Buscamos el objeto completo de la sala usando .find()
    espacioSeleccionado = espaciosUniversitarios.find(espacio => espacio.id === idEspacio);
    
    // Cambiamos el título del modal dinámicamente
    document.getElementById("titulo-modal").innerText = `Reserva: ${espacioSeleccionado.nombre}`;
    
    // Mostramos el modal
    modalReserva.show();
}

// 7. Validación del formulario y creación de la reserva
document.getElementById("formulario-reserva").addEventListener("submit", (evento) => {
    // Evitamos que la página se recargue (comportamiento por defecto del formulario)
    evento.preventDefault();

    const fecha = document.getElementById("fecha-reserva").value;
    const hora = document.getElementById("hora-reserva").value;
    const mensajeError = document.getElementById("mensaje-error");

    // Validación: Comprobar que los campos no estén vacíos
    if (!fecha || !hora) {
        mensajeError.classList.remove("d-none"); // Mostramos el error
        return; // Cortamos la ejecución
    }

    // Ocultamos el error si todo está bien
    mensajeError.classList.add("d-none");

    // Creamos el objeto de la nueva reserva
    const nuevaReserva = {
        id: Date.now(), // Generamos un ID único con la fecha actual
        sala: espacioSeleccionado.nombre,
        fecha: fecha,
        hora: hora
    };

    // Agregamos la reserva al arreglo
    misReservas.push(nuevaReserva);

    // Limpiamos el formulario y cerramos el modal
    document.getElementById("formulario-reserva").reset();
    modalReserva.hide();

    // Actualizamos la interfaz
    renderizarReservas();
});

// 8. Función para mostrar las reservas en el panel derecho
function renderizarReservas() {
    const contenedorReservas = document.getElementById("contenedor-reservas");
    contenedorReservas.innerHTML = ""; // Limpiamos el panel

    if (misReservas.length === 0) {
        contenedorReservas.innerHTML = `<p class="text-muted text-center my-3">Aún no tienes reservas activas.</p>`;
        return;
    }

    // Recorremos el arreglo de reservas y creamos el HTML
    misReservas.forEach(reserva => {
        const reservaHTML = `
            <div class="card mb-2 border-0 shadow-sm bg-light">
                <div class="card-body p-2 d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0 text-success">${reserva.sala}</h6>
                        <small class="text-muted">${reserva.fecha} | ${reserva.hora}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelarReserva(${reserva.id})">❌</button>
                </div>
            </div>
        `;
        contenedorReservas.innerHTML += reservaHTML;
    });
}

// 9. Función para cancelar (eliminar) una reserva
function cancelarReserva(idReserva) {
    // Filtramos el arreglo dejando fuera la reserva que queremos eliminar
    misReservas = misReservas.filter(reserva => reserva.id !== idReserva);
    renderizarReservas(); // Volvemos a dibujar el panel
}