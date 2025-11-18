package com.burakkarahan.InternAI.repository;

import com.burakkarahan.InternAI.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface JobPostRepository extends JpaRepository<JobPost, UUID> {
    List<JobPost> findByCompany_CompanyId(UUID companyId);
}

