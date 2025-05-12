package com.burakkarahan.InternAI.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "company")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // UUID için AUTO yerine UUID kullan (Spring Boot 3 için önerilen)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID companyId;

    @Column(name = "company_name", nullable = false, unique = true, length = 50)
    private String companyName;

    @Column(name = "company_username", nullable = false, unique = true, length = 50)
    private String companyUsername;

    @Column(name = "company_password", nullable = false, length = 50)
    private String companyPassword;

    @Column(name = "company_email", nullable = false, unique = true)
    private String companyEmail;

    @Column(name = "company_phone", nullable = false, unique = true)
    private String companyPhone;

    @Column(name = "company_address", nullable = false)
    private String companyAddress;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime companyUpdatedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime companyCreatedAt;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;
}
