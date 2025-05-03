package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.dto.UserDTO;
import com.burakkarahan.InternAI.model.User;
import com.burakkarahan.InternAI.model.VerificationToken;
import com.burakkarahan.InternAI.repository.UserRepository;
import com.burakkarahan.InternAI.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
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

    public UserDTO loginUser(String email, String password) {
        // E-posta ile kullanıcıyı ara
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı."));

        // Şifre kontrolü
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Şifre yanlış.");
        }

        // E-posta doğrulama kontrolü
        if (!user.isEmailVerified()) {
            throw new IllegalArgumentException("E-posta adresiniz henüz doğrulanmamış.");
        }

        // Profil fotoğrafını Base64'e çevirme
        String profilePictureBase64 = user.getProfilePicture() != null
                ? Base64.getEncoder().encodeToString(user.getProfilePicture())
                : null;  // Eğer profil fotoğrafı yoksa null döndür

        // Kullanıcı bilgilerini DTO'ya map et
        return new UserDTO(user.getFullName(), user.getEmail(), profilePictureBase64, user.getUsername());
    }

    // güncelleme işlemi
    public void updateUser(User updatedUser) {
        User existingUser = userRepository.findByEmail(updatedUser.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setPassword(updatedUser.getPassword()); // Eğer şifre de güncelleniyorsa

        userRepository.save(existingUser);
    }

    public void updateProfilePicture(String email, MultipartFile file) throws IOException {
        // Kullanıcıyı e-posta ile bul
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı"));

        // Fotoğrafı byte[] formatına çevir
        byte[] photoBytes = file.getBytes();

        // Kullanıcıya fotoğrafı ata
        user.setProfilePicture(photoBytes);

        // Güncellenmiş kullanıcıyı kaydet
        userRepository.save(user);
    }



}
