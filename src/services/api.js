import axios from 'axios';

// Cambia localhost por la IP de tu servidor backend
const API_URL = 'https://botconvoz.onrender.com/api/dialogflow/';

export const detectIntent = async (sessionId, query) => {    
    console.log('Solicitud recibida:');

    try { 
        const response = await axios.post(`${API_URL}/detect`, { sessionId, query });
        return response.data;
    } catch (error) {
        console.error('Error al comunicarse con el backend:', error);
        throw error;
    }
};

export const synthesizeSpeech = async (text) => {
    console.log('Solicitud de síntesis de voz recibida:', text);

    try {
        const response = await axios.post(`${API_URL}/synthesize`, { text });
        console.log('Respuesta de síntesis de voz:', response.data);

        if (response.data) {
            console.log('audioContent recibido, longitud:', response.data.audioContent);
            return response.data.audioContent; // Retorna el audio en base64
        } else {
            console.error('No se recibió audioContent en la respuesta');
            throw new Error('No se recibió audioContent en la respuesta');
        }
    } catch (error) {
        console.error('Error al comunicarse con el backend en synthesizeSpeech:', error);
        throw error;
    }
};
