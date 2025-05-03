package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.model.Language;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class GithubService {

    private static final String GITHUB_API_URL = "https://api.github.com/";

    private final WebClient webClient;

    // Token'ı application.properties üzerinden alıyoruz
    public GithubService(WebClient.Builder webClientBuilder,
                         @Value("${github.token}") String githubToken) {
        this.webClient = webClientBuilder
                .baseUrl(GITHUB_API_URL)
                .defaultHeader("Authorization", "Bearer " + githubToken)
                .build();
    }

    public List<Language> getUserLanguages(String owner) {
        String url = GITHUB_API_URL + "users/" + owner + "/repos";
        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isEmpty()) return new ArrayList<>();

        JSONArray repos = new JSONArray(response);
        List<Language> allLanguages = new ArrayList<>();

        for (int i = 0; i < repos.length(); i++) {
            JSONObject repo = repos.getJSONObject(i);
            String repoName = repo.getString("name");
            List<Language> repoLanguages = getRepoLanguages(owner, repoName);
            allLanguages.addAll(repoLanguages);
        }

        return allLanguages;
    }

    public List<Language> getRepoLanguages(String owner, String repo) {
        String url = GITHUB_API_URL + "repos/" + owner + "/" + repo + "/languages";
        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isEmpty()) return new ArrayList<>();

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

    public int getTotalLinesOfCode(String owner) {
        String url = GITHUB_API_URL + "users/" + owner + "/repos";
        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isEmpty()) return 0;

        JSONArray repos = new JSONArray(response);
        int totalLines = 0;

        for (int i = 0; i < repos.length(); i++) {
            JSONObject repo = repos.getJSONObject(i);
            String repoName = repo.getString("name");
            totalLines += getTotalLinesOfCodeForRepo(owner, repoName);
        }

        return totalLines;
    }

    public int getTotalLinesOfCodeForRepo(String owner, String repo) {
        String url = GITHUB_API_URL + "repos/" + owner + "/" + repo + "/stats/code_frequency";
        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null || response.isEmpty()) return 0;

        try {
            if (response.startsWith("[")) {
                JSONArray jsonArray = new JSONArray(response);
                int totalLines = 0;

                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONArray weekData = jsonArray.getJSONArray(i);
                    int addedLines = weekData.getInt(1);
                    totalLines += addedLines;
                }

                return totalLines;
            } else {
                throw new JSONException("Yanıt beklenen JSON array formatında değil.");
            }
        } catch (JSONException e) {
            System.err.println("JSON işleme hatası: " + e.getMessage());
            return 0;
        }
    }
}
