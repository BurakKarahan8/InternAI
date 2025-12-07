package com.burakkarahan.InternAI.dto;

import java.util.List;

public class CvExtractionDTO {

    // Front-end'e gösterilecek tüm beceriler (Ham liste)
    private List<String> allSkills;

    // Karşılaştırma için kullanılacak temizlenmiş ana diller
    private List<String> comparisonLanguages;

    private List<String> extractedProjects;

    public CvExtractionDTO() {}

    public CvExtractionDTO(List<String> allSkills, List<String> comparisonLanguages, List<String> extractedProjects) {
        this.allSkills = allSkills;
        this.comparisonLanguages = comparisonLanguages;
        this.extractedProjects = extractedProjects;
    }

    public List<String> getAllSkills() {
        return allSkills;
    }

    public List<String> getComparisonLanguages() {
        return comparisonLanguages;
    }

    public List<String> getExtractedProjects() {
        return extractedProjects;
    }

    public void setAllSkills(List<String> allSkills) {
        this.allSkills = allSkills;
    }

    public void setComparisonLanguages(List<String> comparisonLanguages) {
        this.comparisonLanguages = comparisonLanguages;
    }

    public void setExtractedProjects(List<String> extractedProjects) {
        this.extractedProjects = extractedProjects;
    }
}