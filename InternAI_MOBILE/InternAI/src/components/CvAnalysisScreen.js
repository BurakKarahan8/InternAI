import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import HeaderBar from "./HeaderBar";
import { API_BASE_URL } from '@env';

const CvAnalysisScreen = ({ navigation }) => {
    const [cvFile, setCvFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const openDrawerMenu = () => {
        navigation.openDrawer();
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });

            if (result.canceled === false && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setCvFile(asset);
                Alert.alert("Başarılı", `CV yüklendi: ${asset.name}`);
                setAnalysisResult(null);
            }
        } catch (error) {
            console.error("CV yükleme hatası:", error);
            Alert.alert("Hata", "CV yüklenirken bir sorun oluştu.");
        }
    };

    const analyzeCv = async () => {
        if (!cvFile) {
            Alert.alert("Hata", "Lütfen önce bir CV yükleyin.");
            return;
        }

        setLoading(true);
        setAnalysisResult(null); 
        
        try {
            const formData = new FormData();
            formData.append("file", { 
                uri: cvFile.uri,
                name: cvFile.name,
                type: cvFile.mimeType || "application/pdf",
            });
            
            const response = await fetch(`${API_BASE_URL}/api/cv/analyze`, {
                method: "POST",
                body: formData,
            });

            const responseText = await response.text();
            
            if (!response.ok) {
                let errorMessage = `Analiz başarısız: ${response.status}`;
                try {
                    const errorData = JSON.parse(responseText);
                    if (errorData) {
                        errorMessage = errorData.message || responseText;
                    }
                } catch (e) {
                     
                }
                throw new Error(errorMessage);
            }

            const data = JSON.parse(responseText);
            setAnalysisResult(data);
        } catch (error) {
            console.error("CV analizi hatası:", error.message);
            Alert.alert("Hata", `CV analizi sırasında bir sorun oluştu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const renderAnalysisResult = () => {
        if (!analysisResult) return null;
        
        const { 
            extractedSkills = [],
            extractedProjects = [],
            githubLanguages = [],
            compatibilityScore, 
            compatibilityMessage 
        } = analysisResult;

        return (
            <View style={styles.settingsCard}>
                <Text style={styles.cardTitle}><MaterialIcons name="insights" size={20} color="#1A202C" /> Analiz Sonucu</Text>
                
                {compatibilityScore !== undefined && (
                    <View style={styles.resultItem}>
                        <Text style={styles.label}>CV ve GitHub Uyum Skoru:</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreText}>
                                %{compatibilityScore.toFixed(1)}
                            </Text>
                             <Ionicons name="git-branch" size={28} color="#48BB78" style={{marginLeft: 10}}/>
                        </View>
                        
                        <Text style={styles.messageText}>
                             {compatibilityMessage}
                        </Text>
                    </View>
                )}

                <View style={styles.resultItem}>
                    <Text style={styles.label}>CV'de Tespit Edilen Beceriler:</Text>
                    <View style={styles.skillTagContainer}>
                        {extractedSkills.map((skill, index) => (
                            <Text key={index} style={styles.skillTag}>
                                {skill}
                            </Text>
                        ))}
                        {extractedSkills.length === 0 && <Text style={styles.staticText}>Tespit edilen beceri yok.</Text>}
                    </View>
                </View>
                
                <View style={styles.resultItem}>
                    <Text style={styles.label}>Projeler ve Deneyimler:</Text>
                    <View style={styles.skillTagContainer}>
                        {extractedProjects.map((project, index) => (
                            <Text key={index} style={styles.projectTag}>
                                <MaterialIcons name="workspaces-outline" size={14} color="#553C9A" /> {project}
                            </Text>
                        ))}
                        {extractedProjects.length === 0 && <Text style={styles.staticText}>Tespit edilen proje yok.</Text>}
                    </View>
                </View>

                <View style={styles.resultItem_last}>
                    <Text style={styles.label}>GitHub Dil Dağılımı:</Text>
                    {githubLanguages.sort((a, b) => b.percentage - a.percentage).map((lang, index) => (
                        <View key={index} style={styles.languageBarContainer}>
                            <Text style={styles.languageName} numberOfLines={1}>{lang.name}</Text>
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarFill, { width: `${lang.percentage}%` }]} />
                            </View>
                            <Text style={styles.languagePercentage}>%{lang.percentage.toFixed(1)}</Text>
                        </View>
                    ))}
                    {githubLanguages.length === 0 && <Text style={styles.staticText}>GitHub verisi bulunamadı.</Text>}
                </View>

            </View>
        );
    };

    return (
        <LinearGradient colors={['#1D2B4A', '#3A506B']} style={styles.baseContainer}>
            <HeaderBar openDrawer={openDrawerMenu} title="CV Analizi" navigation={navigation} showAppLogo={true} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <View style={styles.settingsCard}>
                    <Text style={styles.cardTitle}><Ionicons name="cloud-upload-outline" size={20} color="#1A202C" /> CV Yükleme</Text>
                    
                    {cvFile && (
                        <View style={styles.staticInfoRow}>
                            <MaterialIcons name="attach-file" size={22} color="#48BB78" style={styles.inputIcon} />
                            
                            <ScrollView 
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={styles.fileNameScroll}
                                contentContainerStyle={styles.fileNameScrollContent}
                            >
                                <Text style={styles.staticText_NoFlex} numberOfLines={1}> 
                                    <Text style={{ fontWeight: 'bold' }}>Yüklü Dosya:</Text>
                                    {' '} 
                                    {cvFile.name}
                                </Text>
                            </ScrollView>

                            <TouchableOpacity onPress={() => setCvFile(null)} style={{padding: 5}}>
                                <Ionicons name="close-circle" size={22} color="#E53E3E" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity 
                        style={[styles.button, styles.pickButton]} 
                        onPress={pickDocument}
                    >
                        <MaterialIcons name="file-upload" size={20} color="#fff" style={{marginRight: 8}}/>
                        <Text style={styles.buttonText}>
                            {cvFile ? "CV'yi Değiştir" : "CV Yükle (PDF)"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingsCard}>
                    <Text style={styles.cardTitle}><MaterialIcons name="analytics" size={20} color="#1A202C" /> Analiz Başlat</Text>
                    
                    <TouchableOpacity
                        style={[styles.button, styles.updateButton, (!cvFile || loading) && styles.buttonDisabled]}
                        onPress={analyzeCv}
                        disabled={!cvFile || loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="search-outline" size={22} color="#fff" style={{marginRight: 10}}/>
                                <Text style={styles.buttonText}>CV ve GitHub Uyumluluğunu Analiz Et</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {renderAnalysisResult()}

            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    baseContainer: {
        flex: 1,
    },
    scrollContainer: {
        padding: Platform.OS === 'ios' ? 20 : 15,
    },
    settingsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        paddingLeft: 12,
        paddingRight: 8,
    },
    staticInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 10,
        backgroundColor: '#F7FAFC',
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    staticText: {
        fontSize: 16,
        color: '#2D3748',
        marginLeft: 10,
        flex: 1,
    },
    staticText_NoFlex: {
        fontSize: 16,
        color: '#2D3748',
        marginLeft: 10,
    },
    fileNameScroll: {
        flex: 1,
        maxHeight: 40,
    },
    fileNameScrollContent: {
        alignItems: 'center',
    },
    resultItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F7FAFC',
    },
    resultItem_last: {
        marginBottom: 5,
        paddingBottom: 0,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#667eea',
    },
    messageText: {
        fontSize: 15,
        color: '#4A5568',
        lineHeight: 22,
    },
    label: {
        fontSize: 15,
        color: '#4A5568',
        marginBottom: 8,
        fontWeight: '500',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    pickButton: {
        backgroundColor: '#4299E1',
    },
    updateButton: {
        backgroundColor: '#48BB78',
    },
    buttonDisabled: {
        backgroundColor: '#A0AEC0',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    skillTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    skillTag: {
        // Pembe/Mor yerine daha kurumsal Mavi/Indigo tonları
        backgroundColor: '#EBF8FF', // Hafif Mavi arka plan
        color: '#2C5282', // Koyu Mavi metin
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8, // Satır arası boşluk için
        fontSize: 14,
        // Kutunun metin kadar yer kaplaması için ayarlar
        alignSelf: 'flex-start',
        overflow: 'hidden', 
    },
    projectTag: {
        backgroundColor: '#F7FAFC', 
        color: '#2D3748',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignSelf: 'flex-start',
        overflow: 'hidden',
    },
    languageBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    languageName: {
        fontSize: 14,
        color: '#4A5568',
        width: 70,
        marginRight: 10,
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4299E1',
        borderRadius: 4,
    },
    languagePercentage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2D3748',
        width: 50,
        textAlign: 'right',
        marginLeft: 5,
    },
});

export default CvAnalysisScreen;