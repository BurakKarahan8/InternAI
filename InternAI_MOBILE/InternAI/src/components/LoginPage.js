import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // Ionicons ekledim
import { useUser } from "./UserContext";
import { API_BASE_URL } from '@env';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Yükleme durumu için state
  const { setUser } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Eksik Bilgi", "Lütfen e-posta ve şifrenizi girin.");
      return;
    }
    setLoading(true);
    try {
      console.log(API_BASE_URL); 
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Yanıtı her zaman JSON olarak almayı dene

      if (!response.ok) {
        throw new Error(data.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }

      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        profilePicture: data.profilePicture,
        username: data.username,
        githubUsername: data.githubUsername,
      });

      // Alert.alert("Başarılı", "Giriş başarılı!"); // Otomatik yönlendirme olduğu için bu alert'e gerek kalmayabilir
      navigation.replace("MainApp"); // Geri dönülememesi için replace kullan
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert(
        "Giriş Hatası",
        error.message.includes("Network request failed") || error.message.includes("Failed to fetch")
          ? "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin."
          : error.message || "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                <Text style={styles.internText}>Intern</Text>
                <Text style={styles.aiText}>AI</Text>
              </Text>
              <Text style={styles.tagline}>Staj aramanın akıllı yolu</Text>
            </View>

            <View style={styles.formBox}>
              <Text style={styles.formTitle}>Giriş Yap</Text>
              <View style={styles.inputGroup}>
                <Ionicons name="mail-outline" size={22} color="#82E0AA" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta adresiniz"
                  placeholderTextColor="#A0AEC0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="lock-closed-outline" size={22} color="#82E0AA" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifreniz"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Giriş Yap</Text>
                )}
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => Alert.alert("Şifremi Unuttum", "Bu özellik yakında eklenecektir.")} style={{marginTop: 15}}>
                 <Text style={styles.forgotPasswordText}>Şifreni mi unuttun?</Text>
              </TouchableOpacity> */}

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  Hesabın yok mu?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text style={styles.link}>Hemen Kaydol</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontSize: Platform.OS === 'ios' ? 70 : 65,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Arial" : "sans-serif-condensed", // Platforma özel font
  },
  internText: {
    color: "#f0b500",
    fontStyle: "italic",
  },
  aiText: {
    color: "#E0E0E0", // Daha açık bir AI metni
  },
  tagline: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    color: "#B0B0B0",
    marginTop: 8,
  },
  formBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)", // Hafif şeffaf beyaz
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // Android için gölge
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 25,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingHorizontal: 15,
    width: "100%",
    marginBottom: 18,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#82E0AA", // Tema rengi
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#82E0AA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#A0AEC0",
  },
  buttonText: {
    color: "#1D2B4A", // Koyu ana renk
    fontSize: 17,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: '#B0B0B0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footerContainer: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 15,
    color: "#B0B0B0", // Biraz daha açık gri
  },
  link: {
    color: "#82E0AA", // Tema rengi
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 5,
  },
});

export default LoginPage;