// sesiones.js - FUNCIONES DE SESIONES Y CARGAS
// COPIA Y PEGA TODO

let sesiones = [];
let cargas = [];

// Crear nueva sesión
function crearSesion() {
    const nombre = document.getElementById('sesionNombre').value;
    const fecha = document.getElementById('sesionFecha').value;
    const tipo = document.getElementById('sesionTipo').value;
    
    if (!nombre || !fecha) {
        alert("Nombre y fecha son obligatorios");
        return;
    }
    
    const nuevaSesion = {
        id: Date.now().toString(),
        nombre: nombre,
        fecha: fecha,
        tipo: tipo,
        jugadores: [],
        ejercicios: []
    };
    
    if (usuarioActual.uid === "demo-user") {
        sesiones.push(nuevaSesion);
        alert(`Sesión "${nombre}" creada para ${fecha}`);
        actualizarCalendario();
    } else {
        db.collection('sesiones').add(nuevaSesion)
            .then(() => {
                alert("Sesión guardada");
            })
            .catch(error => {
                alert("Error: " + error.message);
            });
    }
    
    // Limpiar formulario
    document.getElementById('sesionNombre').value = '';
    document.getElementById('sesionFecha').value = '';
}

// Actualizar calendario
function actualizarCalendario() {
    const calendario = document.getElementById('calendario');
    calendario.innerHTML = '<h4>Calendario de Sesiones</h4>';
    
    sesiones.forEach(sesion => {
        const div = document.createElement('div');
        div.style.cssText = `
            padding: 10px;
            margin: 5px 0;
            background: #e6fffa;
            border-radius: 5px;
        `;
        div.innerHTML = `
            <strong>${sesion.nombre}</strong><br>
            <small>${sesion.fecha} - ${sesion.tipo}</small>
        `;
        calendario.appendChild(div);
    });
}

// Registrar carga de entrenamiento
function registrarCarga() {
    const jugadorId = document.getElementById('jugadorCarga').value;
    const rpe = parseFloat(document.getElementById('rpe').value);
    const duracion = parseFloat(document.getElementById('duracion').value);
    
    if (!jugadorId || !rpe || !duracion) {
        alert("Todos los campos son obligatorios");
        return;
    }
    
    if (rpe < 1 || rpe > 10) {
        alert("RPE debe estar entre 1 y 10");
        return;
    }
    
    const jugador = jugadores.find(j => j.id === jugadorId);
    if (!jugador) {
        alert("Jugador no encontrado");
        return;
    }
    
    const cargaSesion = rpe * duracion;
    const nuevaCarga = {
        id: Date.now().toString(),
        jugadorId: jugadorId,
        jugadorNombre: jugador.nombre,
        fecha: new Date().toISOString(),
        rpe: rpe,
        duracion: duracion,
        carga: cargaSesion
    };
    
    if (usuarioActual.uid === "demo-user") {
        cargas.push(nuevaCarga);
        alert(`Carga registrada para ${jugador.nombre}\nRPE: ${rpe}, Duración: ${duracion}min, Carga: ${cargaSesion}`);
        actualizarGraficoCargas();
    } else {
        db.collection('cargas').add(nuevaCarga)
            .then(() => {
                alert("Carga registrada");
            })
            .catch(error => {
                alert("Error: " + error.message);
            });
    }
    
    // Limpiar formulario
    document.getElementById('rpe').value = '';
    document.getElementById('duracion').value = '';
}

// Actualizar gráfico de cargas
function actualizarGraficoCargas() {
    const ctx = document.getElementById('graficoCargas');
    
    if (!ctx) return;
    
    // Preparar datos
    const ultimasCargas = cargas.slice(-7); // Últimas 7 cargas
    const fechas = ultimasCargas.map(c => 
        new Date(c.fecha).toLocaleDateString()
    );
    const valores = ultimasCargas.map(c => c.carga);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Carga de Entrenamiento',
                data: valores,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// Inicializar selector de jugadores para cargas
function inicializarSelectorCargas() {
    const selector = document.getElementById('jugadorCarga');
    selector.innerHTML = '<option value="">Seleccionar jugador</option>';
    
    jugadores.forEach(jugador => {
        const option = document.createElement('option');
        option.value = jugador.id;
        option.textContent = jugador.nombre;
        selector.appendChild(option);
    });
}

// Cuando se muestre la sección de cargas, inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Observar cambios en la sección activa
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'cargas' && 
                mutation.target.style.display === 'block') {
                inicializarSelectorCargas();
                actualizarGraficoCargas();
            }
        });
    });
    
    observer.observe(document.getElementById('cargas'), {
        attributes: true,
        attributeFilter: ['style']
    });
});