package com.burakkarahan.InternAI.service;

import com.burakkarahan.InternAI.dto.JobPostRequestDTO;
import com.burakkarahan.InternAI.dto.JobPostUpdateDTO;
import com.burakkarahan.InternAI.exception.ResourceNotFoundException;
import com.burakkarahan.InternAI.model.Company;
import com.burakkarahan.InternAI.model.JobPost;
import com.burakkarahan.InternAI.repository.ApplicationRepository;
import com.burakkarahan.InternAI.repository.CompanyRepository;
import com.burakkarahan.InternAI.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobPostService {

    private final JobPostRepository jobPostRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    public JobPost createJobPost(JobPostRequestDTO dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Şirket bulunamadı."));

        JobPost jobPost = JobPost.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .technologies(dto.getTechnologies())
                .city(dto.getCity())
                .country(dto.getCountry())
                .deadline(dto.getDeadline())
                .company(company)
                .build();

        return jobPostRepository.save(jobPost);
    }

    public List<JobPostRequestDTO> getAllJobPosts() {
        return jobPostRepository.findAll().stream().map(jobPost -> {
            JobPostRequestDTO dto = new JobPostRequestDTO();
            dto.setId(jobPost.getId());
            dto.setTitle(jobPost.getTitle());
            dto.setCompanyName(jobPost.getCompany().getCompanyName());
            dto.setDescription(jobPost.getDescription());
            dto.setTechnologies(jobPost.getTechnologies());
            dto.setCity(jobPost.getCity());
            dto.setCountry(jobPost.getCountry());
            dto.setDeadline(jobPost.getDeadline());
            dto.setCompanyId(jobPost.getCompany().getCompanyId());
            return dto;
        }).toList();
    }

    public List<JobPostRequestDTO> getJobPostsByCompanyId(UUID companyId) {
        List<JobPost> jobPosts = jobPostRepository.findByCompany_CompanyId(companyId);

        return jobPosts.stream().map(jobPost -> {
            JobPostRequestDTO dto = new JobPostRequestDTO();
            dto.setId(jobPost.getId());
            dto.setTitle(jobPost.getTitle());
            dto.setCompanyName(jobPost.getCompany().getCompanyName());
            dto.setDescription(jobPost.getDescription());
            dto.setTechnologies(jobPost.getTechnologies());
            dto.setCity(jobPost.getCity());
            dto.setCountry(jobPost.getCountry());
            dto.setDeadline(jobPost.getDeadline());
            dto.setCompanyId(jobPost.getCompany().getCompanyId());
            return dto;
        }).toList();

    }

    @Transactional
    public boolean deleteJobPostById(UUID id) {
        Optional<JobPost> jobPostOptional = jobPostRepository.findById(id);
        if (jobPostOptional.isPresent()) {
            // Önce ilgili başvuruları sil
            applicationRepository.deleteByJobPost_Id(id);
            // Sonra ilanı sil
            jobPostRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public JobPostRequestDTO getJobPostById(UUID id) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("İlan bulunamadı: " + id));

        return mapToResponseDTO(jobPost);
    }

    public JobPostRequestDTO updateJobPost(UUID id, JobPostUpdateDTO dto) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job post bulunamadı: " + id));

        jobPost.setTitle(dto.getTitle());
        jobPost.setDescription(dto.getDescription());
        jobPost.setTechnologies(dto.getTechnologies());
        jobPost.setCity(dto.getCity());
        jobPost.setCountry(dto.getCountry());
        jobPost.setDeadline(dto.getDeadline());

        JobPost updated = jobPostRepository.save(jobPost);

        // Dönüş için uygun DTO mapping yap
        return mapToResponseDTO(updated);
    }

    private JobPostRequestDTO mapToResponseDTO(JobPost jobPost) {
        JobPostRequestDTO dto = new JobPostRequestDTO();
        dto.setId(jobPost.getId());
        dto.setTitle(jobPost.getTitle());
        dto.setDescription(jobPost.getDescription());
        dto.setTechnologies(jobPost.getTechnologies());
        dto.setCity(jobPost.getCity());
        dto.setCountry(jobPost.getCountry());
        dto.setDeadline(jobPost.getDeadline());
        // gerekirse diğer alanlar da eklenebilir
        return dto;
    }

}
