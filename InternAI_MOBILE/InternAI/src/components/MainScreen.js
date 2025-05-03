import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from '../components/HeaderBar'; // HeaderBar'ı çağırdık

const MainScreen = ({ navigation }) => {
    const internships = [
        { id: '1', title: 'Frontend Stajı (React)', company: 'Arçelik Teknoloji', location: 'İstanbul' },
        { id: '2', title: 'Backend Stajı (Java Spring)', company: 'Vestel Teknoloji', location: 'Ankara' },
    ];

    const openDrawerMenu = () => {
        navigation.openDrawer();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.location}>{item.location}</Text>
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
            <HeaderBar openDrawer={openDrawerMenu} />
            <FlatList
                data={internships}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={
                    <Text style={styles.header}>Mevcut Staj İlanları</Text>
                }
                contentContainerStyle={styles.listContent}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    listContent: {
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    company: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    location: {
        fontSize: 14,
        color: '#999',
    },
});

export default MainScreen;
