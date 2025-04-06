import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; // Hamburger ikonu için

const internships = [
    { id: '1', title: 'Frontend Stajı', company: 'ABC Teknoloji', location: 'İstanbul' },
    { id: '2', title: 'Backend Stajı', company: 'XYZ Yazılım', location: 'Ankara' },
    // Daha fazla staj eklenebilir...
];

// Navigation prop'unu alıyoruz (Drawer Navigator tarafından sağlanacak)
const MainScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        // InternshipDetail ekranı varsa ona yönlendirme yapabilirsiniz.
        // Şimdilik onPress'i kaldırıyorum veya log basıyorum.
        <TouchableOpacity style={styles.card} onPress={() => console.log('Navigating to detail for:', item.title)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.location}>{item.location}</Text>
        </TouchableOpacity>
    );

    // Drawer'ı açacak fonksiyon
    const openDrawerMenu = () => {
        navigation.openDrawer();
    };

    return (
        <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.gradient}
        >
            {/* Güncellenmiş Header Bar */}
            <View style={styles.headerBar}>
                <Text style={styles.logoText}>
                    <Text style={styles.internText}>Intern</Text>
                    <Text style={styles.aiText}>AI</Text>
                </Text>
                <TouchableOpacity onPress={openDrawerMenu} style={styles.menuButton}>
                    <FontAwesome name="bars" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={internships}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={
                    <Text style={styles.header}>Mevcut Staj İlanları</Text>
                }
                contentContainerStyle={styles.listContent} // Listenin içeriği için padding
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    headerBar: {
        marginTop: Platform.OS === 'android' ? 0 : 20, // Platforma göre ayar
        height: 70,
        width: '100%',
        backgroundColor: '#283958',
        flexDirection: 'row', // Öğeleri yan yana diz
        justifyContent: 'space-between', // Öğeler arasına boşluk koy (sol ve sağ)
        alignItems: 'center', // Dikeyde ortala
        paddingHorizontal: 15, // Yanlardan boşluk
    },
    logoText: {
        fontSize: 30, // SVG'deki font-size
        fontWeight: "bold", // SVG'deki font-weight
        fontFamily: "Arial", // SVG'deki font-family
        textAlign: "center",
    },
    internText: {
        color: "#f0b500", // Intern kısmının rengi
        fontStyle: "italic", // SVG'deki font-style
    },
    aiText: {
        color: "#e2e2e2", // AI kısmının rengi
    },
    menuButton: {
        padding: 10, // Dokunma alanını artır
    },
    // drawerContent stilleri CustomDrawerContent.js'e taşındı
    // drawerHeader stilleri CustomDrawerContent.js'e taşındı
    // drawerItem stilleri CustomDrawerContent.js'e taşındı
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: 'white', // Gradient üzerinde daha iyi görünmesi için
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Hafif transparan beyaz
        padding: 20,
        marginBottom: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Kart içindeki yazı rengi
    },
    company: {
        fontSize: 16,
        color: '#555', // Biraz daha koyu gri
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    listContent: {
        paddingBottom: 20, // Listenin sonuna boşluk ekle
    }
});

export default MainScreen;