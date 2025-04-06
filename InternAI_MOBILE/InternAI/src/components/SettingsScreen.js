import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ayarlar Ekranı</Text>
      {/* Ayarlar içeriği buraya gelecek */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8', // Farklı bir arka plan
  },
  text: {
    fontSize: 20,
  },
});

export default SettingsScreen;