// src/components/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from './HeaderBar'; // Yolu kontrol edin
import { useUser } from './UserContext'; // Yolu kontrol edin
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // İkonları import et
import { API_BASE_URL } from '@env';

const ProfileScreen = ({ navigation }) => {
  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Profil fotoğrafı doğrudan user context'inden base64 olarak geliyor
  const profilePictureBase64 = user?.profilePicture;

  const imageUri = profilePictureBase64
                ? `data:image/jpeg;base64,${profilePictureBase64}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  (user && user.fullName) ? user.fullName : 'U' // userData veya fullName yoksa 'U' kullan
                )}&background=283958&color=E0E0E0&size=150`; // Varsayılan avatar için yolu güncelleyin

  useEffect(() => {
    if (user && user.githubUsername) {
      const fetchLanguages = async () => {
        try {
          console.log(API_BASE_URL);
          setLoadingLanguages(true);
          setError(null);
          // GERÇEK API ENDPOINT'İ (IP adresinizi ve portunuzu kontrol edin)
          const response = await fetch(`${API_BASE_URL}/internai/api/github-languages/${user.githubUsername}`);
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Dil verileri çekilemedi (Hata ${response.status}): ${errorText || 'Sunucu hatası'}`);
          }
          const data = await response.json();
          setLanguages(data);
        } catch (error) {
          console.error("Dil verileri çekilemedi:", error);
          setError(error.message);
        } finally {
          setLoadingLanguages(false);
        }
      };
      fetchLanguages();
    } else {
      setLoadingLanguages(false);
      // setError("GitHub kullanıcı adı bulunamadı."); // Bu mesajı göstermek isteğe bağlı
    }
  }, [user]);

  const openDrawerMenu = () => {
    navigation.openDrawer();
  };

  // Kullanıcı bilgileri için render yardımcı fonksiyonu
  const renderInfoRow = (iconName, iconType, label, value) => (
    <View style={styles.infoRow}>
      {iconType === "Ionicons" ?
        <Ionicons name={iconName} size={20} color="#4A5568" style={styles.infoIcon} /> :
        <FontAwesome5 name={iconName} size={18} color="#4A5568" style={styles.infoIcon} />
      }
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || 'Belirtilmemiş'}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.gradient}>
      <HeaderBar openDrawer={openDrawerMenu} title="Profilim" navigation={navigation} showAppLogo={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: imageUri }} // Varsayılan avatar için yolu güncelleyin
              style={styles.avatar}
            />
            <Text style={styles.fullName}>{user?.fullName || 'Kullanıcı Adı'}</Text>
            <Text style={styles.username}>@{user?.username || 'kullanici_adi'}</Text>
          </View>

          <View style={styles.userInfoSection}>
            {renderInfoRow("mail-outline", "Ionicons", "E-posta", user?.email)}
            {renderInfoRow("logo-github", "Ionicons", "GitHub", user?.githubUsername)}
            {/* {renderInfoRow("location-outline", "Ionicons", "Lokasyon", user?.location)}  Eğer location varsa */}
            {/* {renderInfoRow("briefcase-outline", "Ionicons", "Rol", user?.role)} Eğer rol varsa */}
          </View>

          {user?.githubUsername && (
            <View style={styles.languagesSection}>
              <Text style={styles.sectionTitle}>GitHub Dil Kullanımı</Text>
              {loadingLanguages ? (
                <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 20 }} />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : languages.length > 0 ? (
                languages.map((lang, index) => (
                  <View key={index} style={styles.languageItem}>
                    <View style={styles.languageHeader}>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text style={styles.languagePercentage}>{lang.percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBarFill, { width: `${lang.percentage}%`, backgroundColor: lang.color || '#667eea' }]} />
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>GitHub dil verisi bulunamadı.</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: Platform.OS === 'ios' ? 15 : 10,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Tam daire
    borderWidth: 3,
    borderColor: '#667eea', // Ana renklerden biri
    marginBottom: 15,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748', // Koyu gri-mavi
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    color: '#718096', // Orta-açık gri
  },
  userInfoSection: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9', // Çok açık gri ayırıcı
  },
  infoRowLast: { // Son eleman için alt çizgiyi kaldırabilirsiniz
    borderBottomWidth: 0,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 15,
    color: '#4A5568', // Orta gri
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#2D3748',
    marginLeft: 'auto', // Değeri sağa yasla
    flexShrink: 1, // Uzun değerler için
    textAlign: 'right',
  },
  languagesSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageItem: {
    marginBottom: 15,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  languageName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  languagePercentage: {
    fontSize: 14,
    color: '#555',
  },
  progressBarContainer: {
    height: 10, // Daha ince progress bar
    borderRadius: 5,
    backgroundColor: '#E2E8F0', // Açık gri arka plan
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  errorText: {
    fontSize: 15,
    color: '#E53E3E', // Kırmızı
    textAlign: 'center',
    marginTop: 10,
  },
  noDataText: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;