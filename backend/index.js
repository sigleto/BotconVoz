
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



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
