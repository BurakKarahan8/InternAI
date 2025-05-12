package com.burakkarahan.InternAI.repository;

import com.burakkarahan.InternAI.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    // e-posta ile şirketi bulma
    Optional<Company> findByCompanyEmail(String email);
}
