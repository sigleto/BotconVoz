// speechController.js
const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

exports.synthesizeSpeech = async (req, res) => {
    const { text } = req.body;

    const request = {
        input: { text },
        voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);

        if (response.audioContent) {
            const audioContent = response.audioContent.toString('base64');
            console.log('Audio en base64 generado correctamente');
            res.json({ audioContent });
        } else {
            console.error('No se generó audioContent');
            res.status(500).json({ error: 'No se generó audioContent' });
        }
    } catch (error) {
        console.error('Error al sintetizar voz:', error);
        res.status(500).json({ error: 'Error al sintetizar voz' });
    }
};
