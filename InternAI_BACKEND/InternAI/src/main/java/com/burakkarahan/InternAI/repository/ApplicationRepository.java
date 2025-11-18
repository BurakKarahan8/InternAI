package com.burakkarahan.InternAI.repository;

import com.burakkarahan.InternAI.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByJobPostId(UUID jobPostId);
    List<Application> findByApplicantId(UUID applicantId);
    Optional<Application> findByApplicant_IdAndJobPost_Id(UUID userId, UUID jobPostId);
    void deleteByJobPost_Id(UUID jobPostId);


}

