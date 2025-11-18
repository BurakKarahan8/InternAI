// src/components/JobApplicationScreen.js
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from './HeaderBar';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useUser } from './UserContext';
import { API_BASE_URL } from '@env'; 

const JobApplicationScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const { user } = useUser(); // Kullanıcı bilgilerini context'ten al

  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applicantName = user?.fullName || "Kullanıcı Adı Yüklenemedi";
  const applicantEmail = user?.email || "E-posta Yüklenemedi";
  const userIdForRequest = user?.id; // Backend'e gönderilecek User ID

  const handleApply = async () => {
    console.log(API_BASE_URL);
    if (!coverLetter.trim()) {
      Alert.alert("Eksik Bilgi", "Lütfen bir ön yazı veya özgeçmiş linki girin.");
      return;
    }

    console.log("handleApply - Kullanılacak User ID (Butona Basıldığında):", userIdForRequest);

    if (!userIdForRequest) {
      Alert.alert("Hata", "Kullanıcı kimliği alınamadı. Lütfen tekrar giriş yapmayı deneyin.");
      return;
    }

    if (!job || !job.id) {
        Alert.alert("Hata", "İlan bilgileri eksik veya geçersiz.");
        return;
    }

    setIsSubmitting(true);

    const applicationData = {
      userId: userIdForRequest,
      jobPostId: job.id,
      coverLetter: coverLetter,
    };

    console.log("API'ye Gönderilecek Başvuru Verileri:", JSON.stringify(applicationData));

    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Eğer backend'iniz bir yetkilendirme token'ı (JWT vb.) bekliyorsa:
          // 'Authorization': `Bearer ${user.token}`, // user.token UserContext'ten gelmeli
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        // Hata durumunu önce ele al
        const responseStatus = response.status; // Durum kodunu sakla
        let errorToThrow;

        if (responseStatus === 409) {
          // Web'deki gibi özel bir Error fırlat
          errorToThrow = new Error("Bu ilana zaten başvurdunuz.");
          errorToThrow.isConflictError = true; // Özel bir flag ekleyebiliriz
        } else {
          // Diğer hatalar için backend'den gelen mesajı almaya çalış
          let backendErrorMessage = "Bilinmeyen bir sunucu hatası oluştu.";
          try {
            const errorData = await response.json(); // JSON olarak okumayı dene
            if (errorData && errorData.message) {
              backendErrorMessage = errorData.message;
            } else if (errorData && errorData.error) {
                backendErrorMessage = `Sunucu Hatası: ${errorData.error}`;
            }
            console.log("API Hata JSON Yanıtı (response not ok):", errorData);
          } catch (e) {
            // JSON parse edilemezse, metin olarak almayı dene
            try {
              backendErrorMessage = await response.text();
              console.log("API Hata Metin Yanıtı (response not ok):", backendErrorMessage);
            } catch (e2) {
              console.log("Hata yanıtı okunamadı:", e2);
            }
          }
          errorToThrow = new Error(`Başvuru gönderilemedi (Hata ${responseStatus}): ${backendErrorMessage}`);
        }
        throw errorToThrow; // Hatayı fırlat, catch bloğu yakalasın
      }

      // Sadece response.ok ise buraya gelinir
      // const responseData = await response.json(); // Eğer backend başarılı durumda JSON dönerse
      Alert.alert(
        "Başvuru Başarılı",
        `${job.title} ilanına başvurunuz başarıyla gönderildi.`
      );
      setCoverLetter('');

    } catch (error) {
      // Fırlatılan Error'ları ve ağ hatalarını burada yakala
      console.log("handleApply catch bloğu - Hata:", error);

      let alertTitle = "Hata";
      let alertMessage = error.message; // Fırlatılan Error'un mesajını kullan

      if (error.isConflictError) { // Eğer 409 için özel flag varsa
        alertTitle = "Başvuru Çakışması";
        // alertMessage zaten "Bu ilana zaten başvurdunuz." olacak
      } else if (error.message && (error.message.toLowerCase().includes("network request failed") || error.message.toLowerCase().includes("failed to fetch"))) {
        alertTitle = "Bağlantı Hatası";
        alertMessage = "Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.";
      } else if (!alertMessage) { // error.message boşsa genel bir mesaj
        alertMessage = "Başvuru sırasında beklenmedik bir sorun oluştu.";
      }

      Alert.alert(alertTitle, alertMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <HeaderBar navigation={navigation} showBackButton={true} title="Hata" />
        <View style={styles.centeredMessage}>
          <Text style={styles.errorMessageText}>İlan bilgisi bulunamadı.</Text>
        </View>
      </LinearGradient>
    );
  }

  const technologies = job.technologiesArray || (typeof job.technologies === 'string' ? job.technologies.split(',').map(t => t.trim()) : []);

  return (
    <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.gradient}>
      <HeaderBar navigation={navigation} showBackButton={true} title="İlana Başvur" showAppLogo={true}/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{job.title}</Text>

          <View style={styles.infoRow}>
            <FontAwesome name="building-o" size={16} color="#4A5568" style={styles.icon} />
            <Text style={styles.companyName}>{job.companyName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#4A5568" style={styles.icon} />
            <Text style={styles.location}>{job.city}, {job.country}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#E53E3E" style={styles.icon} />
            <Text style={styles.deadline}>Son Başvuru: {job.deadline}</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>İlan Açıklaması</Text>
          <Text style={styles.description}>{job.description}</Text>

          {technologies.length > 0 && (
            <>
              <View style={styles.separator} />
              <Text style={styles.sectionTitle}>Gereken Teknolojiler</Text>
              <View style={styles.techContainer}>
                {technologies.map((tech, index) => (
                  <View key={index} style={styles.techBadge}>
                    <Text style={styles.techBadgeText}>{tech}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Başvuru Bilgileri</Text>
          <View style={styles.applicantInfoContainer}>
            <View style={styles.applicantInfoRow}>
              <Ionicons name="person-outline" size={18} color="#4A5568" style={styles.icon} />
              <Text style={styles.applicantInfoLabel}>Ad Soyad:</Text>
              <Text style={styles.applicantInfoValue}>{applicantName}</Text>
            </View>
            <View style={styles.applicantInfoRow}>
              <Ionicons name="mail-outline" size={18} color="#4A5568" style={styles.icon} />
              <Text style={styles.applicantInfoLabel}>E-posta:</Text>
              <Text style={styles.applicantInfoValue}>{applicantEmail}</Text>
            </View>
          </View>

          <Text style={styles.inputLabel}>Ön Yazı / Özgeçmiş Linki:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Buraya bir ön yazı veya özgeçmişinizin linkini (örn: LinkedIn, GitHub, Drive) ekleyebilirsiniz..."
            placeholderTextColor="#A0AEC0"
            value={coverLetter}
            onChangeText={setCoverLetter}
          />

          <TouchableOpacity
            style={[styles.applyButton, isSubmitting && styles.applyButtonDisabled]}
            onPress={handleApply}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.applyButtonText}>Hemen Başvur</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
    paddingHorizontal: Platform.OS === 'ios' ? 15 : 10,
    paddingTop: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  companyName: {
    fontSize: 17,
    color: '#4A5568',
    fontWeight: '600',
  },
  location: {
    fontSize: 16,
    color: '#4A5568',
  },
  deadline: {
    fontSize: 16,
    color: '#C53030',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A5568',
    textAlign: 'justify',
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  techBadge: {
    backgroundColor: '#EBF4FF',
    borderColor: '#90CDF4',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  techBadgeText: {
    color: '#2C5282',
    fontSize: 13,
    fontWeight: '500',
  },
  applicantInfoContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  applicantInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicantInfoLabel: {
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '600',
    marginRight: 5,
  },
  applicantInfoValue: {
    fontSize: 15,
    color: '#4A5568',
    flexShrink: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 100,
    color: '#2D3748',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#48BB78',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorMessageText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default JobApplicationScreen;