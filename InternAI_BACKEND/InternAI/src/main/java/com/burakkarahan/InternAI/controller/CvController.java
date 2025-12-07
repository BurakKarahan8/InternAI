package com.burakkarahan.InternAI.controller;

import com.burakkarahan.InternAI.dto.CvAnalysisResultDTO;
import com.burakkarahan.InternAI.service.CvAnalysisService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/cv")
public class CvController {

    private final CvAnalysisService cvAnalysisService;

    public CvController(CvAnalysisService cvAnalysisService) {
        this.cvAnalysisService = cvAnalysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeCv(@RequestParam("file") MultipartFile cvFile) {

        String githubUsername = "BurakKarahan8";

        if (cvFile.isEmpty()) {
            return new ResponseEntity<>("CV dosyası yüklenmedi.", HttpStatus.BAD_REQUEST);
        }

        try {
            String cvContent = extractTextFromPdf(cvFile);

            if (cvContent.trim().isEmpty()) {
                return new ResponseEntity<>("CV içeriği okunamadı veya dosya formatı desteklenmiyor.", HttpStatus.BAD_REQUEST);
            }

            CvAnalysisResultDTO result = cvAnalysisService.analyzeCvAndIntegrateGithub(cvContent, githubUsername);

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dosya okuma hatası veya yalnızca PDF dosyaları desteklenmektedir.");
        } catch (RuntimeException e) {
            System.err.println("Analiz sırasında kritik Runtime hata oluştu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Analiz servisinde beklenmedik bir hata oluştu.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Beklenmedik bir sunucu hatası.");
        }
    }

    private String extractTextFromPdf(MultipartFile cvFile) throws IOException {
        if (!"application/pdf".equals(cvFile.getContentType())) {
            throw new IOException("Desteklenmeyen dosya formatı. Lütfen bir PDF dosyası yükleyin.");
        }

        try (PDDocument document = PDDocument.load(cvFile.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (Exception e) {
            throw new IOException("PDF dosyası işlenemedi veya bozuk.");
        }
    }
}