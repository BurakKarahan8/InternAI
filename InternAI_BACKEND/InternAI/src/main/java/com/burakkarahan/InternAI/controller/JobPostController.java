package com.burakkarahan.InternAI.controller;

import com.burakkarahan.InternAI.dto.JobPostRequestDTO;
import com.burakkarahan.InternAI.dto.JobPostUpdateDTO;
import com.burakkarahan.InternAI.model.JobPost;
import com.burakkarahan.InternAI.service.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobposts")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;

    @PostMapping("/create")
    public ResponseEntity<?> createJobPost(@RequestBody JobPostRequestDTO jobPostRequestDTO) {
        System.out.println("Gelen iş ilanı verisi: " + jobPostRequestDTO );
        JobPost createdPost = jobPostService.createJobPost(jobPostRequestDTO);
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/jobposts")
    public ResponseEntity<List<JobPostRequestDTO>> getAllJobPosts() {
        return ResponseEntity.ok(jobPostService.getAllJobPosts());
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getJobPostsByCompanyId(@PathVariable UUID companyId) {
        return ResponseEntity.ok(jobPostService.getJobPostsByCompanyId(companyId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteJobPost(@PathVariable UUID id) {
        boolean deleted = jobPostService.deleteJobPostById(id);
        if (deleted) {
            return ResponseEntity.ok().body("İlan başarıyla silindi.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("İlan bulunamadı.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostRequestDTO> getJobPostById(@PathVariable UUID id) {
        JobPostRequestDTO jobPostDTO = jobPostService.getJobPostById(id);
        return ResponseEntity.ok(jobPostDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<JobPostRequestDTO> updateJobPost(
            @PathVariable UUID id,
            @RequestBody JobPostUpdateDTO dto) {
        JobPostRequestDTO updatedJob = jobPostService.updateJobPost(id, dto);
        return ResponseEntity.ok(updatedJob);
    }



}
