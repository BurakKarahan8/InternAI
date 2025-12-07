package com.burakkarahan.InternAI.dto;

import com.burakkarahan.InternAI.model.Language;
import java.util.List;

public class CvAnalysisResultDTO {

    private List<String> extractedSkills;
    private List<String> extractedProjects;
    private List<Language> githubLanguages;
    private Double compatibilityScore;
    private String compatibilityMessage;

    public CvAnalysisResultDTO(List<String> extractedSkills, List<String> extractedProjects, List<Language> githubLanguages, Double compatibilityScore, String compatibilityMessage) {
        this.extractedSkills = extractedSkills;
        this.extractedProjects = extractedProjects;
        this.githubLanguages = githubLanguages;
        this.compatibilityScore = compatibilityScore;
        this.compatibilityMessage = compatibilityMessage;
    }

    public CvAnalysisResultDTO() {}

    public List<String> getExtractedSkills() { return extractedSkills; }
    public List<String> getExtractedProjects() { return extractedProjects; }
    public List<Language> getGithubLanguages() { return githubLanguages; }
    public Double getCompatibilityScore() { return compatibilityScore; }
    public String getCompatibilityMessage() { return compatibilityMessage; }

    public void setExtractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; }
    public void setExtractedProjects(List<String> extractedProjects) { this.extractedProjects = extractedProjects; }
    public void setGithubLanguages(List<Language> githubLanguages) { this.githubLanguages = githubLanguages; }
    public void setCompatibilityScore(Double compatibilityScore) { this.compatibilityScore = compatibilityScore; }
    public void setCompatibilityMessage(String compatibilityMessage) { this.compatibilityMessage = compatibilityMessage; }
}