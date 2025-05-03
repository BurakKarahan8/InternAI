import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useUser } from "./UserContext"; // UserContext'i import et

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Kullanıcıdan alınan email
  const [password, setPassword] = useState(""); // Kullanıcıdan alınan şifre
  const { setUser } = useUser(); // Kullanıcıyı ayarlamak için setUser fonksiyonu

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch("http://192.168.147.159:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Giriş başarısız. Lütfen tekrar deneyin.");
      }

      const data = await response.json(); // Yanıtı JSON olarak al

      // Kullanıcı verilerini context'e kaydet
      setUser({
        fullName: data.fullName,
        email: data.email,
        profilePicture: data.profilePicture,
        username: data.username,
      });

      // Başarılı giriş
      Alert.alert("Başarılı", "Giriş başarılı!");
      navigation.navigate("MainApp");
    } catch (error) {
      console.error(error);

      if (error.message === "Failed to fetch") {
        // Sunucuya ulaşılamıyorsa
        Alert.alert("Hata", "Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edin.");
      } else {
        // Diğer hatalar
        Alert.alert("Hata", error.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.internText}>Intern</Text>
            <Text style={styles.aiText}>AI</Text>
          </Text>
          <Text style={styles.tagline}>Staj aramanın akıllı yolu</Text>
        </View>
        <View style={styles.loginBox}>
          <View style={styles.inputGroup}>
            <FontAwesome name="user" size={18} color="#667eea" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Emailinizi girin"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail} // Email state'ini güncelle
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome name="lock" size={18} color="#667eea" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi girin"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword} // Password state'ini güncelle
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Hesabınız yok mu?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
              Kaydol
            </Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20, // LoginBox ile boşluk
  },
  logoText: {
    fontSize: 65, // SVG'deki font-size
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
  tagline: {
    fontSize: 20, // SVG'deki tagline font-size
    fontWeight: "normal",
    fontFamily: "Arial",
    color: "#ffffff",
    marginTop: 5,
  },
  loginBox: {
    paddingTop: 60,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: 100,
    paddingVertical: 12,
    backgroundColor: "#5f4857",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
  },
  link: {
    color: "#667eea",
    fontWeight: "bold",
  },
});

export default LoginPage;
