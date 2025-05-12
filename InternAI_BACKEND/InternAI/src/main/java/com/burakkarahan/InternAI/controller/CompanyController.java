package com.burakkarahan.InternAI.controller;

import com.burakkarahan.InternAI.dto.CompanyDTO;
import com.burakkarahan.InternAI.model.Company;
import com.burakkarahan.InternAI.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // Şirket kayıt işlemi
    @PostMapping("/register")
    public ResponseEntity<String> registerCompany(@RequestBody Company company) {
        companyService.registerCompany(company);
        return ResponseEntity.ok("Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.");
    }

    // E-posta doğrulama işlemi
    @GetMapping("/verify")
    public ResponseEntity<String> verifyCompanyEmail(@RequestParam("token") String token) {
        try {
            companyService.verifyCompanyEmail(token);
            return ResponseEntity.ok("E-posta doğrulaması başarılı.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Doğrulama başarısız: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<CompanyDTO> login(@RequestBody Company company) {
        try {
            // Şirket doğrulama işlemi
            CompanyDTO companyDTO = companyService.loginCompany(company.getCompanyEmail(), company.getCompanyPassword());
            return ResponseEntity.ok(companyDTO);  // Şirket bilgilerini JSON olarak döndür
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);  // Hata durumunda null döndürüyoruz
        }
    }
}

