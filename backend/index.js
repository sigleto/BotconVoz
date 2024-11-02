
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

process.env.GOOGLE_APPLICATION_CREDENTIALS='./credenciales.json';

// Inicializa la aplicación de Express
const app = express();

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Rutas (puedes añadir aquí tu ruta para el Dialogflow)
const dialogflowRoutes = require('./src/routes/dialogflow');
app.use('/api/dialogflow/', dialogflowRoutes);



// Configuración del puerto
const PORT = 5000;

// Inicia el servidor
app.listen(PORT, '192.168.0.196', () =>{
    console.log(`Servidor corriendo en http://192.168.0.196:${PORT}`);
});
