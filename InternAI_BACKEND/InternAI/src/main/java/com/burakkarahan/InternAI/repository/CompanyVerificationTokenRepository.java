package com.burakkarahan.InternAI.repository;

import com.burakkarahan.InternAI.model.CompanyVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface CompanyVerificationTokenRepository extends JpaRepository<CompanyVerificationToken, UUID> {
    Optional<CompanyVerificationToken> findByToken(String token);
}
