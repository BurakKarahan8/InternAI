package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.dto.CompanyDTO;
import com.burakkarahan.InternAI.model.Company;
import com.burakkarahan.InternAI.model.CompanyVerificationToken;
import com.burakkarahan.InternAI.repository.CompanyRepository;
import com.burakkarahan.InternAI.repository.CompanyVerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private static final Logger logger = LoggerFactory.getLogger(CompanyService.class);

    private final CompanyRepository companyRepository;
    private final CompanyVerificationTokenRepository companyTokenRepository;
    private final EmailService emailService;

    public void registerCompany(Company company) {
        try {
            Company savedCompany = companyRepository.save(company);
            String token = UUID.randomUUID().toString();

            CompanyVerificationToken verificationToken = CompanyVerificationToken.builder()
                    .token(token)
                    .company(savedCompany)
                    .expiryDate(LocalDateTime.now().plusHours(24))
                    .build();

            companyTokenRepository.save(verificationToken);

            String verificationLink = "http://localhost:8080/api/companies/verify?token=" + token;

            String to = company.getCompanyEmail();
            String subject = "Şirket Hesabınızı Doğrulayın";
            String body = "Hesabınızı doğrulamak için bu linke tıklayın: " + verificationLink;

            emailService.sendEmail(to, subject, body);

            logger.info("Doğrulama linki gönderildi: {}", verificationLink);

        } catch (Exception e) {
            logger.error("Şirket kaydı sırasında hata: ", e);
        }
    }

    public void verifyCompanyEmail(String token) {
        CompanyVerificationToken verificationToken = companyTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Geçersiz token"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token süresi dolmuş.");
        }

        Company company = verificationToken.getCompany();
        company.setEmailVerified(true);
        companyRepository.save(company);

        logger.info("Şirket e-posta doğrulaması başarılı: {}", company.getCompanyEmail());
    }

    public CompanyDTO loginCompany(String email, String password) {
        Company company = companyRepository.findByCompanyEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Bu e-posta adresiyle kayıtlı bir şirket bulunamadı."));

        if (!company.getCompanyPassword().equals(password)) {
            throw new IllegalArgumentException("Şifre yanlış.");
        }

        if (!company.isEmailVerified()) {
            throw new IllegalArgumentException("E-posta adresiniz henüz doğrulanmamış.");
        }

        return CompanyDTO.builder()
                .companyName(company.getCompanyName())
                .companyUsername(company.getCompanyUsername())
                .companyEmail(company.getCompanyEmail())
                .companyPhone(company.getCompanyPhone())
                .companyAddress(company.getCompanyAddress())
                .build();
    }

}
