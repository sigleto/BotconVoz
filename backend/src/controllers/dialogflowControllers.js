// src/controllers/dialogflowController.js
const dialogflow = require('@google-cloud/dialogflow-cx');
const { SessionsClient } = dialogflow;

const client = new SessionsClient({
    apiEndpoint: 'europe-west2-dialogflow.googleapis.com'
});

const detectIntent = async (req, res) => {
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
        //console.log('Respuesta de Dialogflow:', response.queryResult);

        // Acceder a los mensajes de respuesta y extraer el texto
        const messages = response.queryResult.responseMessages;
        const textResponse = messages.map(msg => msg.text ? msg.text.text.join(' ') : '').join(' ');

        res.json({ fulfillmentText: textResponse });
    } catch (error) {
        console.error('Error al detectar intentos:', error);
        res.status(500).send('Error al detectar intentos');
    }
};
module.exports = {
    detectIntent,
};
