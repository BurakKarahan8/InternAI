// src/components/AiAssistantScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Platform,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from './HeaderBar'; // Yolu kontrol edin
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

// GEMINI API ANAHTARINIZI BURAYA GİRİN (Güvenli bir yerde saklayın!)
// BU ANAHTARI DOĞRUDAN KODA GÖMMEK ÜRETİM İÇİN GÜVENLİ DEĞİLDİR!
// .env dosyası veya backend üzerinden yönetmek daha iyidir.
const GEMINI_API_KEY = 'AIzaSyB9GleI5hWLMs-udeTScjnkTEGJmu4OcWI'; // <<--- BURAYI GÜNCELLE!

const AiAssistantScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const openDrawerMenu = () => {
    navigation.openDrawer();
  };

  const handleSendQuery = async () => {
    if (!query.trim()) {
      setError('Lütfen bir soru veya konu girin.');
      return;
    }
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'SENİN API_KEYİN BURAYA') {
        setError('Gemini API anahtarı ayarlanmamış.');
        return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setResponse('');
    setError('');

    // Gemini API'sine istek
    // Model adını (örn: 'gemini-pro') ve API endpoint'ini Gemini dokümantasyonundan kontrol edin.
    // Bu örnekte text-only input için bir model kullanıyoruz.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bir staj arayan biriyim. Bana şu konuda yardımcı ol: "${query}". Staj bulma, mülakat hazırlığı veya kariyer geliştirme odaklı, kısa ve öz tavsiyeler ver.`
            }]
          }],
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error('Gemini API Error Data:', errorData);
        throw new Error(errorData.error?.message || `API Hatası: ${apiResponse.status}`);
      }

      const responseData = await apiResponse.json();
      
      if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content && responseData.candidates[0].content.parts && responseData.candidates[0].content.parts.length > 0) {
        setResponse(responseData.candidates[0].content.parts[0].text);
      } else if (responseData.promptFeedback && responseData.promptFeedback.blockReason) {
        // İçerik politikası nedeniyle engellendi
        setError(`İsteğiniz içerik politikası nedeniyle engellendi: ${responseData.promptFeedback.blockReason}`);
        console.warn('Gemini Content Blocked:', responseData.promptFeedback);
      }
      else {
        setResponse('Yapay zekadan bir yanıt alınamadı veya yanıt formatı beklenmedik.');
        console.warn('Gemini Unexpected Response Format:', responseData);
      }

    } catch (err) {
      console.error('Gemini API İsteği Hatası:', err);
      setError(err.message || 'Yapay zeka ile iletişimde bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.gradient}>
      <HeaderBar openDrawer={openDrawerMenu} title="AI Asistan" navigation={navigation} showAppLogo={true} />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // Klavyenin dışına tıklanınca klavyeyi kapatır
      >
        <View style={styles.logoContainer}>
            {/* Basit bir AI logosu */}
            <MaterialCommunityIcons name="robot-happy-outline" size={80} color="#82E0AA" />
            <Text style={styles.title}>Staj Asistanınız</Text>
            <Text style={styles.subtitle}>Nasıl yardımcı olabilirim?</Text>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Örn: Java mülakat soruları nelerdir?"
            placeholderTextColor="#A0AEC0"
            value={query}
            onChangeText={setQuery}
            multiline
          />
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSendQuery}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send-outline" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.responseCardError}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {response && !isLoading ? (
          <View style={styles.responseCard}>
            <Markdown style={markdownStyles}>{response}</Markdown>
          </View>
        ) : null}

         {isLoading && !response && !error && ( // Sadece istek sırasında ve henüz yanıt yoksa göster
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#82E0AA" />
                <Text style={styles.loadingText}>Yapay zeka düşünüyor...</Text>
            </View>
        )}

      </ScrollView>
    </LinearGradient>
  );
};

const markdownStyles = {
  body: { // Bu, sizin styles.responseText'inize karşılık gelebilir
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 22,
  },
  strong: { // **kalın metin** için
    fontWeight: 'bold',
    // İsterseniz rengini de değiştirebilirsiniz:
    // color: '#FFFFFF', // Örneğin daha parlak bir renk
  },
  em: { // *italik metin* için
    fontStyle: 'italic',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 5,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F0F0',
    marginTop: 8,
    marginBottom: 4,
  },
  bullet_list_icon: {
    color: '#82E0AA',
    marginRight: 8,
    lineHeight: 22, // body ile aynı lineHeight hizalamaya yardımcı olabilir
  },
  ordered_list_icon: {
    color: '#82E0AA',
    marginRight: 8,
    lineHeight: 22,
  },
  list_item: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  link: {
    color: '#82E0AA',
    textDecorationLine: 'underline',
  },
  // Diğer Markdown elemanları için de stiller ekleyebilirsiniz
  // (code_block, code_inline, blockquote vb.)
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // İçerik az olsa bile tüm alanı kaplamasını sağlar (ScrollView için)
    padding: Platform.OS === 'ios' ? 20 : 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 5,
    textAlign: 'center',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'flex-start', // multiline input için
    marginBottom: 20,
  },
  input: {
    flex: 1,
    minHeight: 50, // Minimum yükseklik
    maxHeight: 120, // Maksimum yükseklik (kaydırma çubuğu çıkar)
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10, // Dikey padding
    fontSize: 16,
    color: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlignVertical: 'top', // Android için multiline'da önemli
  },
  button: {
    backgroundColor: '#82E0AA', // Yeşilimsi bir renk
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50, // Input ile aynı yükseklik
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  responseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#82E0AA',
  },
  responseText: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 22,
  },
  responseCardError: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 15,
    color: '#FFCDD2',
    lineHeight: 22,
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#B0B0B0',
  }
});

export default AiAssistantScreen;