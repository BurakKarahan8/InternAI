import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native'; // useNavigation hook'unu import et

const CustomDrawerContent = (props) => {
  const navigation = useNavigation(); // Navigation hook'unu kullan

  const handleLogout = () => {
    // TODO: Gerçek çıkış işlemleri (state temizleme, token silme vb.) buraya eklenecek.
    navigation.replace('Login'); // Kullanıcıyı Login ekranına yönlendir ve geri dönememesini sağla
    props.navigation.closeDrawer(); // Menüyü kapat
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp'); // Kaydol ekranına git
    props.navigation.closeDrawer(); // Menüyü kapat
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerContent}>
        <Text style={styles.drawerHeader}>Menü</Text>
        {/* Diğer menü öğeleri buraya eklenebilir */}
        <TouchableOpacity onPress={handleSignUp} style={styles.drawerItemContainer}>
          <Text style={styles.drawerItem}>Kaydol</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.drawerItemContainer}>
          <Text style={styles.drawerItem}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4', // Drawer arka plan rengi
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, // Başlık ile öğeler arası boşluk
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  drawerItemContainer: {
    marginBottom: 15,
    paddingVertical: 10, // Dokunma alanını artırmak için
  },
  drawerItem: {
    fontSize: 18,
    color: '#333',
  },
});

export default CustomDrawerContent;