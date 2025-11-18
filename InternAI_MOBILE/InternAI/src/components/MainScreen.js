// src/components/MainScreen.js
import React, { useEffect, useState, useCallback } from 'react'; // useCallback eklendi
import {
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    View,
    ScrollView,
    Platform,
    Alert,
    RefreshControl, // <<--- RefreshControl eklendi
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBar from '../components/HeaderBar';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

const MainScreen = ({ navigation }) => {
    const [internships, setInternships] = useState([]);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [allTechnologies, setAllTechnologies] = useState([]);
    const [selectedTechnologies, setSelectedTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // <<--- Yenileme state'i eklendi

    const openDrawerMenu = () => {
        navigation.openDrawer();
    };

    // Veri çekme fonksiyonunu useCallback ile sarmala
    const fetchInternships = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setLoading(true); // Sadece ilk yüklemede tam ekran loading

        try {
            console.log(API_BASE_URL);
            const response = await fetch(`${API_BASE_URL}/api/jobposts/jobposts`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const transformed = data.map((item) => ({
                ...item,
                id: item.id.toString(), // ID'nin string olduğundan emin ol
                technologiesArray: typeof item.technologies === 'string'
                    ? item.technologies.split(',').map((t) => t.trim()).filter(t => t)
                    : Array.isArray(item.technologies) ? item.technologies.filter(t => t) : [],
            }));

            setInternships(transformed);
            // Filtreler sıfırlanmışsa veya ilk yüklemedeyse tüm veriyi göster
            if (selectedTechnologies.length === 0 || isRefresh || !isRefresh && loading) { // loading kontrolü ilk yükleme için
                 setFilteredInternships(transformed);
            } else {
                // Mevcut filtreleri koruyarak veriyi güncelle (bu kısım daha karmaşık olabilir,
                // şimdilik yenilemede filtreleri sıfırlıyoruz gibi düşünebiliriz veya
                // filtreli veriyi yeniden filtreleriz)
                // En basit yaklaşım, yenileme sırasında filtreleri de sıfırlamak veya
                // mevcut filtrelerle yeni veriyi tekrar filtrelemek.
                // Mevcut filtreleri korumak için:
                setFilteredInternships(
                    transformed.filter((item) =>
                        selectedTechnologies.every((t) => item.technologiesArray.includes(t))
                    )
                );
            }


            const techSet = new Set();
            transformed.forEach((item) =>
                item.technologiesArray.forEach((tech) => {
                    if (tech) techSet.add(tech);
                })
            );
            setAllTechnologies(Array.from(techSet).sort());

        } catch (err) {
            console.error('Veri çekme hatası:', err);
            Alert.alert("Hata", "Staj ilanları yüklenirken bir sorun oluştu.");
        } finally {
            if (!isRefresh) setLoading(false);
            if (isRefresh) setRefreshing(false);
        }
    }, [selectedTechnologies, loading]); // selectedTechnologies ve loading bağımlılıklara eklendi

    useEffect(() => {
        // Ekran her odaklandığında ve ilk açılışta verileri çek
        const unsubscribe = navigation.addListener('focus', () => {
            if (internships.length === 0) { // Sadece ilk açılışta veya veri yoksa otomatik çek
                fetchInternships();
            }
        });

        if (internships.length === 0) { // Bileşen mount olduğunda ilk veri çekimi
             fetchInternships();
        }

        return unsubscribe;
    }, [navigation, fetchInternships, internships.length]); // fetchInternships ve internships.length bağımlılığa eklendi

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchInternships(true); // Yenileme olduğunu belirt
    }, [fetchInternships]); // fetchInternships bağımlılık olarak eklendi

    const handleFilter = (tech) => {
        let updated;
        if (selectedTechnologies.includes(tech)) {
            updated = selectedTechnologies.filter((t) => t !== tech);
        } else {
            updated = [...selectedTechnologies, tech];
        }
        setSelectedTechnologies(updated);

        if (updated.length === 0) {
            setFilteredInternships(internships);
        } else {
            setFilteredInternships(
                internships.filter((item) =>
                    updated.every((t) => item.technologiesArray.includes(t))
                )
            );
        }
    };

    const handleInternshipPress = (internshipItem) => {
        navigation.navigate('JobApplicationScreen', { job: internshipItem });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleInternshipPress(item)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.companyText}>{item.companyName}</Text>
            <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">{item.description}</Text>

            {item.technologiesArray && item.technologiesArray.length > 0 && (
                <>
                    <Text style={styles.label}>Teknolojiler:</Text>
                    <View style={styles.techContainer}>
                        {item.technologiesArray.slice(0, 5).map((tech, index) => (
                            <View key={index} style={styles.techBadge}>
                                <Text style={styles.techBadgeText}>{tech}</Text>
                            </View>
                        ))}
                        {item.technologiesArray.length > 5 && <Text style={styles.moreTechText}>...</Text>}
                    </View>
                </>
            )}
            <View style={styles.footer}>
                <Text style={styles.locationText}><Ionicons name="location-outline" size={14} color="#7F8C8D" /> {item.city}, {item.country}</Text>
                <Text style={styles.deadlineText}><Ionicons name="calendar-outline" size={14} color="#E74C3C" /> {item.deadline}</Text>
            </View>
        </TouchableOpacity>
    );

    // Sadece ilk yükleme için tam ekran loading göster, refresh için değil.
    if (loading && !refreshing) {
        return (
            <LinearGradient colors={['#283958', '#4b6cb7']} style={styles.gradient}>
                <HeaderBar openDrawer={openDrawerMenu} title="Staj İlanları" navigation={navigation} showAppLogo={true}/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>İlanlar Yükleniyor...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#283958', '#4b6cb7']} style={styles.gradient}>
            <HeaderBar openDrawer={openDrawerMenu} title="Staj İlanları" navigation={navigation} showAppLogo={true} />

            <View style={styles.filterSection}>
              <ScrollView horizontal contentContainerStyle={styles.filterScrollContent} showsHorizontalScrollIndicator={false}>
                  {allTechnologies.map((tech, index) => (
                      <TouchableOpacity
                          key={index}
                          onPress={() => handleFilter(tech)}
                          style={[
                              styles.filterButton,
                              selectedTechnologies.includes(tech) && styles.selectedFilterButton,
                          ]}
                      >
                          <Text
                              style={[
                                  styles.filterButtonText,
                                  selectedTechnologies.includes(tech) && styles.selectedFilterButtonText,
                              ]}
                          >
                              {tech}
                          </Text>
                      </TouchableOpacity>
                  ))}
              </ScrollView>

              {selectedTechnologies.length > 0 && (
                  <TouchableOpacity
                      onPress={() => {
                          setSelectedTechnologies([]);
                          setFilteredInternships(internships);
                      }}
                      style={styles.clearButton}
                  >
                      <Text style={styles.clearButtonText}>Filtreyi Temizle</Text>
                  </TouchableOpacity>
              )}
            </View>

            {/* loading && !refreshing kontrolü yukarı alındı, burada sadece içeriği gösteriyoruz */}
            {filteredInternships.length > 0 ? (
                <FlatList
                    data={filteredInternships}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={ // <<--- RefreshControl prop'u eklendi
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#fff']} // Android için spinner rengi
                            tintColor={'#fff'} // iOS için spinner rengi
                            progressBackgroundColor={'#555'} // Android için spinner arkaplanı
                        />
                    }
                />
            ) : (
                <ScrollView // <<--- Boş durum için de RefreshControl ekleyebilmek için ScrollView içine aldık
                    contentContainerStyle={styles.emptyContainerWrapper}
                    refreshControl={
                         <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#fff']}
                            tintColor={'#fff'}
                            progressBackgroundColor={'#555'}
                        />
                    }
                >
                    <View style={styles.emptyContainer}>
                        <Ionicons name="sad-outline" size={60} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.emptyText}>Aradığınız kriterlere uygun ilan bulunamadı.</Text>
                        {selectedTechnologies.length > 0 && (
                             <TouchableOpacity
                                onPress={() => {
                                    setSelectedTechnologies([]);
                                    setFilteredInternships(internships);
                                }}
                                style={[styles.clearButton, { alignSelf: 'center', marginTop: 15}]}
                            >
                                <Text style={styles.clearButtonText}>Filtreyi Temizle</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    // ... (mevcut stilleriniz aynı kalacak)
    gradient: { flex: 1 },
    filterSection: {
      paddingHorizontal: 10,
      paddingTop: 10,
      marginBottom: 5,
    },
    filterScrollContent: {
        paddingVertical: 5,
    },
    listContent: { paddingHorizontal: 15, paddingBottom: 20 },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 5 },
    companyText: { fontSize: 14, color: '#34495E', marginBottom: 8, fontStyle: 'italic'},
    description: { fontSize: 14, color: '#7F8C8D', marginBottom: 10, lineHeight: 20 },
    label: { fontWeight: '600', marginBottom: 5, fontSize: 13, color: '#34495E' },
    techContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    techBadge: {
        backgroundColor: '#EAECEE',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 6,
    },
    techBadgeText: {
        color: '#566573',
        fontSize: 11,
    },
    moreTechText: {
        color: '#566573',
        fontSize: 11,
        alignSelf: 'center',
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#EAEAEA',
        paddingTop: 8,
    },
    locationText: { fontSize: 12, color: '#7F8C8D', alignItems: 'center' },
    deadlineText: { fontSize: 12, color: '#E74C3C', fontWeight: '500', alignItems: 'center' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: 'rgba(255,255,255,0.8)'},
    emptyContainerWrapper: { // <<--- ScrollView için eklendi
        flex: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
      // flex: 1, // Bu artık emptyContainerWrapper'da
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 17,
      color: 'rgba(255,255,255,0.8)',
      textAlign: 'center',
      marginTop: 10,
    },
    filterButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 8,
        height: 38,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    selectedFilterButton: {
        backgroundColor: '#283958',
        borderColor: '#283958',
    },
    filterButtonText: {
        color: '#283958',
        fontWeight: '500',
        fontSize: 13,
    },
    selectedFilterButtonText: {
        color: '#fff',
    },
    clearButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#E74C3C',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 18,
        marginTop: 5,
        marginBottom: 10,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default MainScreen;