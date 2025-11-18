package com.burakkarahan.InternAI.dto;

import com.burakkarahan.InternAI.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationResponseDTO {
    private UUID id;
    private UUID userId;
    private UUID jobPostId;
    private String fullName;
    private String email;
    private String jobTitle;
    private String companyName;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime applyDate;
}