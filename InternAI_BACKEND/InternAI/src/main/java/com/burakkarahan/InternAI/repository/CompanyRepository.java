package com.burakkarahan.InternAI.repository;

import com.burakkarahan.InternAI.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    // e-posta ile şirketi bulma
    Optional<Company> findByCompanyEmail(String email);
}
