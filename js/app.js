// app.js - FUNCIONES PRINCIPALES
// COPIA Y PEGA TODO

// Variables globales
let usuarioActual = null;
let jugadores = [];
let evaluaciones = [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay usuario logueado
    auth.onAuthStateChanged((user) => {
        if (user) {
            usuarioActual = user;
            iniciarApp();
        } else {
            mostrarLogin();
        }
    });
});

// Mostrar sección de login
function mostrarLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
    document.querySelector('.navbar').style.display = 'none';
}

// Iniciar sesión
function iniciarSesion() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Para pruebas rápidas, usar credenciales demo
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
        // Crear usuario demo local
        usuarioActual = { email: email, uid: "demo-user" };
        iniciarApp();
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            usuarioActual = userCredential.user;
            iniciarApp();
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// Crear cuenta nueva
function registrarse() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert("Por favor completa todos los campos");
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert("Cuenta creada. Ahora puedes iniciar sesión.");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

// Cerrar sesión
function cerrarSesion() {
    auth.signOut()
        .then(() => {
            usuarioActual = null;
            mostrarLogin();
        })
        .catch((error) => {
            alert("Error cerrando sesión: " + error.message);
        });
}

// Iniciar aplicación principal
function iniciarApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    document.querySelector('.navbar').style.display = 'flex';
    
    // Mostrar dashboard por defecto
    mostrarSeccion('dashboard');
    
    // Cargar datos
    cargarDatosIniciales();
}

// Cargar datos iniciales
function cargarDatosIniciales() {
    if (usuarioActual.uid === "demo-user") {
        // Usar datos demo
        cargarDatosDemo();
    } else {
        // Cargar datos reales de Firebase
        cargarJugadores();
        cargarEvaluaciones();
    }
    
    actualizarEstadisticas();
}

// Cargar datos demo
function cargarDatosDemo() {
    jugadores = [
        {
            id: "1",
            nombre: "Juan Pérez",
            email: "juan@email.com",
            posicion: "Delantero",
            peso: 75,
            estatura: 180,
            estado: "Activo"
        },
        {
            id: "2",
            nombre: "Carlos Gómez",
            email: "carlos@email.com",
            posicion: "Mediocentro",
            peso: 70,
            estatura: 175,
            estado: "Activo"
        },
        {
            id: "3",
            nombre: "Miguel Torres",
            email: "miguel@email.com",
            posicion: "Defensa",
            peso: 80,
            estatura: 185,
            estado: "Lesionado"
        }
    ];
    
    evaluaciones = [
        {
            id: "1",
            jugadorId: "1",
            jugadorNombre: "Juan Pérez",
            tipo: "YTR1",
            fecha: "2024-01-15",
            resultado: 2400,
            unidad: "metros"
        },
        {
            id: "2",
            jugadorId: "2",
            jugadorNombre: "Carlos Gómez",
            tipo: "CMJ",
            fecha: "2024-01-14",
            resultado: 42,
            unidad: "cm"
        }
    ];
    
    actualizarListaJugadores();
    actualizarHistorialEvaluaciones();
}

// Mostrar sección específica
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    const secciones = ['dashboard', 'jugadores', 'evaluaciones', 'sesiones', 'cargas'];
    secciones.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(seccionId).style.display = 'block';
    
    // Actualizar datos si es necesario
    if (seccionId === 'jugadores') {
        actualizarListaJugadores();
    } else if (seccionId === 'evaluaciones') {
        actualizarHistorialEvaluaciones();
    }
}

// Actualizar estadísticas del dashboard
function actualizarEstadisticas() {
    document.getElementById('totalJugadores').textContent = jugadores.length;
    document.getElementById('totalEvaluaciones').textContent = evaluaciones.length;
    
    // Calcular carga semanal (demo)
    let carga = 0;
    jugadores.forEach(j => {
        if (j.cargaSemanal) carga += j.cargaSemanal;
    });
    document.getElementById('cargaSemanal').textContent = carga;
    
    // Jugadores en riesgo (demo)
    const enRiesgo = jugadores.filter(j => j.estado === "Lesionado" || (j.fatiga && j.fatiga > 7)).length;
    document.getElementById('jugadoresRiesgo').textContent = enRiesgo;
    
    // Actualizar alertas
    actualizarAlertas();
}

