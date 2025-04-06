import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SignUpPage = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = () => {
    // Burada kayıt işlemi yapılabilir
    console.log("Kayıt Bilgileri:", form);
    navigation.navigate("MainApp"); // Kayıt sonrası ana ekrana yönlendirme
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
        <View style={styles.signUpBox}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              placeholderTextColor="#666"
              value={form.fullName}
              onChangeText={(text) => handleInputChange("fullName", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={form.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Telefon Numarası"
              placeholderTextColor="#666"
              value={form.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#666"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => handleInputChange("password", text)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Kaydol</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Zaten bir hesabınız var mı?{" "}
            <Text onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Giriş Yap</Text>
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
  signUpBox: {
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
  title: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
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

export default SignUpPage;