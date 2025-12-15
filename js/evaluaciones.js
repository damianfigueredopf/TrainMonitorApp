// evaluaciones.js - FUNCIONES DE EVALUACIONES
// COPIA Y PEGA TODO

// Mostrar instrucciones de test
function mostrarInstrucciones(tipoTest) {
    const instrucciones = {
        'YTR1': `YO-YO TEST RECOVERY 1:
        • 2 x 20m ida y vuelta
        • 5 segundos de recuperación entre repeticiones
        • Velocidad aumenta progresivamente
        • Finaliza cuando no se complete el recorrido a tiempo
        • Registrar distancia total alcanzada`,
        
        'SJ': `SQUAT JUMP (SJ):
        • Posición inicial: 90° de flexión de rodillas
        • Sin contramovimiento previo
        • Mantener manos en caderas
        • Saltar verticalmente máximo posible
        • Medir altura en centímetros`,
        
        'VELOCIDAD': `TEST DE VELOCIDAD:
        • 10m: Aceleración máxima
        • 20m: Velocidad de transición
        • 30m: Velocidad máxima
        • Usar cronómetro manual o apps
        • Realizar 3 intentos, registrar mejor tiempo`
    };
    
    alert(instrucciones[tipoTest] || "Instrucciones no disponibles");
}

// Nueva evaluación
function nuevaEvaluacion(tipoTest) {
    if (jugadores.length === 0) {
        alert("Primero debes agregar jugadores");
        mostrarSeccion('jugadores');
        return;
    }
    
    let mensaje = `NUEVA EVALUACIÓN: ${tipoTest}\n\nSelecciona un jugador:\n\n`;
    jugadores.forEach((jugador, index) => {
        mensaje += `${index + 1}. ${jugador.nombre} (${jugador.posicion})\n`;
    });
    
    const seleccion = prompt(mensaje + "\nIngresa el número del jugador:");
    const index = parseInt(seleccion) - 1;
    
    if (isNaN(index) || index < 0 || index >= jugadores.length) {
        alert("Selección inválida");
        return;
    }
    
    const jugador = jugadores[index];
    
    // Pedir resultado según tipo de test
    let resultado = "";
    let unidad = "";
    
    switch(tipoTest) {
        case 'YTR1':
            resultado = prompt(`Ingresa distancia total (metros) para ${jugador.nombre}:`);
            unidad = "metros";
            break;
        case 'SJ':
        case 'CMJ':
        case 'Abalakov':
            resultado = prompt(`Ingresa altura del salto (cm) para ${jugador.nombre}:`);
            unidad = "cm";
            break;
        case 'VELOCIDAD':
            const tiempo10m = prompt(`Tiempo en 10m (segundos) para ${jugador.nombre}:`);
            const tiempo20m = prompt(`Tiempo en 20m (segundos):`);
            const tiempo30m = prompt(`Tiempo en 30m (segundos):`);
            resultado = `${tiempo10m}s / ${tiempo20m}s / ${tiempo30m}s`;
            unidad = "segundos";
            break;
        default:
            resultado = prompt(`Ingresa resultado para ${jugador.nombre}:`);
            unidad = "unidades";
    }
    
    if (!resultado) {
        alert("Evaluación cancelada");
        return;
    }
    
    // Crear objeto evaluación
    const nuevaEvaluacion = {
        id: Date.now().toString(),
        jugadorId: jugador.id,
        jugadorNombre: jugador.nombre,
        tipo: tipoTest,
        fecha: new Date().toISOString().split('T')[0],
        resultado: resultado,
        unidad: unidad,
        evaluador: usuarioActual.email
    };
    
    // Guardar evaluación
    if (usuarioActual.uid === "demo-user") {
        // Guardar localmente
        evaluaciones.push(nuevaEvaluacion);
        alert(`Evaluación registrada para ${jugador.nombre}\nResultado: ${resultado} ${unidad}`);
        actualizarHistorialEvaluaciones();
        actualizarEstadisticas();
    } else {
        // Guardar en Firebase
        db.collection('evaluaciones').add(nuevaEvaluacion)
            .then(() => {
                alert("Evaluación guardada exitosamente");
                cargarEvaluaciones();
            })
            .catch(error => {
                alert("Error: " + error.message);
            });
    }
}

// Actualizar historial de evaluaciones
function actualizarHistorialEvaluaciones() {
    const historial = document.getElementById('historialEvaluaciones');
    historial.innerHTML = '';
    
    if (evaluaciones.length === 0) {
        historial.innerHTML = '<p>No hay evaluaciones registradas</p>';
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    const ordenadas = [...evaluaciones].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
    ).slice(0, 10); // Mostrar solo las 10 más recientes
    
    ordenadas.forEach(eval => {
        const div = document.createElement('div');
        div.className = 'evaluacion-item';
        div.style.cssText = `
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        `;
        
        div.innerHTML = `
            <strong>${eval.jugadorNombre}</strong>
            <span style="float:right; color:#718096">${eval.fecha}</span>
            <p style="margin:5px 0">${eval.tipo}: ${eval.resultado} ${eval.unidad}</p>
        `;
        
        historial.appendChild(div);
    });
}

// Calcular VO2max para Yoyo Test
function calcularVO2maxYoyo(distanciaMetros) {
    // Fórmula simplificada
    return Math.round(0.0084 * distanciaMetros + 36.4);
}

// Calcular RSI para CMJ
function calcularRSI(alturaCm, tiempoContactoMs) {
    const alturaM = alturaCm / 100;
    const tiempoS = tiempoContactoMs / 1000;
    return (alturaM / tiempoS).toFixed(2);
}