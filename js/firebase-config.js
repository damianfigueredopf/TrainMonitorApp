// firebase-config.js - COPIA Y PEGA
// REEMPLAZA CON TUS DATOS DE FIREBASE

// Configuración de Firebase - DEBES REEMPLAZAR ESTO
const firebaseConfig = {
	 apiKey: "AIzaSyDA1IIn5dvgdAV-IXs08QAvYLttRtWmtHY",
	 authDomain: "trainmonitorpro-44a42.firebaseapp.com",
	 projectId: "trainmonitorpro-44a42",
	 storageBucket: "trainmonitorpro-44a42.firebasestorage.app",
	 messagingSenderId: "413638125632",
	 appId: "1:413638125632:web:1feaa0b1d860d0befd97a5",
	 measurementId: "G-90ZM1BQPCS"
};


// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener referencias
const auth = firebase.auth();
const db = firebase.firestore();

// Usuario demo para pruebas
const DEMO_USER = {
    email: "entrenador@test.com",
    password: "123456"
};