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
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from '@env';

const SignUpPage = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    githubUsername: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = async () => {
    // Basit validasyonlar
    if (!form.fullName || !form.email || !form.username || !form.password) {
        Alert.alert("Eksik Bilgi", "Lütfen tüm zorunlu alanları doldurun (* ile işaretli).");
        return;
    }
    if (form.password.length < 6) {
        Alert.alert("Şifre Hatası", "Şifreniz en az 6 karakter olmalıdır.");
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        Alert.alert("E-posta Hatası", "Lütfen geçerli bir e-posta adresi girin.");
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        Alert.alert("Kayıt Başarılı", "Hesabınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz.");
        navigation.navigate("Login");
      } else {
        const errorText = await response.text(); // Hata mesajını metin olarak al
        Alert.alert("Kayıt Hatası", errorText || "Kayıt sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert(
        "Bağlantı Hatası",
        "Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field, placeholder, iconName, secureTextEntry = false, keyboardType = "default", isOptional = false) => (
    <View style={styles.inputGroup}>
      <Ionicons name={iconName} size={22} color="#82E0AA" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={`${placeholder}${!isOptional ? '*' : ''}`}
        placeholderTextColor="#A0AEC0"
        value={form[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={field === 'fullName' ? 'words' : 'none'}
      />
    </View>
  );

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
              <Text style={styles.tagline}>Yeni bir kariyere ilk adım</Text>
            </View>

            <View style={styles.formBox}>
              <Text style={styles.formTitle}>Hesap Oluştur</Text>
              {renderInput("fullName", "Ad Soyad", "person-outline", false, "default", false)}
              {renderInput("email", "E-posta Adresi", "mail-outline", false, "email-address")}
              {renderInput("username", "Kullanıcı Adı", "at-outline", false, "default", false)}
              {renderInput("password", "Şifre (en az 6 karakter)", "lock-closed-outline", true , "default", false)}
              {renderInput("githubUsername", "GitHub Kullanıcı Adı", "logo-github" , false, "default", false)}


              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                 {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Kaydol</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Zaten bir hesabın var mı? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.link}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// LoginPage ile aynı stilleri kullanabiliriz veya küçük farklar ekleyebiliriz.
// Şimdilik aynı stilleri referans alalım ve LoginPage'deki styles nesnesini kullanalım.
// Eğer ayrı stil dosyası kullanıyorsanız, bu stilleri oraya taşıyabilirsiniz.
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
      fontFamily: Platform.OS === "ios" ? "Arial" : "sans-serif-condensed",
    },
    internText: {
      color: "#f0b500",
      fontStyle: "italic",
    },
    aiText: {
      color: "#E0E0E0",
    },
    tagline: {
      fontSize: Platform.OS === 'ios' ? 18 : 16,
      color: "#B0B0B0",
      marginTop: 8,
      textAlign: 'center',
    },
    formBox: {
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 20,
      paddingHorizontal: 25,
      paddingVertical: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
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
      backgroundColor: "#82E0AA",
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
      color: "#1D2B4A",
      fontSize: 17,
      fontWeight: "bold",
    },
    footerContainer: {
      marginTop: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerText: {
      fontSize: 15,
      color: "#B0B0B0",
    },
    link: {
      color: "#82E0AA",
      fontWeight: "bold",
      fontSize: 15,
      marginLeft: 5,
    },
});

export default SignUpPage;