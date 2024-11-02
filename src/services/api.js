// src/services/api.js
import axios from 'axios';

// Cambia localhost por la IP de tu servidor backend
const API_URL = 'http://192.168.0.196:5000/api/dialogflow';


export const detectIntent = async (sessionId, query) => {    
 console.log('Solicitud recibida:')
    try { 
        const response = await axios.post(`${API_URL}/detect`, { sessionId, query })
        return response.data;
    } catch (error) {
        console.error('Error al comunicarse con el backend:', error);
        throw error;
    }
};

export const synthesizeSpeech = async (text) => {
    console.log('Solicitud de síntesis de voz recibida:');
    try {
        const response = await axios.post(`${API_URL}/synthesize`, { text });
        return response.data; // Asegúrate de que estás devolviendo lo que necesitas
    } catch (error) {
        console.error('Error al comunicarse con el backend en synthesizeSpeech:', error);
        throw error;
    }
};