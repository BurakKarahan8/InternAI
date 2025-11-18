// src/components/MyApplicationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from './HeaderBar'; // Proje yapınıza göre ../components/HeaderBar olabilir
import { useUser } from './UserContext'; // Proje yapınıza göre ../components/UserContext olabilir
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

const statusTurkishMap = {
    PENDING: "Beklemede",
    APPROVED: "Onaylandı",
    REJECTED: "Reddedildi",
    // Diğer olası durumlar buraya eklenebilir
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'APPROVED':
            return { color: '#28A745', icon: 'checkmark-circle-outline' }; // Yeşil
        case 'REJECTED':
            return { color: '#DC3545', icon: 'close-circle-outline' }; // Kırmızı
        case 'PENDING':
        default:
            return { color: '#FFC107', icon: 'hourglass-outline' }; // Sarı/Turuncu
    }
};

const MyApplicationsScreen = ({ navigation }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false); // Yenileme için state
    const { user } = useUser();

    const fetchApplications = useCallback(async (isRefresh = false) => {
        if (!user || !user.id) {
            setError("Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(false);
            if (isRefresh) setRefreshing(false);
            return;
        }

        if (!isRefresh) setLoading(true); // Sadece ilk yüklemede tam ekran loading göster
        setError(null);

        try {
            // GERÇEK API ENDPOINT'İ (IP adresinizi ve portunuzu kontrol edin)
            console.log(API_BASE_URL);
            const response = await fetch(`${API_BASE_URL}/api/applications/user/${user.id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Başvurular alınamadı (Hata ${response.status}): ${errorText || 'Sunucu hatası'}`);
            }
            const data = await response.json();
            setApplications(data);
        } catch (err) {
            console.error("Başvuru çekme hatası:", err);
            setError(err.message);
        } finally {
            if (!isRefresh) setLoading(false);
            if (isRefresh) setRefreshing(false);
        }
    }, [user]); // user değiştiğinde fetchApplications fonksiyonu yeniden oluşturulur

    useEffect(() => {
        // Ekran her odaklandığında verileri çek
        const unsubscribe = navigation.addListener('focus', () => {
            fetchApplications();
        });

        // İlk yükleme için de çağır
        fetchApplications();

        return unsubscribe; // Ekran destroy olduğunda listener'ı kaldır
    }, [navigation, fetchApplications]); // fetchApplications'ı bağımlılığa ekle

    const onRefresh = () => {
        setRefreshing(true);
        fetchApplications(true); // Yenileme olduğunu belirt
    };

    const openDrawerMenu = () => {
        navigation.openDrawer();
    };

    const renderApplicationItem = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);
        return (
            <View style={styles.card}>
                <Text style={styles.jobTitle}>{item.jobTitle || 'İlan Başlığı Yok'}</Text>
                <Text style={styles.companyName}>{item.companyName || 'Şirket Bilgisi Yok'}</Text>
                
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#555" style={styles.icon} />
                    <Text style={styles.detailText}>
                        Başvuru: {new Date(item.applyDate).toLocaleDateString("tr-TR", {
                            year: "numeric", month: "long", day: "numeric", // Saat bilgisi genellikle gerekmez
                        })}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name={statusStyle.icon} size={16} color={statusStyle.color} style={styles.icon} />
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>
                        Durum: {statusTurkishMap[item.status] || item.status}
                    </Text>
                </View>

                <Text style={styles.coverLetterLabel}>Ön Yazı/Not:</Text>
                <Text style={styles.coverLetterText} numberOfLines={3} ellipsizeMode="tail">
                    {item.coverLetter || 'Ön yazı bulunmuyor.'}
                </Text>
            </View>
        );
    };

    if (loading && !refreshing) { // Tam ekran loading sadece ilk yüklemede ve refreshing false ise
        return (
            <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.gradient}>
                <HeaderBar openDrawer={openDrawerMenu} title="Başvurularım" navigation={navigation} />
                <View style={styles.centeredContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Başvurular Yükleniyor...</Text>
                </View>
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.gradient}>
                <HeaderBar openDrawer={openDrawerMenu} title="Başvurularım" navigation={navigation} />
                <View style={styles.centeredContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color="rgba(255,200,200,0.8)" />
                    <Text style={styles.messageTextError}>Hata: {error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => fetchApplications()}>
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.gradient}>
            <HeaderBar openDrawer={openDrawerMenu} title="Başvurularım" navigation={navigation} showAppLogo={true} />
            {applications.length === 0 ? (
                <View style={styles.centeredContainer}>
                    <Ionicons name="file-tray-stacked-outline" size={60} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.messageText}>Henüz başvuru yapmadınız.</Text>
                </View>
            ) : (
                <FlatList
                    data={applications}
                    renderItem={renderApplicationItem}
                    keyExtractor={(item) => item.id.toString()} // Backend'den gelen ID'nin string olduğundan emin ol
                    contentContainerStyle={styles.listContentContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={ // Pull-to-refresh özelliği
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#fff']} // Android için spinner rengi
                            tintColor={'#fff'} // iOS için spinner rengi
                            progressBackgroundColor={'#555'} // Android için spinner arkaplanı
                        />
                    }
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    messageText: {
        marginTop: 15,
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    messageTextError: {
        marginTop: 15,
        fontSize: 17,
        color: 'rgba(255,200,200,0.9)',
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#283958',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContentContainer: {
        padding: Platform.OS === 'ios' ? 15 : 10,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        elevation: 4, // Android gölge
        shadowColor: '#000', // iOS gölge
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A202C', // Koyu Gri
        marginBottom: 4,
    },
    companyName: {
        fontSize: 15,
        color: '#4A5568', // Orta Gri
        marginBottom: 12,
        fontStyle: 'italic',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        marginRight: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#4A5568',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    coverLetterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748', // Biraz daha koyu gri
        marginTop: 10,
        marginBottom: 5,
    },
    coverLetterText: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 20,
    }
});

export default MyApplicationsScreen;