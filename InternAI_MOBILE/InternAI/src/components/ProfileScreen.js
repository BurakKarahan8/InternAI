import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from '../components/HeaderBar'; // HeaderBar'ı çağırdık
import { useUser } from './UserContext'; // Kullanıcı bilgilerini almak için UserContext'i import ettik

const ProfileScreen = ({ navigation }) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser(); // Kullanıcı bilgilerini almak için useUser context'ini kullanıyoruz

  const [profilePicture, setProfilePicture] = useState(null); // Profil fotoğrafı için state ekliyoruz

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://192.168.147.159:8080/internai/api/github-languages/BurakKarahan8");
        const data = await response.json();
        setLanguages(data);
        setLoading(false);
      } catch (error) {
        console.error("Veriler çekilemedi:", error);
        setError("Veriler çekilemedi");
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Profil fotoğrafını Base64 olarak alıp state'e set ediyoruz
  useEffect(() => {
    if (user.profilePicture) {
      console.log(user.profilePicture); // Backend'den gelen Base64 string'ini konsola yazdırıyoruz
      setProfilePicture(user.profilePicture); // Backend'den gelen Base64 string'ini kullanıyoruz
    }
  }, [user.profilePicture]);

  const openDrawerMenu = () => {
    navigation.openDrawer();
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <HeaderBar openDrawer={openDrawerMenu} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          {/* Sol Taraf */}
          <View style={styles.leftSide}>
            <Image
              source={profilePicture ? { uri: `data:image/jpeg;base64,${profilePicture}` } : { uri: 'https://i.pravatar.cc/150' }} // Base64 profil fotoğrafı
              style={styles.avatar}
            />
            <Text style={styles.username}>{user.fullName || 'Burak Karahan'}</Text>
            <Text style={styles.info}>{user.role || 'Stajyer'}</Text>
            <Text style={styles.info}>{`E-posta: ${user.email || 'ornek@eposta.com'}`}</Text>
            <Text style={styles.info}>{`Lokasyon: ${user.location || 'Türkiye'}`}</Text>
          </View>

          {/* Sağ Taraf */}
          <View style={styles.rightSide}>
            <Text style={styles.sectionTitle}>Kullandığı Diller</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#667eea" />
            ) : error ? (
              <Text>{error}</Text>
            ) : languages.length > 0 ? (
              languages.map((lang, index) => (
                <View key={index} style={styles.languageBar}>
                  <Text style={styles.languageLabel}>
                    {lang.name} - {lang.percentage.toFixed(2)}%
                  </Text>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[styles.progressBarFill, { width: `${lang.percentage}%` }]}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text>Henüz dil bilgisi yok.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
  },
  leftSide: {
    alignItems: 'center',
    marginBottom: 30,
  },
  rightSide: {
    width: '100%',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  languageBar: {
    width: '100%',
    marginBottom: 20,
  },
  languageLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  progressBarBackground: {
    backgroundColor: '#ddd',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    backgroundColor: '#667eea',
    height: '100%',
    borderRadius: 10,
  },
});

export default ProfileScreen;
