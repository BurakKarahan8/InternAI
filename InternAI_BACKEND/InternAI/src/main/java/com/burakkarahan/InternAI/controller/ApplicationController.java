package com.burakkarahan.InternAI.controller;

import com.burakkarahan.InternAI.dto.ApplicationResponseDTO;
import com.burakkarahan.InternAI.dto.JobApplicationRequestDTO;
import com.burakkarahan.InternAI.enums.ApplicationStatus;
import com.burakkarahan.InternAI.model.Application;
import com.burakkarahan.InternAI.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {


    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponseDTO> applyToJob(@RequestBody JobApplicationRequestDTO request) {
        ApplicationResponseDTO responseDTO = applicationService.applyToJob(
                request.getUserId(),
                request.getJobPostId(),
                request.getCoverLetter()
        );
        return ResponseEntity.ok(responseDTO);
    }


    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable UUID applicationId,
                                                    @RequestParam ApplicationStatus status) {
        Application updatedApp = applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok(updatedApp);
    }

    @GetMapping("/jobpost/{jobPostId}")
    public ResponseEntity<List<Application>> getApplicationsForJobPost(@PathVariable UUID jobPostId) {
        List<Application> applications = applicationService.getApplicationsByJobPost(jobPostId);
        return ResponseEntity.ok(applications);
    }

    // Kullanıcının başvurularını getirir
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsByUser(@PathVariable UUID userId) {
        List<ApplicationResponseDTO> applications = applicationService.getApplicationsByUser(userId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsByJobId(@PathVariable UUID jobId) {
        List<ApplicationResponseDTO> applications = applicationService.getApplicationsByJobId(jobId);
        return ResponseEntity.ok(applications);
    }

}

