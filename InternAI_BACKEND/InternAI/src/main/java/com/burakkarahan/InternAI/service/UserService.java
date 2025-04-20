package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.model.User;
import com.burakkarahan.InternAI.model.VerificationToken;
import com.burakkarahan.InternAI.repository.UserRepository;
import com.burakkarahan.InternAI.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    public void registerUser(User user) {
        try {
            // Kullanıcıyı kaydet
            User savedUser = userRepository.save(user);

            // Token oluştur
            String token = UUID.randomUUID().toString();

            VerificationToken verificationToken = VerificationToken.builder()
                    .token(token)
                    .user(savedUser)
                    .expiryDate(LocalDateTime.now().plusHours(24)) // 24 saat geçerli
                    .build();

            tokenRepository.save(verificationToken);

            // Doğrulama linkini oluştur
            String verificationLink = "http://localhost:8080/api/users/verify?token=" + token;

            // E-posta gönder
            String to = user.getEmail();
            String emailSubject = "Hesabınızı Doğrulayın";
            String emailBody = "Hesabınızı doğrulamak için şu linke tıklayın: " + verificationLink;
            emailService.sendEmail(to, emailSubject, emailBody);

            // Doğrulama linki log
            logger.info("Doğrulama linki: {}", verificationLink);

        } catch (Exception e) {
            // Hata logu
            logger.error("Kullanıcı kaydederken bir hata oluştu: ", e);
        }
    }

    public void verifyUserEmail(String token) {
        // Token'ı bul
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Geçersiz token"));

        // Token süresi kontrolü
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token süresi dolmuş.");
        }

        // Kullanıcıyı bul ve doğrulama işlemini gerçekleştir
        User user = verificationToken.getUser();
        user.setEmailVerified(true); // Kullanıcıyı onayla
        userRepository.save(user); // Kullanıcıyı kaydet

        // Kullanıcı onaylandığında log at
        logger.info("Kullanıcı e-posta doğrulaması başarılı: {}", user.getEmail());
    }

    public String loginUser(String email, String password) {
        // E-posta ile kullanıcıyı ara
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı."));

        // Şifre kontrolü (şifre hash'lenmişse burada ayrıca kontrol gerekir)
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Şifre yanlış.");
        }

        // E-posta doğrulama kontrolü
        if (!user.isEmailVerified()) {
            throw new IllegalArgumentException("E-posta adresiniz henüz doğrulanmamış.");
        }

        // Başarılı giriş
        return user.getFullName();
    }
}
