import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const App = () => {
    const [response, setResponse] = useState('Henüz yanıt yok');
    const [loading, setLoading] = useState(false);

    // Yeni URL
    const apiUrl = 'http://192.168.1.150:8080/internai/api/test';

    const handlePress = async () => {
        setLoading(true);  // Yükleniyor durumu
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`HTTP hatası! Durum: ${res.status}`);
            const data = await res.text();  // Yanıtın text olarak alınması
            setResponse(data);
        } catch (error) {
            console.error('Hata:', error.message);
            setResponse('İstek başarısız');
            Alert.alert('Hata', 'Bir şeyler yanlış gitti.');
        } finally {
            setLoading(false);  // Yükleniyor durumu bitti
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Backend Yanıtı</Text>
            <Text style={styles.response}>{response}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#00b5e2" style={styles.loader} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>Veriyi Çek</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.footer}>Powered by React Native</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F8FF', // Hafif mavi arka plan
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 20,
        textAlign: 'center',
    },
    response: {
        fontSize: 18,
        textAlign: 'center',
        color: '#34495E',
        marginBottom: 40,
        fontStyle: 'italic',
        maxWidth: '90%', // Yani metnin çok uzun olmaması için limit
    },
    button: {
        backgroundColor: '#00b5e2',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 3, // Butonun üzerine gelince gölge efekti
        shadowColor: "#000", // Gölge rengi
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        fontSize: 14,
        color: '#7F8C8D',
        fontStyle: 'italic',
    },
    loader: {
        marginBottom: 30,
    }
});

export default App;
