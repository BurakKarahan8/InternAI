package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.dto.CvAnalysisResultDTO;
import com.burakkarahan.InternAI.dto.CvExtractionDTO;
import com.burakkarahan.InternAI.model.Language;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CvAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(CvAnalysisService.class);

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiBaseUrl;

    private final GithubService githubService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CvAnalysisService(GithubService githubService) {
        this.githubService = githubService;
    }

    public CvAnalysisResultDTO analyzeCvAndIntegrateGithub(String cvContent, String githubUsername) {

        CvExtractionDTO extractedData = callGeminiApiForExtraction(cvContent);

        List<Language> githubLangsList = githubService.getUserLanguages(githubUsername);

        // HATA GİDERİLDİ: CvAnalysisResultDTO, DTO'dan doğru 3 metodu çağırır.
        // Not: Şu anda CvAnalysisResultDTO'nun constructor'ında allSkills yerine extractedSkills bekleniyor.
        // Hata vermemesi için, allSkills'i kullanacağız (Gemini'den gelen ham liste).
        CvAnalysisResultDTO resultDTO = new CvAnalysisResultDTO(
                extractedData.getAllSkills(), // Bu, CvAnalysisResultDTO'daki extractedSkills'e atanacak.
                extractedData.getExtractedProjects(),
                githubLangsList,
                null,
                null
        );

        // Karşılaştırma için clean listeyi kullanır.
        calculateCompatibility(resultDTO, extractedData.getComparisonLanguages());

        return resultDTO;
    }

    private CvExtractionDTO callGeminiApiForExtraction(String cvContent) {
        String url = geminiApiBaseUrl + geminiApiKey;

        String jsonFormat = "{\"allSkills\": [\"Java\", \"Spring Boot\", \"Docker\"], \"comparisonLanguages\": [\"JAVA\", \"JAVASCRIPT\"], \"extractedProjects\": [\"Proje Adı\"]}";
        String prompt = "Aşağıdaki CV içeriğini analiz et. \n" +
                "1. allSkills: CV'de geçen **TÜM** teknik becerileri (Diller, framework'ler, veritabanları, araçlar) olduğu gibi listele.\n" +
                "2. comparisonLanguages: Bu listeden sadece **ana programlama dillerini** çıkar ve **framework'leri ait oldukları ana dillere** eşleştir (Örn: Spring Boot -> JAVA, React Native -> JAVASCRIPT). Veritabanlarını ve altyapı araçlarını buraya DAHİL ETME.\n" +
                "3. extractedProjects: CV'de geçen projeleri listele. \n" +
                "4. Bana SADECE JSON formatında ve BİR TEK JSON OBJESİ olarak döndür. JSON yapısı: " +
                jsonFormat +
                " CV İçeriği: " + cvContent;

        String requestBody = String.format("""
            {
                "contents": [
                    {
                        "parts": [
                            {"text": "%s"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "responseMimeType": "application/json"
                }
            }
            """, prompt.replace("\"", "\\\"").replace("\n", " "));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {

                Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);

                List<Map> candidates = (List<Map>) responseMap.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map content = (Map) candidates.get(0).get("content");
                    if (content != null) {
                        List<Map> parts = (List<Map>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            String jsonText = (String) parts.get(0).get("text");
                            return objectMapper.readValue(jsonText, CvExtractionDTO.class);
                        }
                    }
                }

                throw new RuntimeException("Gemini yanıtından yapısal veri çıkarılamadı.");

            } else {
                throw new RuntimeException("Gemini API'den HTTP hatası alındı: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            logger.error("Gemini API İstemci Hatası ({})", e.getStatusCode(), e);
            throw new RuntimeException("Gemini API çağrısı başarısız oldu: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Gemini API çağrısı sırasında beklenmedik hata oluştu: {}", e.getMessage(), e);
            // HATA GİDERİLDİ: 3 argümanlı constructor'ı çağırır.
            return new CvExtractionDTO(Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
        }
    }

    private void calculateCompatibility(CvAnalysisResultDTO data, List<String> comparisonLanguages) {

        Set<String> requiredLanguages = comparisonLanguages.stream()
                .map(s -> s.toUpperCase(Locale.ROOT))
                .collect(Collectors.toSet());

        List<Language> githubLangs = data.getGithubLanguages();

        logger.info("CV'den (Temizlenmiş/Eşleştirilmiş) İstenen Diller: {}", requiredLanguages);

        if (requiredLanguages.isEmpty() || githubLangs == null || githubLangs.isEmpty()) {
            data.setCompatibilityScore(0.0);
            data.setCompatibilityMessage("CV'den karşılaştırılabilecek dil becerisi çıkarılamadı veya GitHub verisi eksik.");
            return;
        }

        Set<String> githubLangsSet = githubLangs.stream()
                .map(lang -> lang.getName().toUpperCase(Locale.ROOT))
                .collect(Collectors.toSet());

        logger.info("GitHub'da Mevcut Olan Diller (Eşleşme Seti): {}", githubLangsSet);

        long matchedSkillsCount = 0;

        for (String requiredLang : requiredLanguages) {
            if (githubLangsSet.contains(requiredLang)) {
                matchedSkillsCount++;
            }
        }

        double compatibilityScore = (double) matchedSkillsCount / requiredLanguages.size() * 100.0;

        data.setCompatibilityScore(Math.round(compatibilityScore * 10.0) / 10.0);

        if (compatibilityScore > 80) {
            data.setCompatibilityMessage("Mükemmel uyum! CV'deki ana dillerinizin tamamı GitHub projelerinizde mevcut.");
        } else if (compatibilityScore > 50) {
            data.setCompatibilityMessage("İyi uyum. CV'deki ana dillerinizin çoğunluğu GitHub'da görünüyor.");
        } else {
            data.setCompatibilityMessage("Düşük uyum. CV'deki bazı ana diller GitHub'da bulunmuyor.");
        }
    }
}