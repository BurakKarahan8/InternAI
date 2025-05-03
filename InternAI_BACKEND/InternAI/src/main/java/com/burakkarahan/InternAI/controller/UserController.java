package com.burakkarahan.InternAI.controller;

import com.burakkarahan.InternAI.dto.UserDTO;
import com.burakkarahan.InternAI.service.UserService;
import com.burakkarahan.InternAI.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("Kayıt başarılı. Lütfen e-postanı kontrol et.");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        try {
            userService.verifyUserEmail(token);
            return ResponseEntity.ok("E-posta doğrulama başarılı!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Geçersiz veya süresi dolmuş token.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody User user) {
        try {
            UserDTO userDTO = userService.loginUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(userDTO);  // Kullanıcı bilgilerini JSON olarak döndür
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);  // Hata durumunda null döndürüyoruz
        }
    }

    // UserController.java
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody User updatedUser) {
        try {
            userService.updateUser(updatedUser);
            return ResponseEntity.ok("Bilgiler güncellendi.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Güncelleme sırasında bir hata oluştu.");
        }
    }

    @PutMapping("/update-profile-picture")
    public ResponseEntity<String> updateProfilePicture(@RequestParam("email") String email,
                                                       @RequestParam("profilePicture") MultipartFile file) {
        try {
            userService.updateProfilePicture(email, file);
            return ResponseEntity.ok("Profil fotoğrafınız başarıyla güncellendi.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fotoğraf güncellenirken bir hata oluştu.");
        }
    }



}
