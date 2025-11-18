package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.dto.ApplicationResponseDTO;
import com.burakkarahan.InternAI.enums.ApplicationStatus;
import com.burakkarahan.InternAI.model.Application;
import com.burakkarahan.InternAI.model.JobPost;
import com.burakkarahan.InternAI.model.User;
import com.burakkarahan.InternAI.repository.ApplicationRepository;
import com.burakkarahan.InternAI.repository.JobPostRepository;
import com.burakkarahan.InternAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {


    private final ApplicationRepository applicationRepository;


    private final UserRepository userRepository;


    private final JobPostRepository jobPostRepository;

    public ApplicationResponseDTO applyToJob(UUID userId, UUID jobPostId, String coverLetter) {
        Optional<Application> existing = applicationRepository.findByApplicant_IdAndJobPost_Id(userId, jobPostId);
        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu ilana zaten başvurdunuz.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));

        Application application = new Application();
        application.setApplicant(user);
        application.setJobPost(jobPost);
        application.setCoverLetter(coverLetter);
        application.setStatus(ApplicationStatus.PENDING);
        application.setApplyDate(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        return new ApplicationResponseDTO(
                saved.getId(),
                user.getId(),
                jobPost.getId(),
                user.getFullName(),
                user.getEmail(),
                jobPost.getTitle(),
                jobPost.getCompany().getCompanyName(),
                saved.getCoverLetter(),
                saved.getStatus(),
                saved.getApplyDate()
        );
    }

    // Başvuru durumunu değiştirme örneği
    public Application updateApplicationStatus(UUID applicationId, ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(newStatus);
        return applicationRepository.save(application);
    }

    // İlan başvurularını listeleme
    public List<Application> getApplicationsByJobPost(UUID jobPostId) {
        return applicationRepository.findByJobPostId(jobPostId);
    }

    // Kullanıcının başvurularını DTO listesi olarak döner
    public List<ApplicationResponseDTO> getApplicationsByUser(UUID userId) {
        List<Application> applications = applicationRepository.findByApplicantId(userId);

        return applications.stream()
                .map(app -> new ApplicationResponseDTO(
                        app.getId(),
                        app.getApplicant().getId(),
                        app.getJobPost().getId(),
                        app.getApplicant().getFullName(),
                        app.getApplicant().getEmail(),
                        app.getJobPost().getTitle(),
                        app.getJobPost().getCompany().getCompanyName(),
                        app.getCoverLetter(),
                        app.getStatus(),
                        app.getApplyDate()
                ))
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDTO> getApplicationsByJobId(UUID jobId) {
        List<Application> applications = applicationRepository.findByJobPostId(jobId);

        return applications.stream().map(app -> {
            ApplicationResponseDTO dto = new ApplicationResponseDTO();
            dto.setId(app.getId());
            dto.setUserId(app.getApplicant().getId());
            dto.setJobPostId(app.getJobPost().getId());
            dto.setFullName(app.getApplicant().getFullName());
            dto.setEmail(app.getApplicant().getEmail());
            dto.setJobTitle(app.getJobPost().getTitle());
            dto.setCompanyName(app.getJobPost().getCompany().getCompanyName());
            dto.setCoverLetter(app.getCoverLetter());
            dto.setStatus(app.getStatus());
            dto.setApplyDate(app.getApplyDate());
            return dto;
        }).collect(Collectors.toList());
    }
}

