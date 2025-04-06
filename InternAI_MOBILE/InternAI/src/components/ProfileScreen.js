import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet , ActivityIndicator } from 'react-native';

const ProfileScreen = () => {

  const [message, setMessage] = useState("YÜKLENİYOR...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.196.159:8080/internai/api/test")
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#667eea" />
      ) : (
        <Text style={styles.text}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Farklı bir arka plan
  },
  text: {
    fontSize: 20,
  },
});

export default ProfileScreen;