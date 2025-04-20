package com.burakkarahan.InternAI.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter  // Lombok ile getter metodlarını ekler
@Setter  // Lombok ile setter metodlarını ekler
@NoArgsConstructor  // Parametresiz constructor
@AllArgsConstructor // Tüm alanları içeren constructor
@Builder  // Builder pattern desteği
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // UUID için AUTO yerine UUID kullan (Spring Boot 3 için önerilen)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "profile_picture")
    private String profilePicture;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "email_verified")
    private boolean emailVerified = false;

}
