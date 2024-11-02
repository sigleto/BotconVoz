// src/controllers/speechController.js
const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');
require('dotenv').config(); // Carga el archivo .env

const client = new textToSpeech.TextToSpeechClient();

// Controlador para la síntesis de voz
const synthesizeSpeech = async (req, res) => {
    const { text } = req.body;

    // Validar que el texto no esté vacío
    if (!text) {
        return res.status(400).send('El texto es obligatorio');
    }

    const request = {
        input: { text },
        voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const audioContent = response.audioContent; // Obtiene el contenido de audio
        console.log(`Audio generado con éxito`); // Log para confirmar generación exitosa
        
        // Asegúrate de que el contenido de audio no sea undefined o null
        if (!audioContent) {
            return res.status(500).send('Error al generar contenido de audio');
        }

        res.json({ audioContent: audioContent.toString('base64') }); // Envía el contenido en base64 al cliente
    } catch (error) {
        console.error('Error al sintetizar voz:', error);
        res.status(500).send('Error al sintetizar voz');
    }
};

module.exports = {
    synthesizeSpeech,
};
