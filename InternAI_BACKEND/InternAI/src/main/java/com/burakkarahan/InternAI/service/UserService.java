package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.model.User;
import com.burakkarahan.InternAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired  // constructor injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ID'ye göre kullanıcıyı getir
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    // Kullanıcı adına göre kullanıcıyı getir
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // E-posta adresine göre kullanıcıyı getir
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Yeni kullanıcı oluştur
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Kullanıcı bilgilerini güncelle
    public User updateUser(UUID id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    if (updatedUser.getUsername() != null)
                        user.setUsername(updatedUser.getUsername());
                    if (updatedUser.getEmail() != null)
                        user.setEmail(updatedUser.getEmail());
                    if (updatedUser.getPassword() != null)
                        user.setPassword(updatedUser.getPassword());
                    if (updatedUser.getFullName() != null)
                        user.setFullName(updatedUser.getFullName());
                    if (updatedUser.getProfilePicture() != null)
                        user.setProfilePicture(updatedUser.getProfilePicture());
                    return userRepository.save(user);
                })
                .orElse(null);
    }
    // Kullanıcıyı sil
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    //login işlemi
    public String loginUser(User loginRequest) {
        Optional<User> userOptional = getUserByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return "Kullanıcı bulunamadı.";
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return "Şifre yanlış.";
        }

        return "Giriş başarılı!";
    }
}
