// src/components/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { useUser } from './UserContext'; // Yolu kontrol edin
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import HeaderBar from './HeaderBar'; // Yolu kontrol edin
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // İkonları import et
import { API_BASE_URL } from '@env';

const SettingsScreen = ({ navigation }) => {
  const { user, setUser } = useUser();

  const [fullName, setFullName] = useState(user?.fullName || '');
  // const [currentPassword, setCurrentPassword] = useState(''); // Yorum satırında kalsın, backend'e göre
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [profilePictureBase64, setProfilePictureBase64] = useState(user?.profilePicture || null);

  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  useEffect(() => {
      setFullName(user?.fullName || '');
      setProfilePictureBase64(user?.profilePicture || null);
  }, [user]);

  const handleUpdateInfo = async () => {
    if (newPassword && newPassword !== confirmNewPassword) {
      Alert.alert("Şifre Hatası", "Yeni şifreler eşleşmiyor.");
      return;
    }

    setIsUpdatingInfo(true);
    try {
      const payload = {
        email: user?.email,
        fullName: fullName,
      };
      if (newPassword) {
        payload.password = newPassword;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // HAM YANITI METİN OLARAK AL VE LOGLA
      const responseText = await response.text();
      console.log("Update Info - Backend Ham Yanıtı (Metin):", responseText);
      console.log("Update Info - Backend Yanıt Durumu:", response.status);

      if (response.ok) {
        Alert.alert('Başarılı', 'Bilgileriniz güncellendi.');
        let updatedUserData = { ...user, fullName: fullName };
        // Başarılı yanıt JSON ise ve güncel kullanıcıyı içeriyorsa onu kullan
        try {
            const jsonData = JSON.parse(responseText);
            if (jsonData) { // Eğer backend güncellenmiş kullanıcıyı dönerse
                updatedUserData = {
                    ...user,
                    fullName: jsonData.fullName || fullName, // Gelen varsa onu al, yoksa state'dekini
                    // Diğer güncellenebilecek alanlar da burada jsonData'dan alınabilir.
                };
            }
        } catch (e) {
            console.warn("Update Info - Başarılı yanıt JSON değildi veya parse edilemedi.");
        }
        setUser(updatedUserData);
        // setCurrentPassword(''); // Eğer kullanılıyorsa
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        let errorMessage = "Güncelleme sırasında bir hata oluştu.";
        try {
            const errorData = JSON.parse(responseText); // Metni JSON'a çevirmeyi dene
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            } else if (errorData && errorData.error) {
                errorMessage = `Sunucu Hatası (${response.status}): ${errorData.error}`;
            } else if (responseText) {
                errorMessage = responseText.substring(0, 200); // Çok uzunsa kısalt
            }
        } catch (e) {
            if (responseText) {
                errorMessage = responseText.substring(0, 200); // Çok uzunsa kısalt
            }
        }
        Alert.alert('Hata', errorMessage);
      }
    } catch (error) {
      console.error("Update Info - Ağ veya Beklenmedik Hata:", error);
      Alert.alert('Hata', 'Sunucuya bağlanılamadı veya beklenmedik bir hata oluştu.');
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçebilmek için galeri erişim izni vermelisiniz.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      // base64: true, // Eğer backend'e direkt base64 gönderilecekse açılabilir
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!imageUri) {
        Alert.alert('Fotoğraf Seçilmedi', 'Lütfen önce bir fotoğraf seçin.');
        return;
    }
    setIsUpdatingPhoto(true);
    const formData = new FormData();
    formData.append('email', user?.email);
    let filename = imageUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    // @ts-ignore
    formData.append('profilePicture', { uri: imageUri, name: filename, type });

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/update-profile-picture`, {
        method: 'PUT',
        body: formData,
        // FormData için Content-Type'ı fetch otomatik ayarlar
      });

      const responseTextPhoto = await response.text(); // Önce metin olarak al
      console.log("Update Photo - Backend Ham Yanıtı (Metin):", responseTextPhoto);
      console.log("Update Photo - Backend Yanıt Durumu:", response.status);

      if (response.ok) {
        let updatedUserPhoto;
        try {
            updatedUserPhoto = JSON.parse(responseTextPhoto); // Backend güncellenmiş kullanıcıyı dönebilir
        } catch(e) {
            console.warn("Update Photo - Başarılı yanıt JSON değildi.");
            // Eğer backend JSON dönmüyorsa ama işlem başarılıysa, manuel bir şey yapabiliriz
            // veya sadece bir başarı mesajı gösterebiliriz.
        }

        Alert.alert('Başarılı', 'Profil fotoğrafınız güncellendi.');
        if (updatedUserPhoto && updatedUserPhoto.profilePicture) {
            setUser({ ...user, profilePicture: updatedUserPhoto.profilePicture });
            // setProfilePictureBase64(updatedUserPhoto.profilePicture); // Bu state zaten useEffect ile user'dan güncelleniyor
        } else {
            // Eğer backend güncel fotoğrafı dönmüyorsa, en azından yeni seçilen URI'yi
            // bir şekilde (örn. base64'e çevirip) context'e set etmeyi düşünebiliriz.
            // Şimdilik sadece mesaj veriyoruz.
            console.log("Backend güncel profil fotoğrafını yanıtta döndürmedi.");
        }
        setImageUri(null);
      } else {
        let photoErrorMessage = "Fotoğraf güncellenirken bir hata oluştu.";
        try {
            const errorPhotoData = JSON.parse(responseTextPhoto);
            if (errorPhotoData && errorPhotoData.message) {
                photoErrorMessage = errorPhotoData.message;
            } else if (errorPhotoData && errorPhotoData.error) {
                photoErrorMessage = `Sunucu Hatası (${response.status}): ${errorPhotoData.error}`;
            } else if (responseTextPhoto) {
                photoErrorMessage = responseTextPhoto.substring(0, 200);
            }
        } catch (e) {
            if (responseTextPhoto) {
                photoErrorMessage = responseTextPhoto.substring(0, 200);
            }
        }
        Alert.alert('Hata', photoErrorMessage);
      }
    } catch (error) {
      console.error("Update Photo - Ağ Hatası:", error);
      Alert.alert('Hata', 'Fotoğraf güncellenemedi. Bağlantınızı kontrol edin.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const openDrawerMenu = () => {
    navigation.openDrawer();
  };

  const renderInputRow = (label, value, onChangeText, placeholder, secureTextEntry = false, iconName, keyboardType = "default") => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputIconWrapper}>
        {iconName && <MaterialIcons name={iconName} size={22} color="#718096" style={styles.inputIcon} />}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.baseContainer}>
      <HeaderBar openDrawer={openDrawerMenu} title="Ayarlar" navigation={navigation} showAppLogo={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Profil Fotoğrafı</Text>
          <View style={styles.avatarSection}>
            <Image
              source={imageUri ? { uri: imageUri } : (profilePictureBase64 ? { uri: `data:image/jpeg;base64,${profilePictureBase64}` } : { uri: 'https://i.pravatar.cc/150' })}
              style={styles.avatar}
            />
            <View style={styles.avatarButtons}>
                <TouchableOpacity style={[styles.button, styles.pickButton]} onPress={pickImage}>
                    <Ionicons name="image-outline" size={20} color="#fff" style={{marginRight: 8}}/>
                    <Text style={styles.buttonText}>Fotoğraf Seç</Text>
                </TouchableOpacity>
                {imageUri && (
                    <TouchableOpacity
                        style={[styles.button, styles.updateButton, isUpdatingPhoto && styles.buttonDisabled]}
                        onPress={handleUpdateProfilePicture}
                        disabled={isUpdatingPhoto}
                    >
                    {isUpdatingPhoto ? <ActivityIndicator color="#fff" size="small"/> : <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{marginRight: 8}}/>}
                    {!isUpdatingPhoto && <Text style={styles.buttonText}>Fotoğrafı Güncelle</Text>}
                    </TouchableOpacity>
                )}
            </View>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Kişisel Bilgiler</Text>
          <Text style={styles.label}>E-posta:</Text>
          <View style={styles.staticInfoRow}>
            <MaterialIcons name="email" size={22} color="#718096" style={styles.inputIcon} />
            <Text style={styles.staticText}>{user?.email}</Text>
          </View>
          <Text style={styles.label}>Kullanıcı Adı:</Text>
          <View style={styles.staticInfoRow}>
            <MaterialIcons name="alternate-email" size={22} color="#718096" style={styles.inputIcon} />
            <Text style={styles.staticText}>{user?.username}</Text>
          </View>
          {renderInputRow("Ad Soyad*", fullName, setFullName, "Adınız ve Soyadınız", false, "person")}
        </View>

        <View style={styles.settingsCard}>
            <Text style={styles.cardTitle}>Şifre Güncelle</Text>
            {renderInputRow("Yeni Şifre", newPassword, setNewPassword, "Yeni şifreniz", true, "lock")}
            {renderInputRow("Yeni Şifre (Tekrar)", confirmNewPassword, setConfirmNewPassword, "Yeni şifrenizi doğrulayın", true, "lock")}
        </View>

        <TouchableOpacity
            style={[styles.button, styles.saveButton, isUpdatingInfo && styles.buttonDisabled]}
            onPress={handleUpdateInfo}
            disabled={isUpdatingInfo}
        >
          {isUpdatingInfo ? <ActivityIndicator color="#fff" size="small"/> : <Ionicons name="save-outline" size={22} color="#fff" style={{marginRight: 10}}/>}
          {!isUpdatingInfo && <Text style={styles.buttonText}>Bilgileri Kaydet</Text>}
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: Platform.OS === 'ios' ? 20 : 15,
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#667eea',
    marginBottom: 15,
  },
  avatarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#2D3748',
  },
  staticInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  staticText: {
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 10,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pickButton: {
    backgroundColor: '#4299E1',
    marginRight: 5,
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#48BB78',
    marginLeft: 5,
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#667eea',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SettingsScreen;