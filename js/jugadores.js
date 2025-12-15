// jugadores.js - FUNCIONES ADICIONALES DE JUGADORES
// COPIA Y PEGA TODO

// Esta función complementa app.js
// Puedes agregar aquí funciones específicas de jugadores

function exportarDatosJugadores() {
    if (jugadores.length === 0) {
        alert("No hay datos para exportar");
        return;
    }
    
    let csv = "Nombre,Posición,Peso,Estatura,Estado\n";
    jugadores.forEach(j => {
        csv += `${j.nombre},${j.posicion},${j.peso || ''},${j.estatura || ''},${j.estado || 'Activo'}\n`;
    });
    
    // Crear archivo descargable
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jugadores_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    alert(`Exportados ${jugadores.length} jugadores`);
}

function importarDesdeCSV() {
    alert("Esta función permite importar jugadores desde archivo CSV.\nPróximamente disponible.");
}

// Función para calcular IMC
function calcularIMC(jugador) {
    if (!jugador.peso || !jugador.estatura || jugador.estatura === 0) {
        return "N/A";
    }
    const estaturaM = jugador.estatura / 100;
    const imc = jugador.peso / (estaturaM * estaturaM);
    return imc.toFixed(1);
}

// Mostrar perfil completo del jugador
function verPerfilCompleto(jugadorId) {
    const jugador = jugadores.find(j => j.id === jugadorId);
    if (!jugador) return;
    
    const evaluacionesJugador = evaluaciones.filter(e => e.jugadorId === jugadorId);
    
    let mensaje = `PERFIL DE ${jugador.nombre.toUpperCase()}\n\n`;
    mensaje += `Posición: ${jugador.posicion}\n`;
    mensaje += `Peso: ${jugador.peso || 'N/A'} kg\n`;
    mensaje += `Estatura: ${jugador.estatura || 'N/A'} cm\n`;
    mensaje += `IMC: ${calcularIMC(jugador)}\n`;
    mensaje += `Estado: ${jugador.estado || 'Activo'}\n\n`;
    
    mensaje += `EVALUACIONES (${evaluacionesJugador.length}):\n`;
    evaluacionesJugador.forEach(eval => {
        mensaje += `• ${eval.fecha}: ${eval.tipo} - ${eval.resultado} ${eval.unidad}\n`;
    });
    
    alert(mensaje);
}