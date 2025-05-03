import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useUser } from '../components/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const SettingsScreen = () => {
  const { user } = useUser();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(user?.profilePicture || null);

  const handleSave = async () => {
    try {
      // JSON formatında veri gönderme
      const response = await fetch('http://192.168.147.159:8080/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          fullName: fullName,
          password: password,
        }),
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Bilgileriniz güncellendi.');
        setPassword(''); // Şifreyi sıfırla
      } else {
        Alert.alert('Hata', 'Güncelleme sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
    }
  };

  // Fotoğraf seçme işlemi
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("Seçilen fotoğraf URI'si:", result.assets[0].uri); // Seçilen fotoğrafın URI'sini konsola yazdır
      setImage(result.assets[0].uri); // Fotoğrafı state'e set et
    }else {
      console.log('Fotoğraf seçimi iptal edildi.');
    }
  };

  // Fotoğraf güncelleme işlemi
  const handleUpdateProfilePicture = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('email', user?.email);

      // Dosya objesi
      const photo = {
        uri: image, // Dosyanın URI'si
        name: 'profile.jpg', // Dosyanın adı
        type: 'image/jpeg', // Dosyanın tipi
      };
      formData.append('profilePicture', photo); // FormData'ya ekle


      try {
        const response = await fetch('http://192.168.147.159:8080/api/users/update-profile-picture', {
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (response.ok) {
          Alert.alert('Başarılı', 'Profil fotoğrafınız güncellendi.');
        } else {
          Alert.alert('Hata', 'Fotoğraf güncellenirken bir hata oluştu.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Hata', 'Fotoğraf güncellenemedi.');
      }
    }
  };

  return (
    <LinearGradient colors={['#283958', '#4b6cb7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Bilgilerini Güncelle</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.staticText}>{user?.email}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <Text style={styles.staticText}>{user?.username}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Ad Soyad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Yeni Şifre</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.buttonKaydet} onPress={handleSave}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>

        {/* Profil Fotoğrafı */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Profil Fotoğrafı</Text>
          {image ? (
            <Image source={{ uri : image }} style={styles.profileImage} />
          ) : (
            <Text style={styles.noImageText}>Fotoğraf Yüklenmedi</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Fotoğraf Seç</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfilePicture}>
            <Text style={styles.buttonText}>Fotoğrafı Güncelle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 5,
  },
  staticText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#3d5a80',
    padding: 10,
    borderRadius: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#000',
  },
  buttonKaydet: {
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: '#0D3E3D',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: '#0D3E3D',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  noImageText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});

export default SettingsScreen;
