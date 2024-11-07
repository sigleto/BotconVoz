//src/screens/Homescreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { detectIntent, synthesizeSpeech } from '../services/api';


const HomeScreen = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // Solicitar permisos de audio al cargar el componente
        (async () => {
            await Audio.requestPermissionsAsync();
        })();
    }, []);


    const playAudio = async (audioContent) => {
        const { sound } = await Audio.Sound.createAsync({
            uri: `data:audio/mp3;base64,${audioContent}`,
        });
        await sound.playAsync();
    };
  
    const handleSubmit = async () => {
        if (!query.trim()) {
            Alert.alert('Error', 'Por favor, ingresa una pregunta');
            return;
        }
        setIsLoading(true);
        try {
            const result = await detectIntent('unique-session-id', query);
            console.log('Respuesta de detectIntent:', JSON.stringify(result, null, 2));
            setResponse(result.response);

            if (result.response) {
                const audioBuffer = await synthesizeSpeech(result.response);
                console.log('Audio Buffer recibido completo:', JSON.stringify(audioBuffer));  // Agrega este log
                await playAudio(audioBuffer);
            }
        } catch (error) {
            console.error('Error en la detección de intentos:', error);
            Alert.alert('Error', 'No se pudo procesar la solicitud');
        } finally {
            setIsLoading(false);
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
            <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Procesando...' : 'Enviar'}
                </Text>
            </TouchableOpacity>
           {response ? (
                <View style={styles.responseContainer}>
                    <Text style={styles.responseTitle}>Respuesta:</Text>
                    <Text style={styles.responseText}>{response}</Text>
                </View>
            ) : null}
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
