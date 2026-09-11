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

// Variables globales del sistema
let misReservas = [];
let correoUsuarioActual = "";
let espacioSeleccionado = null; 

// 2. Inicialización de Modales y Evento de Carga Principal
let modalLogin;
let modalReserva;

document.addEventListener("DOMContentLoaded", () => {
    // Instanciamos los modales de Bootstrap una vez que cargó el HTML
    modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
    modalReserva = new bootstrap.Modal(document.getElementById('modalReserva'));
    
    // Mostramos el login obligatorio y dibujamos las tarjetas
    modalLogin.show();
    renderizarEspacios(espaciosUniversitarios);
});

// 3. Lógica de inicio de sesión simulado
document.getElementById("formulario-login").addEventListener("submit", (evento) => {
    evento.preventDefault();
    correoUsuarioActual = document.getElementById("login-email").value;
    
    console.log(`Sesión iniciada como: ${correoUsuarioActual}`);
    modalLogin.hide();
});

// 4. Función para dibujar las tarjetas de los espacios
function renderizarEspacios(espacios) {
    const contenedor = document.getElementById("contenedor-espacios");
    contenedor.innerHTML = ""; 

    espacios.forEach(espacio => {
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
        contenedor.innerHTML += tarjetaHTML;
    });
}

// 5. Lógica de los filtros de búsqueda
document.getElementById("btn-filtrar").addEventListener("click", () => {
    const edificioSeleccionado = document.getElementById("filtro-edificio").value;
    const tipoSeleccionado = document.getElementById("filtro-tipo").value;

    const espaciosFiltrados = espaciosUniversitarios.filter(espacio => {
        const coincideEdificio = (edificioSeleccionado === "todos") || (espacio.ubicacion === edificioSeleccionado);
        const coincideTipo = (tipoSeleccionado === "todos") || (espacio.tipo === tipoSeleccionado);
        return coincideEdificio && coincideTipo;
    });

    renderizarEspacios(espaciosFiltrados);
});

// 6. Función para abrir el formulario de reserva
function abrirFormulario(idEspacio) {
    espacioSeleccionado = espaciosUniversitarios.find(espacio => espacio.id === idEspacio);
    document.getElementById("titulo-modal").innerText = `Reserva: ${espacioSeleccionado.nombre}`;
    modalReserva.show();
}

// 7. Validación del formulario de reserva, control de topes y simulación de correo
document.getElementById("formulario-reserva").addEventListener("submit", (evento) => {
    evento.preventDefault();

    const fecha = document.getElementById("fecha-reserva").value;
    const hora = document.getElementById("hora-reserva").value;
    const mensajeError = document.getElementById("mensaje-error");

    // Validación 1: Campos vacíos
    if (!fecha || !hora) {
        mensajeError.innerText = "Por favor, completa todos los campos.";
        mensajeError.classList.remove("d-none"); 
        return; 
    }

    // Validación 2: Verificar si la sala ya está ocupada en esa fecha y hora
    const estaOcupado = misReservas.some(reserva => 
        reserva.sala === espacioSeleccionado.nombre && 
        reserva.fecha === fecha && 
        reserva.hora === hora
    );

    if (estaOcupado) {
        mensajeError.innerText = "❌ Este espacio ya se encuentra reservado en ese horario.";
        mensajeError.classList.remove("d-none");
        return;
    }

    mensajeError.classList.add("d-none");

    const nuevaReserva = {
        id: Date.now(), 
        sala: espacioSeleccionado.nombre,
        fecha: fecha,
        hora: hora,
        usuario: correoUsuarioActual // Se vincula al correo ingresado al inicio
    };

    misReservas.push(nuevaReserva);

    document.getElementById("formulario-reserva").reset();
    modalReserva.hide();
    renderizarReservas();
    
    // Alerta simulando el envío del correo electrónico
    alert(`✅ Reserva confirmada. Se ha enviado un comprobante a ${correoUsuarioActual}`);
});

// 8. Función para mostrar las reservas activas
function renderizarReservas() {
    const contenedorReservas = document.getElementById("contenedor-reservas");
    contenedorReservas.innerHTML = ""; 

    if (misReservas.length === 0) {
        contenedorReservas.innerHTML = `<p class="text-muted text-center my-3">Aún no tienes reservas activas.</p>`;
        return;
    }

    misReservas.forEach(reserva => {
        const reservaHTML = `
            <div class="card mb-2 border-0 shadow-sm bg-light">
                <div class="card-body p-2 d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0 text-success">${reserva.sala}</h6>
                        <small class="text-muted">${reserva.fecha} | ${reserva.hora}</small>
                        <br><small class="text-primary" style="font-size: 0.75rem;">${reserva.usuario}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelarReserva(${reserva.id})">❌</button>
                </div>
            </div>
        `;
        contenedorReservas.innerHTML += reservaHTML;
    });
}

// 9. Función para cancelar una reserva
function cancelarReserva(idReserva) {
    misReservas = misReservas.filter(reserva => reserva.id !== idReserva);
    renderizarReservas(); 
}