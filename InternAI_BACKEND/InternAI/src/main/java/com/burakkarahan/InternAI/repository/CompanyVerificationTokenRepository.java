package com.burakkarahan.InternAI.repository;

import com.burakkarahan.InternAI.model.CompanyVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CompanyVerificationTokenRepository extends JpaRepository<CompanyVerificationToken, UUID> {
    Optional<CompanyVerificationToken> findByToken(String token);
}