// Actualizar alertas
function actualizarAlertas() {
    const alertasLista = document.getElementById('alertasLista');
    alertasLista.innerHTML = '';
    
    // Alertas demo
    const alertas = [
        "Miguel Torres - Alta fatiga (8/10)",
        "Evaluación pendiente: Juan Pérez",
        "Carga semanal excedida en 15%"
    ];
    
    alertas.forEach(alerta => {
        const div = document.createElement('div');
        div.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${alerta}`;
        alertasLista.appendChild(div);
    });
}

// Filtrar jugadores
function filtrarJugadores() {
    const busqueda = document.getElementById('buscarJugador').value.toLowerCase();
    const posicion = document.getElementById('filtroPosicion').value;
    
    const filtrados = jugadores.filter(jugador => {
        const coincideNombre = jugador.nombre.toLowerCase().includes(busqueda);
        const coincidePosicion = !posicion || jugador.posicion === posicion;
        return coincideNombre && coincidePosicion;
    });
    
    mostrarJugadoresFiltrados(filtrados);
}

function mostrarJugadoresFiltrados(jugadoresFiltrados) {
    const lista = document.getElementById('listaJugadores');
    lista.innerHTML = '';
    
    jugadoresFiltrados.forEach(jugador => {
        const card = crearCardJugador(jugador);
        lista.appendChild(card);
    });
}

// Crear card de jugador
function crearCardJugador(jugador) {
    const div = document.createElement('div');
    div.className = 'jugador-card';
    
    div.innerHTML = `
        <h3>${jugador.nombre}</h3>
        <p><strong>Posición:</strong> ${jugador.posicion}</p>
        <p><strong>Peso:</strong> ${jugador.peso || 'N/A'} kg</p>
        <p><strong>Estatura:</strong> ${jugador.estatura || 'N/A'} cm</p>
        <div class="jugador-badges">
            <span class="badge posicion">${jugador.posicion}</span>
            <span class="badge estado">${jugador.estado || 'Activo'}</span>
        </div>
        <div class="jugador-acciones">
            <button class="btn-secondary" onclick="verJugador('${jugador.id}')">Ver</button>
            <button class="btn-primary" onclick="evaluarJugador('${jugador.id}')">Evaluar</button>
        </div>
    `;
    
    return div;
}

// Modal jugador
function mostrarModalJugador() {
    document.getElementById('modalJugador').style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Guardar jugador
function guardarJugador() {
    const nombre = document.getElementById('jugadorNombre').value;
    const email = document.getElementById('jugadorEmail').value;
    const nacimiento = document.getElementById('jugadorNacimiento').value;
    const posicion = document.getElementById('jugadorPosicion').value;
    
    if (!nombre || !posicion) {
        alert("Nombre y posición son obligatorios");
        return;
    }
    
    const nuevoJugador = {
        id: Date.now().toString(),
        nombre: nombre,
        email: email,
        fechaNacimiento: nacimiento,
        posicion: posicion,
        peso: 0,
        estatura: 0,
        estado: "Activo",
        fechaRegistro: new Date().toISOString()
    };
    
    if (usuarioActual.uid === "demo-user") {
        // Guardar localmente
        jugadores.push(nuevoJugador);
        actualizarListaJugadores();
        actualizarEstadisticas();
    } else {
        // Guardar en Firebase
        db.collection('jugadores').add(nuevoJugador)
            .then(() => {
                alert("Jugador guardado");
                cargarJugadores();
            })
            .catch(error => {
                alert("Error: " + error.message);
            });
    }
    
    cerrarModal('modalJugador');
    limpiarFormularioJugador();
}

function limpiarFormularioJugador() {
    document.getElementById('jugadorNombre').value = '';
    document.getElementById('jugadorEmail').value = '';
    document.getElementById('jugadorNacimiento').value = '';
    document.getElementById('jugadorPosicion').value = '';
}

// Actualizar lista de jugadores
function actualizarListaJugadores() {
    mostrarJugadoresFiltrados(jugadores);
}

// Ver jugador
function verJugador(jugadorId) {
    const jugador = jugadores.find(j => j.id === jugadorId);
    if (jugador) {
        alert(`Detalles de ${jugador.nombre}\nPosición: ${jugador.posicion}\nEstado: ${jugador.estado}`);
    }
}

// Evaluar jugador
function evaluarJugador(jugadorId) {
    const jugador = jugadores.find(j => j.id === jugadorId);
    if (jugador) {
        alert(`Evaluar a ${jugador.nombre}\n(Esta función se implementará próximamente)`);
        mostrarSeccion('evaluaciones');
    }
}

// Cargar jugadores de Firebase
function cargarJugadores() {
    db.collection('jugadores').get()
        .then((querySnapshot) => {
            jugadores = [];
            querySnapshot.forEach((doc) => {
                jugadores.push({ id: doc.id, ...doc.data() });
            });
            actualizarListaJugadores();
            actualizarEstadisticas();
        })
        .catch((error) => {
            console.error("Error cargando jugadores:", error);
        });
}

// Cargar evaluaciones de Firebase
function cargarEvaluaciones() {
    db.collection('evaluaciones').get()
        .then((querySnapshot) => {
            evaluaciones = [];
            querySnapshot.forEach((doc) => {
                evaluaciones.push({ id: doc.id, ...doc.data() });
            });
            actualizarHistorialEvaluaciones();
            actualizarEstadisticas();
        })
        .catch((error) => {
            console.error("Error cargando evaluaciones:", error);
        });
}