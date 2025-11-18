import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const HeaderBar = ({ openDrawer, navigation, showBackButton = false, title = "", showAppLogo = false }) => {
  return (
    <View style={styles.headerBar}>
      <View style={styles.leftContainer}>
        {showBackButton && navigation ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={Platform.OS === 'ios' ? 28 : 26} color="white" />
          </TouchableOpacity>
        ) : showAppLogo ? ( // Eğer geri butonu yoksa VE showAppLogo true ise logoyu göster
          <View style={styles.appLogoContainer}>
            <Text style={styles.appLogoInternText}>Intern</Text>
            <Text style={styles.appLogoAiText}>AI</Text>
          </View>
        ) : (
          // Geri butonu da yok, logo da istenmiyor, menü butonu sağda olduğu için burası boş kalabilir
          // veya farklı bir ikon/boşluk konulabilir. Şimdilik boş.
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.centerContainer}>
        {title ? (
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        ) : (
          // Başlık yoksa ve showAppLogo false ise (bu durum genelde olmaz, ya başlık ya logo olur)
          // Veya showAppLogo true ise logo zaten solda olduğu için burası boş kalabilir.
          // Eğer logo solda iken ortada yine de bir şey olsun isteniyorsa buraya eklenebilir.
          // Şu anki mantıkta: Eğer title varsa göster, yoksa ve logo soldaysa merkez boş.
          null
        )}
      </View>

      <View style={styles.rightContainer}>
        {openDrawer ? ( // showBackButton false ise menü gösterilir, true ise zaten geri butonu var.
          <TouchableOpacity onPress={openDrawer} style={styles.iconButton}>
            <FontAwesome name="bars" size={Platform.OS === 'ios' ? 24 : 22} color="white" />
          </TouchableOpacity>
        ) : (
          // Menü butonu da yoksa (örn: geri butonu olan bir sayfada), sağ tarafı boş bırak
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    paddingTop: Platform.OS === 'android' ? 10 : (Platform.OS === 'ios' ? 45 : 30), // SafeArea için
    height: Platform.OS === 'android' ? 90 : 95,
    width: '100%',
    backgroundColor: '#283958', // HeaderBar'ın kendi rengi
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  leftContainer: {
    width: Platform.OS === 'ios' ? 80 : 70, // Logo veya geri butonu için alan
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  appLogoContainer: {
    flexDirection: 'row',
  },
  appLogoInternText: { // Login sayfasındaki logo stiline benzer
    fontSize: Platform.OS === 'ios' ? 22 : 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif-condensed',
    color: '#f0b500',
    fontStyle: 'italic',
  },
  appLogoAiText: { // Login sayfasındaki logo stiline benzer
    fontSize: Platform.OS === 'ios' ? 22 : 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif-condensed',
    color: '#e2e2e2',
  },
  centerContainer: {
    flex: 1, // Ortadaki alanın esnek olmasını sağlar
    justifyContent: 'center',
    alignItems: 'center', // Başlığı ortala
    marginHorizontal: 5, // Sağ ve sol konteynerlere yapışmasın
  },
  rightContainer: {
    width: 50, // Menü butonu için sağ alan
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8, // Dokunma alanını artır
  },
  headerTitle: {
    fontSize: Platform.OS === 'ios' ? 19 : 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: { // İkon vs olmadığında yer tutucu (boyutları konteyner ile aynı olmalı)
    width: Platform.OS === 'ios' ? 80 : 70, //leftContainer ile aynı
    // width: 50, // rightContainer ile aynı
  },
});

export default HeaderBar;