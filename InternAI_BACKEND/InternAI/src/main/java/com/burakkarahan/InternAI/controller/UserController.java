package com.burakkarahan.InternAI.controller;

import com.burakkarahan.InternAI.service.UserService;
import com.burakkarahan.InternAI.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> login(@RequestBody User user) {
        try {
            String result = userService.loginUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
