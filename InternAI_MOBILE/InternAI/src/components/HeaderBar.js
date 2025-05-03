import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const HeaderBar = ({ openDrawer }) => {
  return (
    <View style={styles.headerBar}>
      <View style={styles.logoText}>
        <Text style={styles.internText}>Intern</Text>
        <Text style={styles.aiText}>AI</Text>
      </View>
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <FontAwesome name="bars" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    marginTop: Platform.OS === 'android' ? 0 : 20,
    height: 70,
    width: '100%',
    backgroundColor: '#283958',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  logoText: {
    flexDirection: 'row', // BURASI EKLENDİ
    alignItems: 'center',  // Yazıların dikey hizası
  },
  internText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: '#f0b500',
    fontStyle: 'italic',
  },
  aiText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: '#e2e2e2',
  },
  menuButton: {
    padding: 10,
  },
});

export default HeaderBar;

