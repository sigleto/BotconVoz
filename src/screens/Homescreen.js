import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av'; // Asegúrate de que estás importando Audio de expo-av
import { detectIntent, synthesizeSpeech } from '../services/api'; // Importa correctamente


const HomeScreen = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [sound, setSound] = useState(); // Estado para el sonido

    
    // Función para solicitar permisos
    const requestPermissions = async () => {
        console.log("Solicitando permisos de micrófono...");
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission not granted', 'Please allow microphone access to use this feature.');
        }
    };

    useEffect(() => {
        requestPermissions(); // Llama a la función para solicitar permisos al montar el componente
    }, []);

    const handleSubmit = async () => {
        try {
            const result = await detectIntent('unique-session-id', query);
            console.log('Respuesta de detectIntent:', JSON.stringify(result, null, 2));
            setResponse(result.response);

            // Llamar a la síntesis de voz después de obtener la respuesta
            if (result.response) {
                const audioResult = await synthesizeSpeech(result.response);
                console.log('Respuesta de synthesizeSpeech:', audioResult);
                
                // Reproducir el audio usando el contenido en base64
                if (audioResult.audioContent) {
                    const { sound: playbackObject } = await Audio.Sound.createAsync(
                        { uri: `data:audio/mpeg;base64,${audioResult.audioContent}` }
                    );
                    setSound(playbackObject);
                    await playbackObject.playAsync(); // Reproduce el audio
                }
            }
        } catch (error) {
            console.error('Error en la detección de intentos:', error);
            Alert.alert('Error', 'No se pudo procesar la solicitud');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chatbot</Text>
            <TextInput 
                style={styles.input}
                placeholder="Escribe tu pregunta"
                placeholderTextColor="#aaa"
                value={query}
                onChangeText={setQuery}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <Text style={styles.responseText}>{response}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    responseText: {
        marginTop: 20,
        fontSize: 16,
    },
});

export default HomeScreen;
