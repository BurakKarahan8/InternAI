package com.burakkarahan.InternAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationRequestDTO {
    private UUID userId;
    private UUID jobPostId;
    private String coverLetter;
}
