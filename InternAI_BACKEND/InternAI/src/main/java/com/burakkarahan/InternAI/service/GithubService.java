package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.model.Language;
import org.json.JSONException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.json.JSONObject;
import org.json.JSONArray;

import java.util.ArrayList;
import java.util.List;

@Service
public class GithubService {

    private static final String GITHUB_API_URL = "https://api.github.com/repos/";

    private final WebClient webClient;

    public GithubService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(GITHUB_API_URL).build();
    }

    // 📌 1️⃣ Repo'daki dillerin yüzdelik dağılımını al
    public List<Language> getRepoLanguages(String owner, String repo) {
        String url = GITHUB_API_URL + owner + "/" + repo + "/languages";

        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isEmpty()) {
            return new ArrayList<>();
        }

        JSONObject json = new JSONObject(response);
        List<Language> languages = new ArrayList<>();
        int totalBytes = json.toMap().values().stream().mapToInt(val -> (int) val).sum();

        json.keys().forEachRemaining(key -> {
            int bytes = json.getInt(key);
            double percentage = (double) bytes / totalBytes * 100;
            languages.add(new Language(key, percentage));
        });

        return languages;
    }

    // 📌 2️⃣ Repo'daki toplam kod satır sayısını al
    public int getTotalLinesOfCode(String owner, String repo) {
        String url = GITHUB_API_URL + owner + "/" + repo + "/stats/code_frequency";

        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isEmpty()) {
            return 0;
        }

        System.out.println("GitHub API Response: " + response);

        try {
            // JSON dizisi kontrolü
            if (response.startsWith("[")) {
                JSONArray jsonArray = new JSONArray(response);
                int totalLines = 0;

                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONArray weekData = jsonArray.getJSONArray(i);
                    int addedLines = weekData.getInt(1); // Eklenen satır sayısı
                    totalLines += addedLines;
                }

                return totalLines;
            } else {
                // Hatalı JSON formatı
                throw new JSONException("Yanıt beklenen JSON array formatında değil.");
            }
        } catch (JSONException e) {
            // Hata durumu
            System.err.println("JSON işleme hatası: " + e.getMessage());
            return 0;
        }
    }
}
