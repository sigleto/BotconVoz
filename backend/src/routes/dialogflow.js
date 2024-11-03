const { SessionsClient } = require('@google-cloud/dialogflow-cx');
const express = require('express');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

// Exporta una función que toma `credentials` como argumento
module.exports = (credentials) => {
    // Usa `credentials` para inicializar `SessionsClient`
    const client = new SessionsClient({
        credentials,
        apiEndpoint: 'europe-west2-dialogflow.googleapis.com',
    });

    // Controlador para detectar intentos de Dialogflow
    const detectIntent = async (req, res) => {
        console.log('Ruta /api/dialogflow/detect llamada con:', req.body);
        const sessionId = req.body.sessionId;
        const queryInput = {
            text: {
                text: req.body.query,
            },
            languageCode: 'es',
        };

        const sessionPath = `projects/botconvoz-440116/locations/europe-west2/agents/b99a4e07-cb3b-4668-9721-f1a53939cde2/sessions/${sessionId}`;

        try {
            const [response] = await client.detectIntent({ session: sessionPath, queryInput });
            const messages = response.queryResult.responseMessages;
            const textResponse = messages.map(msg => msg.text.text).join(' '); // Unir todos los mensajes de texto

            res.json({ response: textResponse }); // Enviar la respuesta al cliente
        } catch (error) {
            console.error('Error al detectar intentos:', error);
            res.status(500).send('Error al detectar intentos');
        }
    };

    // Controlador para la síntesis de voz
    const synthesizeSpeech = async (req, res) => {
        const { text } = req.body;

        const ttsClient = new textToSpeech.TextToSpeechClient({
            credentials,
        });
        const request = {
            input: { text },
            voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        try {
            const [response] = await ttsClient.synthesizeSpeech(request);
            const outputFileName = 'output.mp3';
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(outputFileName, response.audioContent, 'binary');
            console.log(`Audio guardado en ${outputFileName}`);
            res.json({ audioFile: outputFileName });
        } catch (error) {
            console.error('Error al sintetizar voz:', error);
            res.status(500).send('Error al sintetizar voz');
        }
    };

    // Definir las rutas
    router.post('/detect', detectIntent);
    router.post('/synthesize', synthesizeSpeech);

    return router;  // Retorna el router con las rutas configuradas
};
