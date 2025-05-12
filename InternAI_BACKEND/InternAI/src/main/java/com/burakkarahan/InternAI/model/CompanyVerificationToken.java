package com.burakkarahan.InternAI.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "company_verification_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;
}

